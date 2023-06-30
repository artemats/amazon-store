import db from '../../utils/db';
import User from "../../models/UserModel";
import data from "../../utils/data";
import Product from "../../models/ProductModel";

const handler = async (req, res) => {
	await db.dbConnect();
	await User.deleteMany();
	await User.insertMany(data.users);
	await Product.deleteMany();
	await Product.insertMany(data.products);
	await db.dbDisconnect();
	res.status(200).json({ message: 'seeded successfully' });
};

export default handler;