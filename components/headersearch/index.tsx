import React, { useState } from 'react';
import axios from 'axios';
import {siteName} from '../../utils/constants';
import styles from './HeaderSearch.module.scss';
import { IconButton, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledIconButton = styled(IconButton)(({theme}) => ({
  fontSize: 'var(--font-size-s)',
  color: 'white',
  background: 'var(--blue-light)',
  borderRadius: 0,
  '&:hover': {
    background: 'var(--blue)',
  }
}));

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
			<input type="search" aria-label="Search by Address, Transaction ID, or Block" onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' ? search(): null} placeholder="Search by Address / Tx ID / Block"/>
      <StyledIconButton aria-label="search" size="small">
        <SearchIcon fontSize="small"/>
      </StyledIconButton>
    </div>
	);
}

export default HeaderSearch;
