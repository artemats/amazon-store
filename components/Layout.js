import {Container} from "react-bootstrap";
import Head from 'next/head';
import Header from "./Header";

export default function Layout({ title, children }) {
	return (
		<>
			<Head>
				<title>{ title ? title + ' | Like Amazon Store' : 'Like Amazon Store' }</title>
			</Head>
			<Header />
			<main>
				<Container className="pt-4 pb-4">
					{children}
				</Container>
			</main>
		</>
	);
}