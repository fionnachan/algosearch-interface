import React from 'react';
import styles from './Statscard.module.css';

class Statscard extends React.Component {
	render() {
		return (
			<div className={styles.statscard}>
				<h2>{this.props.stat}</h2>
				<span>{this.props.value}</span>
			</div>
		);
	}
}

export default Statscard;
