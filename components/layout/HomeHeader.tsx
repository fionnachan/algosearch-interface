import React from 'react';
import Image from 'next/image';
import { algodurl } from '../../utils/constants';
import styles from './HomeHeader.module.css';

const HomeHeader = () => {
	return (
		<div className={styles["home-search"]}>
			<div className="sizer">
				<div>
					<h1>Algorand Block Explorer</h1>
					<span>Open-source block explorer for Algorand</span>
				</div>
				<div>
				</div>
			</div>
		</div>
	)
}

export default HomeHeader;
