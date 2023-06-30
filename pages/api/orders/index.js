import { getSession } from 'next-auth/react';
import db from "../../../utils/db";
import Order from '../../../models/OrderModel';

const handler = async (req, res) => {
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).json('Unauthorized');
	}

	const { user } = session;
	await db.dbConnect();
	const newOrder = new Order({
		...req.body,
		user: user._id,
	});

	const order = await newOrder.save();
	res.status(201).json(order);
};

export default handler;