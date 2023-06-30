import { useContext, useState, useEffect } from 'react';
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';
import Cookie from "js-cookie";
import { Navbar, Container, Nav, Dropdown, NavDropdown } from 'react-bootstrap';
import {Store} from "../utils/Store";

function Header() {

	const { status, data: session } = useSession();
	const { state: { cart: { cartItems = [] } }, dispatch } = useContext(Store);
	const [cartItemsCount, setCartItemsCount] = useState(0);

	useEffect(() => {
		setCartItemsCount(cartItems.reduce((a, c) => a + c.quantity, 0));
	}, [cartItems]);

	const handleLogout = () => {
		Cookie.remove('cart');
		dispatch({ type: 'CART_CLEAR' });
		signOut({
			callbackUrl: '/login',
		});
	};

	return (
		<Navbar bg="light" expand="lg">
			<Container>
				<div className="d-flex w-100 justify-content-between">
					<Link href="/">
						<a className="navbar-brand fw-bold d-inline-block">Like Amazon Store</a>
					</Link>
					<Nav>
						<Link href="/cart">
							<a className="nav-link">
								Cart
								{
									cartItemsCount > 0 && (
										<span className="cart-marker">
											{cartItemsCount}
										</span>
									)
								}
							</a>
						</Link>
						{ status === 'loading'
							? (<a className="nav-link">Loading...</a>)
							: session?.user ? (
								<NavDropdown
									align="end"
									title={session.user.name}
								>
									<a className="dropdown-item">Profile</a>
									<a className="dropdown-item">Order history</a>
									<Dropdown.Divider />
									<a className="dropdown-item" onClick={handleLogout}>Logout</a>
								</NavDropdown>
							) : (
								<Link href="/login">
									<a className="nav-link">Sign In</a>
								</Link>
							)
						}
					</Nav>
				</div>
			</Container>
		</Navbar>
	);
}

export default Header;