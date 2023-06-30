import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import { Alert, Breadcrumb, Row, Col, Image, Table, Card, Button, Toast } from 'react-bootstrap';
import Layout from "../../components/Layout";
import {Store} from "../../utils/Store";
import data from '../../utils/data';
import db from "../../utils/db";
import Product from "../../models/ProductModel";
import axios from "axios";

function ProductPage({ product }) {
	const { state, dispatch } = useContext(Store);
	const router = useRouter();
	const [isOutOfStock, setIsOutOfStock] = useState(false);

	if (!product) {
		return (
			<Layout title="Product Not Found">
				<Alert variant="danger">Product not found</Alert>
			</Layout>
		)
	}

	const handleAddToCart = async () => {
		const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);

		if (data.countInStock < quantity) {
			return setIsOutOfStock(true);
		}
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
		router.push('/cart');
	};

	return (
		<Layout title={product.name}>
			<Breadcrumb>
				<Link href="/">
					<a className="breadcrumb-item">Home</a>
				</Link>
				<Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
			</Breadcrumb>
			<Row>
				<Col md={6}>
					<Image src={product.image}/>
				</Col>
				<Col md={3}>
					<h1>{product.name}</h1>
					<Table responsive="md" style={{ width: 'auto' }}>
						<tbody>
							<tr>
								<td>Category:</td>
								<td>{product.category}</td>
							</tr>
							<tr>
								<td>Brand:</td>
								<td>{product.brand}</td>
							</tr>
							<tr>
								<td>Rating:</td>
								<td>{product.rating} of {product.numReviews}</td>
							</tr>
							<tr>
								<td>Description:</td>
								<td>{product.description}</td>
							</tr>
						</tbody>
					</Table>
				</Col>
				<Col md={3}>
					<Card>
						<Card.Body>
							<Card.Title className="d-flex justify-content-between">
								<span>Price:</span>
								<span>${product.price}</span>
							</Card.Title>
							<Card.Text className="d-flex justify-content-between">
								<span>Status:</span>
								<span>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</span>
							</Card.Text>
							<Button
								variant="warning"
								className="w-100"
								onClick={handleAddToCart}
							>Add to cart</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{
				isOutOfStock && (
					<Toast
						className="d-inline-block m-1 toast-custom"
						bg="danger"
						key="danger"
						onClose={() => setIsOutOfStock(false)}
					>
						<Toast.Header>
							<strong className="me-auto">Sorry</strong>
						</Toast.Header>
						<Toast.Body className="text-white">
							Product is out of stock.
						</Toast.Body>
					</Toast>
				)
			}
		</Layout>
	)
}

export default ProductPage;

export async function getServerSideProps(context) {
	const { params } = context;
	const { slug } = params;

	await db.dbConnect();
	const product = await Product.findOne({ slug }).lean();
	await db.dbDisconnect();
	return {
		props: {
			product: product ? db.convertDocToObj(product) : null,
		}
	}
}