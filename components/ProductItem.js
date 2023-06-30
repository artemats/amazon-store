import { useContext, useState } from 'react';
import Link from "next/link";
import {Card, Button, Col, Toast} from 'react-bootstrap';
import axios from "axios";
import {Store} from "../utils/Store";

function ProductItem({ product }) {

	const { state, dispatch } = useContext(Store);
	const [added, setAdded] = useState(false);
	const [isOutOfStock, setIsOutOfStock] = useState(false);

	const handleAddToCart = async () => {
		const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);

		if (data.countInStock < quantity) {
			return setIsOutOfStock(true);
		}
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
		setAdded(true);
		setTimeout(() => setAdded(false), 2000);
	};

	return (
		<Col md={4}>
			<Card className="product">
				<Link href={`/product/${product.slug}`}>
					<a className="product-thumb">
						<Card.Img variant="top" src={product.image} alt={product.name}/>
					</a>
				</Link>
				<Card.Body>
					<Link href={`/product/${product.slug}`}>
						<a>
							<Card.Title className="product-title">{product.name}</Card.Title>
						</a>
					</Link>
					<Card.Text className="product-price">${product.price}</Card.Text>
					<Card.Text className="product-brand">{product.brand}</Card.Text>
					<Card.Text className="product-description">{product.description}</Card.Text>
					<div className="product-action">
						<Button
							variant="warning"
							onClick={handleAddToCart}
						>
							Add to cart
						</Button>
					</div>
				</Card.Body>
			</Card>
			{
				added && (
					<Toast
						className="d-inline-block m-1 toast-custom"
						bg="success"
						key="success"
						onClose={() => setAdded(false)}
					>
						<Toast.Header>
							<strong className="me-auto">Success</strong>
						</Toast.Header>
						<Toast.Body className="text-white">
							Product are added to basket.
							<br/>
							<Link href="/cart">
								<a className="btn btn-outline-light mt-2 btn-sm">Check basket</a>
							</Link>
						</Toast.Body>
					</Toast>
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
		</Col>
	)
}

export default ProductItem;