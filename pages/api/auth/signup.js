import db from '../../../utils/db';
import User from '../../../models/UserModel';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
	if (req.method !== 'POST') {
		return;
	}
	const { name, email, password } = req.body;
	if (!name || !email || !email.includes('@') || !password || password.trim().length < 5) {
		return res.status(422).json({ message: 'Validation error' });
	}

	await db.dbConnect();
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		res.status(422).json({ message: 'User already exists' });
		await db.dbDisconnect();
		return;
	}

	const newUser = new User({
		name,
		email,
		password: bcrypt.hashSync(password),
		isAdmin: false
	});

	const user = await newUser.save();
	await db.dbDisconnect();
	res.status(201).send({
		message: 'User created',
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin
	});
}

export default handler;