const router = require('express').Router();
const { handleError } = require('../utils');
const multer = require('multer');
const upload = multer();
const { createClient } = require('@supabase/supabase-js');
const { decode } = require('base64-arraybuffer');
const jwtGenerator = require('../jwtGenerator');

const supabase = createClient(
	process.env.SUPABASE_PROJECT_URL,
	process.env.SUPABASE_API_KEY
);

router.post('/upload', upload.single('avatar'), async (req, res) => {
	try {
		const user = req.user;
		const user_id = user.user_id;

		// get file from req object
		const file = req.file;
		const fileType = file.mimetype.split('/')[1];

		// decode file buffer to base64
		const fileBase64 = decode(file.buffer.toString('base64'));

		// upload file to supabase (with replacement)
		const { data, error } = await supabase.storage
			.from('avatars')
			.upload(`user_${user_id}_${Date.now()}.${fileType}`, fileBase64, {
				contentType: 'image/jpeg, image/png',
				upsert: true,
			});

		// get file URL
		const { data: image } = supabase.storage
			.from('avatars')
			.getPublicUrl(data.path);
		const url = image.publicUrl;

		await supabase
			.from('users')
			.update({ avatar_url: url })
			.eq('id', user_id)
			.select();

		// update JWT token payload with new avatar url
		token = jwtGenerator(
			user_id,
			user.first_name,
			user.last_name,
			user.email,
			url
		);
		res.cookie('token', token, { maxAge: 900000, httpOnly: true });

    res.sendStatus(200);
	} catch (error) {
		handleError(error, res);
	}
});

module.exports = router;
