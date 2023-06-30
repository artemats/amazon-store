import {useContext, useEffect, useState} from 'react';
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/router';
import {Row, Col, Card, Image, Table, Toast, Button } from 'react-bootstrap';
import Cookie from "js-cookie";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import {Store} from "../utils/Store";

export default function PlaceOrderPage() {

	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const { cartItems, shippingAddress, paymentMethod } = cart;
	const router = useRouter();
	const [cartData, setCartData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
	const itemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
	const shippingPrice = round2(itemsPrice > 200 ? 1 : 15);
	const taxPrice = round2(0.15 * itemsPrice);
	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

	useEffect(() => {
		setCartData(cartItems);
	}, [shippingAddress, paymentMethod, cartItems]);

	const placeOrderHandler = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post('/api/orders', {
				orderItems: cartData,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
			});
			dispatch({ type: 'CART_CLEAR' });
			Cookie.set('cart', JSON.stringify({
				...cart,
				cartItems: [],
			}));
			router.push(`/order/${data._id}`);
		} catch (err) {
			setLoading(false);
			setError(err.message);
		}
	};

	return (
		<Layout title="Place Order">
			<CheckoutWizard activeStep={3}/>
			{
				cartData.length === 0 ? (
					<div className="pt-2">
						Cart is empty,
						<Link href="/">
							<a className="btn btn-warning m-2">Go shopping</a>
						</Link>
					</div>
				) : (
					<Row className="pt-3">
						<Col md={8}>
							<Card className="mb-3">
								<Card.Body>
									<Card.Title>Shipping address</Card.Title>
									<Card.Text>
										{shippingAddress?.fullName}, {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.country}
									</Card.Text>
									<Link href="/shipping">
										<a className="btn btn-outline-primary">Edit</a>
									</Link>
								</Card.Body>
							</Card>
							<Card className="mb-3">
								<Card.Body>
									<Card.Title>Payment method</Card.Title>
									<Card.Text>
										{paymentMethod}
									</Card.Text>
									<Link href="/payment">
										<a className="btn btn-outline-primary">Edit</a>
									</Link>
								</Card.Body>
							</Card>
							<Card className="mb-3">
								<Card.Body>
									<Card.Title>Order items</Card.Title>
									{
										cartData && (
											<Table>
												<thead>
												<tr>
													<th>Product</th>
													<th>Quantity</th>
													<th>Price</th>
													<th style={{ textAlign: 'right' }}>Subtotal</th>
												</tr>
												</thead>
												<tbody>
												{
													cartData.map((product, index) => (
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
																<span>{product.quantity}</span>
															</td>
															<td style={{ verticalAlign: 'middle' }}>
																<span>${product.price}</span>
															</td>
															<td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
																<span>${product.quantity * product.price}</span>
															</td>
														</tr>
													))
												}
												</tbody>
											</Table>
										)
									}
									<Link href="/cart">
										<a className="btn btn-outline-primary">Edit</a>
									</Link>
								</Card.Body>
							</Card>
						</Col>
						<Col md={4}>
							<Card className="mb-3" style={{ position: 'sticky', top: '1rem' }}>
								<Card.Body>
									<Card.Title>Order summary</Card.Title>
									<Card.Text>
										<span>Items: ${itemsPrice}</span><br/>
										<span>Tax: ${taxPrice}</span><br/>
										<span>Shipping: ${shippingPrice}</span><br/>
										<span>Total: ${totalPrice}</span>
									</Card.Text>
									<br/>
									<Button
										className="btn btn-warning"
										onClick={placeOrderHandler}
									>
										{ loading ? 'Loading...' : 'Place order' }
									</Button>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				)
			}
			{
				error && (
					<Toast
						className="d-inline-block m-1 toast-custom"
						bg="danger"
						key="danger"
						onClose={() => setError(false)}
					>
						<Toast.Header>
							<strong className="me-auto">Sorry</strong>
						</Toast.Header>
						<Toast.Body className="text-white">
							{error}
						</Toast.Body>
					</Toast>
				)
			}
		</Layout>
	)
}

PlaceOrderPage.auth = true;