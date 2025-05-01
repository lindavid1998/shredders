const router = require('express').Router();
const { handleError } = require('../utils');
const multer = require('multer');
const upload = multer();
const { createClient } = require('@supabase/supabase-js');
const { decode } = require('base64-arraybuffer');
const jwtGenerator = require('../jwtGenerator');
const {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
} = require('@aws-sdk/client-s3');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

		// Generate unique file key
		const fileKey = `avatars/user_${user_id}_${Date.now()}.${fileType}`;

		// Put an object into an Amazon S3 bucket.
		await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: fileKey,
				Body: file.buffer,
				ContentType: file.mimetype,
			})
		);

		// Generate the public URL for the uploaded file
		const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
		console.log(url)

		// update url in users db table
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

		res.cookie('token', token, {
			maxAge: 900000,
			httpOnly: true,
			secure: true,
			sameSite: 'None',
		});

		res.sendStatus(200);
	} catch (error) {
		handleError(error, res);
	}
});

module.exports = router;
