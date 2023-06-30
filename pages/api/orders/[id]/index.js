import { getSession } from 'next-auth/react';
import db from "../../../../utils/db";
import Order from "../../../../models/OrderModel";

const handler = async (req, res) => {
	const session = await getSession({ req });
	if (!session) {
		return res.status(401).json({ error: 'Not authenticated' });
	}
	await db.dbConnect();
	const order = await Order.findById(req.query.id);
	await db.dbDisconnect();
	res.send(order);
};

export default handler;