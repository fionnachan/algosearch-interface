import React from 'react';
import styles from './Statscard.module.css';

const Statscard = (props) => {
	return (
		<div className={styles.statscard}>
			<h2>{props.stat}</h2>
			<span>{props.value}</span>
		</div>
	);
}

export default Statscard;
