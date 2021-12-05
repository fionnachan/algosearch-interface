import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import {siteName} from '../../utils/constants';
import styles from './HeaderSearch.module.css';
import AlgoIcon from '../algoicon';

const HeaderSearch = (props) => {
	const [query, setQuery] = useState("");
	const search = () => {
		const search = query ? query : "";
		axios({
			method: 'get',
			url: `${siteName}/detect/${search}`
		}).then(response => {
			switch (response.data) {
				case 'block':
					props.history.push(`/block/${search}`);
					break;
				case 'transaction':
					props.history.push(`/tx/${search}`);
					break;
				case 'address':
					props.history.push(`/address/${search}`);
					break;
				default:
					props.history.push("/404");
					break;
			}
		}).catch(() => {
			props.history.push("/404");
		})
	}
	return (
		<div className={styles.search}>
			<div className={styles.searchbar}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" stroke="#fff">
					<path d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"/>
				</svg>
				<input type="search" aria-label="Search by Address, Transaction ID, or Block" onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' ? search(): null} placeholder="Search by Address / Tx ID / Block"/>
			</div>
			<div className={styles.poweredlogo + " noselect"}>
				<p>Powered by{" "}
					<a href="https://www.algorand.com/" target="_blank" rel="noopener noreferrer">
						<AlgoIcon isLightColor />
					</a>
				</p>
			</div>
		</div>
	);
}

export default HeaderSearch;
