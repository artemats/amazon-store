import {useState, useContext, useEffect} from 'react';
import { useRouter } from 'next/router';
import { Form, Row, Col, Button } from "react-bootstrap";
import Cookie from "js-cookie";
import Link from "next/link";
import {Store} from "../utils/Store";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";

export default function PaymentPage() {

	const paymentMethods = ['PayPal', 'Stripe', 'Cash on Delivery'];
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
	const router = useRouter();
	const { state, dispatch } = useContext(Store);
	const { cart: { shippingAddress, paymentMethod } } = state;

	useEffect(() => {
		if (!shippingAddress.address) {
			router.push('/shipping');
		} else {
			setSelectedPaymentMethod(paymentMethod || paymentMethods[0]);
		}
	}, [shippingAddress, paymentMethod, setSelectedPaymentMethod]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
		Cookie.set('cart', JSON.stringify({
			...state.cart,
			paymentMethod: selectedPaymentMethod
		}));
		router.push('/placeorder');
	};

	return (
		<Layout title="Payment Method">
			<CheckoutWizard activeStep={2}/>
			<Row>
				<Col md={4}/>
				<Col md={4}>
					<Form className="pt-3" onSubmit={submitHandler}>
						{
							paymentMethods.map((method, index) => (
								<Form.Check
									key={index}
									type="switch"
									label={method}
									id={method}
									checked={selectedPaymentMethod === method}
									onChange={() => setSelectedPaymentMethod(method)}
									className="mb-2"
								/>
							))
						}
						<div className="d-flex justify-content-between pt-3">
							<Link href="/shipping">
								<a className="btn btn-outline-primary">
									Back
								</a>
							</Link>
							<Button type="submit">
								Next
							</Button>
						</div>
					</Form>
				</Col>
			</Row>
		</Layout>
	)
}

PaymentPage.auth = true;