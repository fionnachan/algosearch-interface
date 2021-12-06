import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

import AlgoIcon from '../../components/algoicon';
import 'react-table-6/react-table.css';
import {siteName} from '../../utils/constants';
import Load from '../../components/tableloading';
import styles from './Transactions.module.css';
import { ellipseAddress, integerFormatter, microAlgosToAlgos, removeSpace } from '../../utils/stringUtils';
import Table from '../../components/table';

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
			setLatestTransaction(response.data);
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
				setMaxTransactions(response.data.num_of_txns);
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
			return <Link href={`/block/${_value}`}>{integerFormatter.format(Number(_value))}</Link>
		}},
		{Header: 'TX ID', accessor: 'id', Cell: props => <Link href={`/tx/${props.value}`}>{ellipseAddress(props.value)}</Link>},
		{Header: 'Type', accessor: 'tx-type', Cell: props => <span className="type noselect">{props.value}</span>},
		{Header: 'From', accessor: 'sender', Cell: props => <Link href={`/address/${props.value}`}>{ellipseAddress(props.value)}</Link>},
		{Header: 'To', accessor: 'payment-transaction.receiver', Cell: props => <Link href={`/address/${props.value}`}>{ellipseAddress(props.value)}</Link>},
		{Header: 'Amount', accessor: 'payment-transaction.amount', Cell: props => <span>{microAlgosToAlgos(props.value)} <AlgoIcon /></span>},
		{Header: 'Fee', accessor: 'fee', Cell: props => <span>{microAlgosToAlgos(props.value)} <AlgoIcon /></span>}
	];

	return (
		<Layout>
			<Breadcrumbs
				name="Transactions"
				parentLink="/"
				parentLinkName="Home"
				currentLinkName="All Transactions"
			/>
			<div className="table">
				<div>
					<p>{maxTransactions} transactions found</p>
					<p>(Showing the last {transactions.length} records)</p>
				</div>
				<div>
					{loading && <Load />}
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
