import React from 'react';
import styles from './Statscard.module.css';

const Statscard = (props) => {
	return (
		<div className={styles.statscard}>
			<h2>{props.stat}</h2>
			{props.value}
		</div>
	);
}

export default Statscard;
