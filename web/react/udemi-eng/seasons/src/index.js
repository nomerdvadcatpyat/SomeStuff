import React from 'react';
import ReactDOM from 'react-dom';
import SeasonDisplay from "./SeasonDisplay";
import ErrorComponent from "./ErrorComponent";
import Spinner from "./Spinner";

class App extends React.Component {
	state = {lat: null, errorMessage: ''};

	renderContent() {
		if (this.state.lat)
			return <SeasonDisplay lat={this.state.lat}/>

		else if (this.state.errorMessage)
			return <ErrorComponent message={this.state.errorMessage}/>

		return <Spinner message="Please accept location request"/>
	}

	render() {
		return (
			<div className="border red">
				{this.renderContent()}
			</div>
		);
	}

	componentDidMount() {
		window.navigator.geolocation.getCurrentPosition(
			(position) => this.setState({lat: position.coords.latitude}),
			(err) => this.setState({errorMessage: err.message})
		);
	}
}

ReactDOM.render(<App/>, document.querySelector('#root'));