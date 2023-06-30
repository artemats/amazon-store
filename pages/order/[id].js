import {useReducer, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {Alert, Card, Col, Image, Row, Table, Toast} from 'react-bootstrap';
import Layout from "../../components/Layout";
import {getError} from '../../utils/error';

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, order: action.payload, error: '' };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'PAY_REQUEST':
			return { ...state, loadingPay: true };
		case 'PAY_SUCCESS':
			return { ...state, loadingPay: false, successPay: true };
		case 'PAY_FAIL':
			return { ...state, loadingPay: false, errorPay: action.payload };
		case 'PAY_RESET':
			return { ...state, loadingPay: false, successPay: false, errorPay: '' };
		default:
			return state;
	}
}

export default function OrderPage() {

	const { query } = useRouter();
	const orderId = query?.id;
	const [{ loading, error, order, successPay, loadingPay }, dispatch] = useReducer(reducer, {
		loading: true,
		order: {},
		error: '',
	});
	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
	const [orderError, setOrderError] = useState(null);
	const [orderSuccess, setOrderSuccess] = useState(null);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/orders/${orderId}`);
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (error) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
			}
		};

		if (!order._id || successPay || ( order._id && order._id !== orderId )) {
			fetchOrder();
			if (successPay) {
				dispatch({ type: 'PAY_RESET' });
			}
		} else {
			const loadPayPalScript = async () => {
				const { data } = await axios.get('/api/keys/paypal');
				paypalDispatch({
					type: 'resetOptions',
					value: {
						'client-id': data,
						currency: 'USD',
					},
				});
				paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
			};
			loadPayPalScript();
		}
	}, [order, orderId, paypalDispatch, successPay]);

	const {
		shippingAddress,
		isDelivered,
		paymentMethod,
		isPaid,
		orderItems,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
		paidAt,
	} = order;

	function createOrder(data, actions) {
		return actions.order.create({
			purchase_units: [
				{
					amount: {
						value: totalPrice,
					},
				},
			],
		}).then((orderID) => {
			return orderID;
		})
	}

	function onApprove(data, actions) {
		return actions.order.capture().then(async function(details) {
			try {
				dispatch({ type: 'PAY_REQUEST' });
				const { data } = await axios.put(`/api/orders/${order._id}/pay`, details);
				dispatch({ type: 'PAY_SUCCESS', payload: data });
				setOrderSuccess('Order is paid successfully');
			} catch (error) {
				dispatch({ type: 'PAY_FAIL', payload: getError(error) });
				setOrderError(getError(error));
			}
		})
	}

	function onError(error) {
		setOrderError(error);
	}

	return (
		<Layout title={`Order ${orderId}`}>
			<h1>Order {orderId}</h1>
			{loading ? (
					<div>Loading...</div>
				) : error ? (
					<Alert variant="danger">
						{error}
					</Alert>
				) : (
				<Row className="pt-3">
					<Col md={8}>
						<Card className="mb-3">
							<Card.Body>
								<Card.Title>Shipping address</Card.Title>
								<Card.Text>
									{shippingAddress?.fullName}, {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.country}
								</Card.Text>
								{
									isDelivered ? (
										<Alert variant="success">Delivered at</Alert>
									) : (
										<Alert variant="danger">Not delivered</Alert>
									)
								}
							</Card.Body>
						</Card>
						<Card className="mb-3">
							<Card.Body>
								<Card.Title>Payment method</Card.Title>
								<Card.Text>
									{paymentMethod}
								</Card.Text>
								{
									isPaid ? (
										<Alert variant="success">Paid at {paidAt}</Alert>
									) : (
										<Alert variant="danger">Not paid</Alert>
									)
								}
							</Card.Body>
						</Card>
						<Card className="mb-3">
							<Card.Body>
								<Card.Title>Order items</Card.Title>
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
											!!orderItems && (
												orderItems.map((product, index) => (
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
											)
										}
									</tbody>
								</Table>
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
								{
									!isPaid && (
										<>
											{isPending
												? (
													<div>Loading...</div>
												) : (
													<div>
														<PayPalButtons
															createOrder={createOrder}
															onApprove={onApprove}
															onError={onError}/>
													</div>
												)}
										</>
									)
								}
								{ loadingPay && <div>Loading...</div> }
							</Card.Body>
						</Card>
					</Col>
				</Row>
				)
			}
			{
				orderError && (
					<Toast
						className="d-inline-block m-1 toast-custom"
						bg="danger"
						key="danger"
						onClose={() => setOrderError(null)}
					>
						<Toast.Header>
							<strong className="me-auto">Sorry</strong>
						</Toast.Header>
						<Toast.Body className="text-white">
							{orderError}
						</Toast.Body>
					</Toast>
				)
			}
			{
				orderSuccess && (
					<Toast
						className="d-inline-block m-1 toast-custom"
						bg="success"
						key="success"
						onClose={() => setOrderSuccess(null)}
					>
						<Toast.Header>
							<strong className="me-auto">Congratulations</strong>
						</Toast.Header>
						<Toast.Body className="text-white">
							{orderSuccess}
						</Toast.Body>
					</Toast>
				)
			}
		</Layout>
	)
}

OrderPage.auth = true;

