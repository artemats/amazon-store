import db from "../../../utils/db";
import Product from "../../../models/ProductModel";

const handler = async (req, res) => {
	await db.dbConnect();
	const product = await Product.findById(req.query.id);
	await db.dbDisconnect();
	res.send(product);
};

export default handler;