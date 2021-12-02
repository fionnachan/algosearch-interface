import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';
import ReactTable from 'react-table-6';
import { useTable } from 'react-table';
import 'react-table-6/react-table.css';
import AlgoIcon from '../../components/algoicon';
import Load from '../../components/tableloading';
import {siteName, formatValue} from '../../utils/constants';
import styles from './Blocks.module.css';
import statscardStyles from '../../components/statscard/Statscard.module.css';
import algosdk from 'algosdk';

const Table = ({ columns, data }) => {
	// Use the state and functions returned from useTable to build your UI
	const {
	  getTableProps,
	  getTableBodyProps,
	  headerGroups,
	  rows,
	  prepareRow,
	} = useTable({
	  columns,
	  data,
	})
  
	// Render the UI for your table
	return (
	  <table {...getTableProps()}>
		<thead>
		  {headerGroups.map(headerGroup => (
			<tr {...headerGroup.getHeaderGroupProps()}>
			  {headerGroup.headers.map(column => (
				<th {...column.getHeaderProps()}>{column.render('Header')}</th>
			  ))}
			</tr>
		  ))}
		</thead>
		<tbody {...getTableBodyProps()}>
		  {rows.map((row, i) => {
			prepareRow(row)
			console.log("Cells: ",row.cells)
			return (
			  <tr {...row.getRowProps()}>
				{row.cells.map(cell => {
				  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
				})}
			  </tr>
			)
		  })}
		</tbody>
	  </table>
	)
  }

const Blocks = (props) => {

	const [blocks, setBlocks] = useState([]);
	const [pageSize, setPageSize] = useState(25);
	const [pages, setPages] = useState(-1);
	const [loading, setLoading] = useState(true);
	const [currentRound, setCurrentRound] = useState(0);
	const [rewardRate, setRewardRate] = useState(0);
	const [avgBlockTime, setAvgBlockTime] = useState(0);

	// Update page size
	const updatePageSize = (pageIndex, pageSize) => {
		setPageSize(pageSize);
		setPages(Math.ceil(currentRound / pageSize))
		updateBlocks(pageIndex);
	};

	// Update blocks based on page number
	const updateBlocks = pageIndex => {
		// Let the request headerblock be currentRound - (current page * pageSize)
		let headBlock = pageIndex * pageSize;

		// axios({
		// 	method: 'get',
		// 	url: `${siteName}/all/blocks/${headBlock + pageSize}/${pageSize}/0` // Use pageSize from state
		// }).then(response => {
		// 	setBlocks(response.data); // Set blocks to new data to render
		// }).catch(error => {
		// 	console.log("Exception when updating blocks: " + error);
		// })
	};

	// Get initial blocks on load
	const getBlocks = () => {
		// Call stats to get current round number
		axios({
			method: 'get',
			url: `${siteName}/v1/current-round`,
		}).then(resp => {
			// Use current round number to retrieve last 25 blocks
			console.log("current round: ", resp)
			setCurrentRound(resp.data.round);
			setRewardRate(algosdk.microalgosToAlgos(resp.data.rewards["rewards-rate"]));
			setLoading(false);
			axios({
				method: 'get',
				url: `${siteName}/v1/rounds?latest_blk=${resp.data.round}&limit=25&page=1&order=desc`,
			}).then(response => {
				console.log("rounds: ", response.data)
				setBlocks(response.data.items);
				setPages(Math.ceil(resp.data.round / 25));
				setLoading(false);
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
	// const columns = [
	// 	{Header: 'Round', accessor: 'round', Cell: props => <Link href={`/block/${props.value}`}>{props.value}</Link>},
	// 	{Header: 'Transactions', accessor: 'transactions'},
	// ];

	const columns = React.useMemo(
		() => [
			{
				Header: 'Round',
				accessor: 'round',
				Cell: ({value}) => {
					const _value = value.toString().replace(" ", "");
					return (
						<Link href={`/block/${_value}`}>{_value}</Link>
					)
				}
			},
			{
				Header: 'Transactions',
				accessor: 'transactions',
			},
			{
				Header: 'Proposed by',
				accessor: 'proposer',
				Cell: ({value}) => <Link href={`/address/${value}`}>{value}</Link>
			},
			{
				Header: 'Time',
				accessor: 'timestamp',
				Cell: ({value}) => <span>{moment.unix(value).format("D MMM YYYY, h:mm:ss")}</span>
			},
		],
		[]
	  )
	

	return (
		<Layout>
			<Breadcrumbs
				name="Blocks"
				parentLink="/"
				parentLinkName="Home"
				currentLinkName="Blocks"
			/>
			<div className={statscardStyles["cardcontainer"]}>
				<Statscard
					stat="Latest round"
					value={loading ? <Load /> : formatValue(currentRound)}
				/>
				<Statscard
					stat="Average Block Time"
					value={loading ? <Load /> : (<span>{avgBlockTime}s</span>)}
				/>
				<Statscard
					stat="Reward Rate"
					value={loading ? <Load /> : (
						<div>
							{rewardRate}
							<AlgoIcon />
						</div>
					)}
				/>
			</div>
			<div className="table">
				<div>
					<p>{loading ? "Loading": formatValue(currentRound)} blocks found</p>
					<p>(Showing the last {pageSize} records)</p>
				</div>
				<div>
					{/* {blocks.length > 0 && <Table
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
					/>} */}
					{blocks.length > 0 && 
						<Table
							columns={columns}
							data={blocks}
							className={styles["blocks-table"]}
						>
						</Table>}
				</div>
			</div>
		</Layout>
	);
}

export default Blocks;
