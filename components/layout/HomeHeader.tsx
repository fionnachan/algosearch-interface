import React from 'react';
import Image from 'next/image';
import { algodurl } from '../../utils/constants';
import styles from './HomeHeader.module.css';

const HomeHeader = (props) => {
	return (
		<div className={styles["home-search"]}>
			<div className="sizer">
				<div>
					<h1><Image src="/algo.svg" width={14} height={14} alt="Algorand logo"/>Block Explorer</h1>
					<span>Open-source block explorer for the Algorand mainnet. Showing <a href={algodurl}>{props.genesisId}</a>
					</span>
				</div>
				<div>
				</div>
			</div>
		</div>
	)
}

export default HomeHeader;
