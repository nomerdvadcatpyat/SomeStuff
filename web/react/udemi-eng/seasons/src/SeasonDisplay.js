import React from "react";
import './SeasonDisplay.css'

export default class SeasonDisplay extends React.Component {
	season = getSeason(this.props.lat, new Date().getMonth())

	render() {
		return (
			<div className={`season-display ${this.season}`}>
				<i className={`icon-left ${this.season.iconName} icon massive`}/>
				<h1 className="latitude" > Latitude: {this.season.text} </h1>
				<i className={`icon-right ${this.season.iconName} icon massive`}/>
			</div>
		);
	}
}

const seasonConfig = {
	summer: {
		text: 'Lets hit the beach!',
		iconName: 'sun',
		toString: () => 'summer'
	},
	winter: {
		text: 'Burr it is cold!',
		iconName: 'snowflake',
		toString: () => 'winter'
	}
};

const getSeason = (lat, month) => {
	if (month > 2 && month < 9) {
		return lat > 0 ? seasonConfig.summer : seasonConfig.winter;
	} else {
		return lat > 0 ? seasonConfig.winter : seasonConfig.summer;
	}
}

