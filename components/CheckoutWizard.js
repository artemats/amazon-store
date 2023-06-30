function CheckoutWizard({ activeStep = 0 }) {

	const steps = [
		'User Login',
		'Shipping Address',
		'Payment Method',
		'Place Order',
	]

	return (
		<div className="wizard">
			{
				steps.map((step, index) => (
					<div key={index} className={`wizard-item ${index <= activeStep ? 'is-active' : ''}`}>{step}</div>
				))
			}
		</div>
	)
}

export default CheckoutWizard;