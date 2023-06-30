import {useEffect, useState} from 'react';
import {Row, Col, Form, Button, Toast} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/router';
import {signIn, useSession} from 'next-auth/react';
import Layout from '../components/Layout';
import Link from 'next/link';
import {getError} from '../utils/error';
import axios from 'axios';

function RegisterPage() {

	const router = useRouter();
	const redirect = router.query.redirect;
	const { data: session } = useSession();
	const { handleSubmit, register, formState: { errors }, getValues } = useForm();
	const [registerError, setRegisterError] = useState(null);

	useEffect(() => {
		if (session?.user) {
			router.push(redirect || '/');
		}
	}, [session, router, redirect]);

	const onSubmit = async ({ name, email, password }) => {
		try {
			await axios.post('/api/auth/signup', { name, email, password });

			const result = await signIn('credentials', {
				redirect: false,
				email,
				password
			});

			if (result.error) {
				setRegisterError(result.error);
			}
		} catch (error) {
			setRegisterError(getError(error));
		}
	};

	return (
		<Layout title="Create account">
			<Row>
				<Col md={3}/>
				<Col md={6}>
					<h1>Sign Up</h1>
					<Form className="pt-3" onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3" controlId="formBasicName">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter name"
								{...register('name', {
									required: 'Name is required',
									pattern: {
										message: 'Name is invalid'
									}
								})}
							/>
							{ errors.name && <p className="text-danger">{errors.name.message}</p> }
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter email"
								{...register('email', {
									required: 'Email is required',
									pattern: {
										value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
										message: 'Email is invalid'
									}
								})}
							/>
							{ errors.email && <p className="text-danger">{errors.email.message}</p> }
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								{...register('password', {
									required: 'Password is required',
									minLength: {
										value: 6,
										message: 'Password must be at least 6 characters'
									}
								})}
							/>
							{ errors.password && <p className="text-danger">{errors.password.message}</p> }
						</Form.Group>
						<Form.Group className="mb-3" controlId="formBasicConfirmPassword">
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Confirm password"
								{...register('confirmPassword', {
									required: 'Please enter confirm password',
									validate: (value) => value === getValues('password') || 'Passwords do not match',
									minLength: {
										value: 6,
										message: 'Password must be at least 6 characters'
									}
								})}
							/>
							{ errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p> }
						</Form.Group>
						<Button variant="primary" type="submit">
							Register
						</Button>
						<br/>
						<br/>
						<p>Already have an account? <Link href="/login">Sign In</Link></p>
					</Form>
				</Col>
			</Row>
			{
				registerError && (
					<Toast
						className="d-inline-block m-1 toast-custom"
						bg="danger"
						key="danger"
						onClose={() => setRegisterError(null)}
					>
						<Toast.Header>
							<strong className="me-auto">Sorry</strong>
						</Toast.Header>
						<Toast.Body className="text-white">
							{registerError}
						</Toast.Body>
					</Toast>
				)
			}
		</Layout>
	)
}

export default RegisterPage;