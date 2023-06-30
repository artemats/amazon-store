import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {Form, Button, Row, Col, Toast} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import {signIn, useSession} from 'next-auth/react';
import Layout from "../components/Layout";
import {getError} from "../utils/error";

function LoginPage() {

	const router = useRouter();
	const redirect = router.query.redirect;
	const { data: session } = useSession();
	const { handleSubmit, register, formState: { errors } } = useForm();
	const [loginError, setLoginError] = useState(null);

	useEffect(() => {
		if (session?.user) {
			router.push(redirect || '/');
		}
	}, [session, router, redirect]);

	const onSubmit = async ({ email, password }) => {
		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password
			});
			if (result.error) {
				setLoginError(result.error);
			}
		} catch (error) {
			setLoginError(getError(error));
		}
	};

	return (
		<Layout title="Login">
			<Row>
				<Col md={3}/>
				<Col md={6}>
					<h1>Sign In</h1>
					<Form className="pt-3" onSubmit={handleSubmit(onSubmit)}>
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
						<Button variant="primary" type="submit">
							Login
						</Button>
						<br/>
						<br/>
						<p>Don't have an account? <Link href={`/register?redirect=${redirect || '/'}`}>Sign Up</Link></p>
					</Form>
				</Col>
			</Row>
			{
				loginError && (
					<Toast
						className="d-inline-block m-1 toast-custom"
						bg="danger"
						key="danger"
						onClose={() => setLoginError(null)}
					>
						<Toast.Header>
							<strong className="me-auto">Sorry</strong>
						</Toast.Header>
						<Toast.Body className="text-white">
							{loginError}
						</Toast.Body>
					</Toast>
				)
			}
		</Layout>
	)
}

export default LoginPage;