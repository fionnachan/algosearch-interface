import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AlgoIcon from '../../components/algoicon';
import Load from '../../components/tableloading';
import {siteName, formatValue} from '../../utils/constants';
import styles from './Blocks.module.css';

const Blocks = (props) => {

	const [blocks, setBlocks] = useState([]);
	const [pageSize, setPageSize] = useState(25);
	const [pages, setPages] = useState(-1);
	const [loading, setLoading] = useState(true);

	// Update page size
	const updatePageSize = (pageIndex, pageSize) => {
		setPageSize(pageSize);
		setPages(Math.ceil(current_round / pageSize))
		updateBlocks(pageIndex);
	};

	// Update blocks based on page number
	const updateBlocks = pageIndex => {
		// Let the request headerblock be current_round - (current page * pageSize)
		let headBlock = pageIndex * pageSize;

		axios({
			method: 'get',
			url: `${siteName}/all/blocks/${headBlock + pageSize}/${pageSize}/0` // Use pageSize from state
		}).then(response => {
			setBlocks(response.data); // Set blocks to new data to render
		}).catch(error => {
			console.log("Exception when updating blocks: " + error);
		})
	};

	// Get initial blocks on load
	const getBlocks = () => {
		// Call stats to get current round number
		axios({
			method: 'get',
			url: `${siteName}/stats`
		}).then(resp => {
			// Use current round number to retrieve last 25 blocks
			axios({
				method: 'get',
				url: `${siteName}/all/blocks/25/25/0`,
			}).then(response => {
				setBlocks(response.data);
				setLoading(false);
				this.setState({
					current_round: response.data[0].round, // Set current_round to highest round
					pages: Math.ceil(response.data[0].round / 25), // Set pages to rounded up division
					reward_rate: resp.data.reward_rate,
					avg_block_time: resp.data.avg_block_time
				});
			}).catch(error => {
				console.log("Exception when retrieving last 25 blocks: " + error);
			})
		}).catch(error => {
			console.log("Exception when retrieving current round number: " + error);
		})
	};

	useEffect(() => {
		getBlocks();
		document.title="AlgoSearch | Blocks";
	}, []);

	// Table columns
	const columns = [
		{Header: 'Round', accessor: 'round', Cell: props => <Link href={`/block/${props.value}`}>{props.value}</Link>},
		{Header: 'Transactions', accessor: 'transactions'},
		{Header: 'Proposed by', accessor: 'proposer', Cell: props => <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: 'Time', accessor: 'timestamp', Cell: props => <span>{moment.unix(props.value).fromNow()}</span>}
	];

	return (
		<Layout>
			<Breadcrumbs
				name="Blocks"
				parentLink="/"
				parentLinkName="Home"
				currentLinkName="Blocks"
			/>
			<div className="cardcontainer">
				<Statscard
					stat="Latest round"
					value={loading ? <Load /> : formatValue(current_round)}
				/>
				<Statscard
					stat="Average Block Time"
					value={loading ? <Load /> : (<span>{avg_block_time}s</span>)}
				/>
				<Statscard
					stat="Reward Rate"
					value={loading ? <Load /> : (
						<div>
							{reward_rate}
							<AlgoIcon />
						</div>
					)}
				/>
			</div>
			<div className="table">
				<div>
					<p>{loading ? "Loading": formatValue(current_round)} blocks found</p>
					<p>(Showing the last {pageSize} records)</p>
				</div>
				<div>
					<ReactTable
						pageIndex={0}
						pages={pages}
						data={blocks}
						columns={columns}
						loading={loading}
						pageSize={pageSize}
						defaultPageSize={25}
						pageSizeOptions={[25, 50, 100]}
						onPageChange={pageIndex => updateBlocks(pageIndex)}
						onPageSizeChange={(pageSize, pageIndex) => updatePageSize(pageIndex, pageSize)}
						sortable={false}
						className="blocks-table"
						manual
					/>
				</div>
			</div>
		</Layout>
	);
}

export default Blocks;
