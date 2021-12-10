import React from 'react';
import styles from './HomeHeader.module.scss';

const HomeHeader = () => {
	return (
		<div className={styles["home-header"]}>
			<div className="sizer">
				<div className={styles.content}>
					<h1>Algorand Block Explorer</h1>
					<span>Open-source block explorer for Algorand</span>
				</div>
			</div>
		</div>
	)
}

export default HomeHeader;
