import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import ShippingForm from "../components/ShippingForm";

function ShippingPage() {
	return (
		<Layout title="Shipping Address">
			<CheckoutWizard activeStep={1}/>
			<ShippingForm/>
		</Layout>
	)
}

ShippingPage.auth = true;

export default ShippingPage;