require('dotenv').config();
module.exports = {
	url: process.env.URL ? process.env.URL : 'http://localhost:8080',
};