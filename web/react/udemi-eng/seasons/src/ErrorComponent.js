import React from "react";

const ErrorComponent = (props) => {
	return (
		<h1>
			Error: {props.message}
		</h1>
	);
}
export default ErrorComponent;