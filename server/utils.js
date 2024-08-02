const handleError = (err, res) => {
	if (typeof err === 'object' && err.message) {
		res.status(500).json({ errors: [{ msg: err.message }] });
	} else if (typeof err === 'object') {
		res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
	} else {
		res.status(500).json({ errors: [{ msg: err }] });
	}
};

module.exports = {
  handleError,
}