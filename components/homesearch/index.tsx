import React, { useState } from 'react';
import axios from 'axios'
import {siteName} from '../../utils/constants';
import styles from './HomeSearch.module.css';

const HomeSearch = (props) => {
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
		<div className={styles["home-search-bar"]}>
			<input type="search" aria-label="Search by Address, Transaction ID, or Block" onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' ? search(): null} placeholder="Search by Address / TX ID / Block"/>
		</div>
	);
}

export default HomeSearch;
