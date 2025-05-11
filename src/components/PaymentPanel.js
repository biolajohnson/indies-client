import React from "react";
import { ApplePayButton, GooglePayButton } from "./PaymentButtons";

function PaymentPanel() {
	return (
		<div
			style={{
				border: "1px solid #ddd",
				borderRadius: "8px",
				padding: "1rem",
			}}>
			<h2>Donate</h2>
			<ApplePayButton />
			<GooglePayButton />
			<h2>Credit Card</h2>
			<form>
				<div>
					<label>Card Number</label>
					<input
						type="text"
						placeholder="1234 5678 9012 3456"
						style={{ width: "100%" }}
					/>
				</div>
				<div style={{ display: "flex", marginTop: "1rem" }}>
					<input
						type="text"
						placeholder="MM/YY"
						style={{ marginRight: "1rem", width: "50%" }}
					/>
					<input type="text" placeholder="CVC" style={{ width: "50%" }} />
				</div>
				<button type="submit" style={{ marginTop: "1rem", width: "100%" }}>
					Pay Now
				</button>
			</form>
		</div>
	);
}

export default PaymentPanel;
