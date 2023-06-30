import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Cookie from 'js-cookie';
import {Store} from "../utils/Store";

function ShippingForm() {

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm();
	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const { shippingAddress } = cart;
	const router = useRouter();

	useEffect(() => {
		setValue('fullName', shippingAddress.fullName);
		setValue('address', shippingAddress.address);
		setValue('city', shippingAddress.city);
		setValue('country', shippingAddress.country);
	}, [setValue, shippingAddress]);

	const submitHandler = (data) => {
		dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: data });
		Cookie.set('cart', JSON.stringify({
			...cart,
			shippingAddress: data
		}));
		router.push('/payment');
	}

	return (
		<Row>
			<Col md={3}/>
			<Col md={6}>
				<Form onSubmit={handleSubmit(submitHandler)} className="pt-3">
					<Form.Group className="mb-3">
						<Form.Label>Full Name</Form.Label>
						<Form.Control
							placeholder="Enter full name"
							{...register('fullName', {
								required: 'Full name is required',
							})}
						/>
						{ errors.fullName && <p className="text-danger">{errors.fullName.message}</p> }
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Address</Form.Label>
						<Form.Control
							placeholder="Enter address"
							{...register('address', {
								required: 'Address is required',
							})}
						/>
						{ errors.address && <p className="text-danger">{errors.address.message}</p> }
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>City</Form.Label>
						<Form.Control
							placeholder="Enter city"
							{...register('city', {
								required: 'City is required',
							})}
						/>
						{ errors.city && <p className="text-danger">{errors.city.message}</p> }
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Country</Form.Label>
						<Form.Control
							placeholder="Enter country"
							{...register('country', {
								required: 'Country is required',
							})}
						/>
						{ errors.country && <p className="text-danger">{errors.country.message}</p> }
					</Form.Group>
					<Button type="submit" className="mt-3">
						Next
					</Button>
				</Form>
			</Col>
		</Row>
	)
}

export default ShippingForm;