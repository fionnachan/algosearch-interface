import React from 'react';
import Image from 'next/image';
import styles from './AlgoIcon.module.css';

export default class AlgoIcon extends React.Component {
	render() {
		return (
			<Image src="/algo.svg" width={14} height={14}
				draggable="false" alt="Algorand icon" className={styles.icon+" noselect"}/>
		);
	}
}
