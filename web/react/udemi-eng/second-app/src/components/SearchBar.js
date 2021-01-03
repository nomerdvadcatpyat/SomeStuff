import React from 'react';

export default class SearchBar extends React.Component {

	state = {
		input : ''
	}

	onInputChange = e => {
		this.setState(state => {
			return {input: e.target.value}
		});
	}

	onFormSubmit = e => {
		e.preventDefault();

		this.props.onFormSubmit(this.state.input);
	}

	render() {
		return (
			<div className="ui segment">
				<form onSubmit={this.onFormSubmit} className="ui form">
					<div className="field">
						<label> Image Search </label>
						<input
							type="text"
							value={this.state.input}
							onChange={this.onInputChange}/>
					</div>
				</form>
			</div>
		);
	};
}