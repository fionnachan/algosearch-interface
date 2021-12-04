import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Statscard from '../../components/statscard';
import ReactTable from 'react-table-6';
import { useTable } from 'react-table';
import AlgoIcon from '../../components/algoicon';
import 'react-table-6/react-table.css';
import {formatValue, siteName} from '../../utils/constants';
import Load from '../../components/tableloading';
import styles from './Transactions.module.css';
import statscardStyles from '../../components/statscard/Statscard.module.scss';
import { removeSpace } from '../../utils/stringUtils';

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
			return (
			  <tr {...row.getRowProps()}>
				{row.cells.map(cell => 
				  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
				)}
			  </tr>
			)
		  })}
		</tbody>
	  </table>
	)
  }

const Transactions = (props) => {
	const [loading, setLoading] = useState(true);
	const [pageSize, setPageSize] = useState(25);
	const [pages, setPages] = useState(-1);
	const [maxTransactions, setMaxTransactions] = useState(0);
	const [latestTransaction, setLatestTransaction] = useState({});
	const [transactions, setTransactions] = useState([]);

	// Update page size
	const updatePageSize = (pageIndex, pageSize) => {
		setPageSize(pageSize);
		setPages(Math.ceil(maxTransactions / pageSize));
		updateTransactions(pageIndex); // Run update to get new data based on update page size and current index
	};

	const getTransactions = async () => {
		// Let the request headtransaction be max_transactions - (current page * pageSize)
		const latestTxn = await axios({
			method: 'get',
			url: `${siteName}/v1/current-txn`
		}).then(response => {
			console.log("current txn: ",response.data);
			setLatestTransaction(response.data);
			setLoading(false);
			if (response.data) {
				return response.data.id;
			}
		}).catch(error => {
			console.error("Error when retrieving latest statistics: " + error);
		})

		if (latestTxn) {
			axios({
				method: 'get',
				url: `${siteName}/v1/transactions?latest_txn=${latestTxn}&page=10&limit=${pageSize}&order=desc` // Use pageSize from state
			}).then(response => {
				console.log("transactions: ", response.data.items)
				setTransactions(response.data.items);
				setLoading(false);
			}).catch(error => {
				console.error("Exception when updating transactions: " + error);
			})
		}

	};

	// Update transactions based on page number
	const updateTransactions = (pageIndex) => {
		let headTransaction = pageIndex * pageSize;
		axios({
			method: 'get',
			url: `${siteName}/transactions?latest_txn=0&page=0&limit=${pageSize}&order=desc`,
		}).then(response => {
			console.log("txs: ",response.data);
			setTransactions(response.data.transactions);
			setMaxTransactions(response.data.total_transactions);
			setPages(Math.ceil(response.data.total_transactions / 25));
			setLoading(false);
		}).catch(error => {
			console.error("Exception when retrieving last 25 transactions: " + error);
		})
	}

	useEffect(() => {
		document.title="AlgoSearch | Transactions";
		getTransactions();
	}, [])

	// Table columns
	const columns = [
		{Header: 'Round', accessor: 'confirmed-round', Cell: ({value}) => {
			const _value = removeSpace(value.toString());
			return <Link href={`/block/${_value}`}>{_value}</Link>
		}},
		{Header: 'TX ID', accessor: 'id', Cell: props => <Link href={`/tx/${props.value}`}>{props.value}</Link>},
		{Header: 'Type', accessor: 'tx-type', Cell: props => <span className="type noselect">{props.value}</span>},
		{Header: 'From', accessor: 'sender', Cell: props => <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: 'To', accessor: 'payment-transaction.receiver', Cell: props => <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: 'Amount', accessor: 'payment-transaction.amount', Cell: props => <span>{formatValue(props.value)} <AlgoIcon /></span>},
		{Header: 'Fee', accessor: 'fee', Cell: props => <span>{formatValue(props.value)} <AlgoIcon /></span>}
	];

	return (
		<Layout>
			<Breadcrumbs
				name="Transactions"
				parentLink="/"
				parentLinkName="Home"
				currentLinkName="All Transactions"
			/>
			<div className={statscardStyles["cardcontainer"]}>
				<Statscard
					stat="Transaction last seen"
					value={loading
						? <Load />
						: latestTransaction.id}
				/>
				<Statscard
					stat="Transactions sent (24H)"
					value=""
				/>
				<Statscard
					stat="Volume (24H)"
					value=""
				/>
			</div>
			<div className="table">
				<div>
					<p>{loading ? "Loading" : formatValue(maxTransactions)} transactions found</p>
					<p>(Showing the last {transactions.length} records)</p>
				</div>
				<div>
					{/* <ReactTable
						pageIndex={0}
						pages={pages}
						data={transactions.items}
						columns={columns}
						loading={loading}
						defaultPageSize={25}
						pageSizeOptions={[25, 50, 100]}
						onPageChange={pageIndex => updateTransactions(pageIndex)}
						onPageSizeChange={(pageSize, pageIndex) => updatePageSize(pageIndex, pageSize)}
						sortable={false}
						className={styles["transactions-table"]}
						manual
					/> */}
					{transactions.length > 0 && 
						<Table
							columns={columns}
							data={transactions}
							className={styles["transactions-table"]}
						>
						</Table>}
				</div>
			</div>
		</Layout>
	);
}

export default Transactions;
