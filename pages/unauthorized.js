import {useRouter} from "next/router";
import Layout from "../components/Layout";

function UnauthorizedPage() {

	const router = useRouter();
	const { message } = router.query;

	return (
		<Layout title="Unauthorized">
			<h1>Access denied</h1>
			{ message && <p className="text-danger">{message}</p> }
		</Layout>
	)
}

export default UnauthorizedPage;