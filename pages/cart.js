import { useContext, useState } from 'react';
import Link from 'next/link';
import dynamic from "next/dynamic";
import {Row, Col, Card, Button, Table, Image, Alert, Form, Breadcrumb, Toast} from 'react-bootstrap';
import Layout from "../components/Layout";
import {Store} from "../utils/Store";
import axios from "axios";

function CartPage() {

	const { state: { cart: { cartItems = [] } }, dispatch } = useContext(Store);
	const [isOutOfStock, setIsOutOfStock] = useState(false);

	const handleRemoveFromCart = (product) => {
		dispatch({ type: 'CART_REMOVE_ITEM', payload: product });
	};

	const handleChangeQuantity = async (product, qty) => {
		const quantity = Number(qty);
		const { data } = await axios.get(`/api/products/${product._id}`);
		if (data.countInStock < quantity) {
			return setIsOutOfStock(true);
		}
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
	};

	return (
		<Layout title="Cart">
			<Breadcrumb>
				<Link href="/">
					<a className="breadcrumb-item">Home</a>
				</Link>
				<Breadcrumb.Item active>Cart</Breadcrumb.Item>
			</Breadcrumb>
			<h1>Shopping cart</h1>
			{
				cartItems.length === 0 ? (
					<Alert variant="danger">
						Cart is empty <Link href="/">Back to shop</Link>
					</Alert>
				) : (
					<Row>
						<Col md={8}>
							<Table>
								<thead>
								<tr>
									<th>Product</th>
									<th>Quantity</th>
									<th>Price</th>
									<th style={{ textAlign: 'right' }}>Action</th>
								</tr>
								</thead>
								<tbody>
								{
									cartItems.map((product, index) => (
										<tr key={index}>
											<td>
												<div className="d-flex align-items-center">
													<Image
														src={product.image}
														alt={product.name}
														style={{ width: '70px' }}
													/>
													<p className="m-2">{product.name}</p>
												</div>
											</td>
											<td style={{ verticalAlign: 'middle' }}>
												<Form.Select
													value={product.quantity}
													onChange={(e) => handleChangeQuantity(product, e.target.value)}
												>
													{
														[...Array(product.countInStock).keys()].map((x) => (
															<option key={x + 1} value={x + 1}>{x + 1}</option>
														))
													}
												</Form.Select>
											</td>
											<td style={{ verticalAlign: 'middle' }}>
												<span>${product.price}</span>
											</td>
											<td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
												<Button
													variant="outline-danger"
													size="sm"
													onClick={() => handleRemoveFromCart(product)}
												>x</Button>
											</td>
										</tr>
									))
								}
								</tbody>
							</Table>
						</Col>
						<Col/>
						<Col md={3}>
							<Card>
								<Card.Body>
									<Card.Title className="d-flex justify-content-between">
										<span>Subtotal ({ cartItems.reduce((a, c) => a + c.quantity, 0) }):</span>
										<span>${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}</span>
									</Card.Title>
									<Link href="/login?redirect=/shipping">
										<a>
											<Button
												variant="warning"
												className="w-100"
											>Checkout</Button>
										</a>
									</Link>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				)
			}
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

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });