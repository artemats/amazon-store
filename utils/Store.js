import { createContext, useReducer } from 'react';
import Cookie from 'js-cookie';

export const Store = createContext();

const initialState = {
	cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')) : {
		cartItems: [],
		shippingAddress: {},
		paymentMethod: '',
	},
};

function reducer(state, action) {
	switch (action.type) {
		case 'CART_ADD_ITEM': {
			const newItem = action.payload;
			const existItem = state.cart.cartItems.find(x => x.slug === newItem.slug);
			const cartItems = existItem
				? state.cart.cartItems.map(x => x.slug === existItem.slug ? newItem : x)
				: [...state.cart.cartItems, newItem];
			Cookie.set('cart', JSON.stringify({ ...state.cart, cartItems }));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case 'CART_REMOVE_ITEM': {
			const cartItems = state.cart.cartItems.filter(x => x.slug !== action.payload.slug);
			Cookie.set('cart', JSON.stringify({ ...state.cart, cartItems }));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case 'CART_CLEAR': {
			return {
				...state,
				cart: { ...state.cart, cartItems: [] },
			}
		}
		case 'SAVE_SHIPPING_ADDRESS': {
			return {
				...state,
				cart: {
					...state.cart,
					shippingAddress: {
						...state.cart.shippingAddress,
						...action.payload
					}
				},
			}
		}
		case 'SAVE_PAYMENT_METHOD': {
			return {
				...state,
				cart: {
					...state.cart,
					paymentMethod: action.payload,
				}
			}
		}
		default:
			return state;
	}
}

export function StoreProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = { state, dispatch };
	return <Store.Provider value={value}>{children}</Store.Provider>
}