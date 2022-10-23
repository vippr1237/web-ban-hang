const bcrypt = require('bcrypt');

const users = [
	{
		name: 'admin',
		email: 'admin@gmail.com',
		password: bcrypt.hashSync('admin123', 10),
		role: 1,
		cart: [],
	},
];

module.exports = users;