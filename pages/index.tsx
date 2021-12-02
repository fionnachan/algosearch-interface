import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import Layout from '../components/layout';
import {formatValue, siteName} from '../utils/constants';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AlgoIcon from '../components/algoicon';
import Statscard from '../components/statscard';
import Load from '../components/tableloading';
import HomeSearch from '../components/homesearch';
import styles from './Home.module.css';
import { getAlgodClient, getAlgodv1Client } from '../utils/algorand';
import algosdk from 'algosdk';

const Home = (props) => {
	const [blocks, setBlocks] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [genesisId, setGenesisId] = useState(0);
	const [currentRound, setCurrentRound] = useState(0);
	const [price, setPrice] = useState(0);
	const [ledger, setLedger] = useState({});
	const [synced, setSynced] = useState(false);

	const algodv1 = getAlgodv1Client();
	const algod = getAlgodClient();

	const getLatest = () => {
		axios({
			method: 'get',
			url: `${siteName}/v1/algod/current-round`
		}).then(response => {
		    if (response.data) {
				const genesisId = response.data['genesis-id'];
				setBlocks(response.data.blocks)
				setCurrentRound(response.data.round);
				setTransactions(response.data.transactions)
				setLoading(false);
				setGenesisId(genesisId);
			}
		}).catch(error => {
			console.log("Error when retrieving latest statistics: " + error);
		})
		// setTimeout(this.getLatest, 1000);
	};

	const getPrice = () => {
		axios({
			method: 'get',
			url: 'https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd'
		}).then(response => {
			setPrice(response.data.algorand.usd);
			setLoading(false);
		}).catch(error => {
			console.log("Error when retrieving Algorand price from CoinGecko: " + error);
		})
	}

	useEffect(() => {
		document.title="AlgoSearch (ALGO) Blockchain Explorer";

		algodv1.ledgerSupply()
			.then(results => {
				setLedger(results);
			})
			.catch(error => {
				console.log("Error when retrieving ledger supply from Algod: " + error);
			});

		getPrice();
		getLatest();
	}, []);
	
	const block_columns = [
		{Header: 'Round', accessor: 'round', Cell: props => <Link href={`/block/${props.value}`}>{props.value}</Link>},
		{Header: 'Proposer', accessor: 'proposer',  Cell: props => <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: '# TX', accessor: 'numtxn', Cell: props => <span className="nocolor">{props.value}</span>},
		{Header: 'Time', accessor: 'timestamp', Cell: props => <span className="nocolor">{moment.unix(props.value).fromNow()}</span>}
	];
	const block_columns_id = {id: "home-latest-block-sizing"};

	const transaction_columns = [
		{Header: 'TX ID', accessor: 'id', Cell: props => <Link href={`/transaction/${props.value}`}>{props.value}</Link>},
		{Header: 'From', accessor: 'sender',  Cell: props => <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: 'To', accessor: 'payment-transaction.receiver',  Cell: props => <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: 'Amount', accessor: 'payment-transaction.amount', Cell: props => <span>{<span className="nocolor">{formatValue(props.value / 1000000)}</span>} <AlgoIcon /></span>},
		{Header: 'Time', accessor: 'timestamp', Cell: props => <span className="nocolor">{moment.unix(props.value).fromNow()}</span>}
	];
	const transaction_columns_id = {id: "home-latest-transaction-sizing"};

	return (
		<Layout synced={synced} genesisId={genesisId} homepage>
			<HomeSearch />
			<div className={"cardcontainer address-cards "+styles["home-cards"]}>
				<Statscard
					stat="Latest Round"
					value={loading ? <Load /> : formatValue(currentRound)}
				/>
				<Statscard
					stat="Online Stake"
					value={loading ? <Load /> : (
						<div>
							{formatValue(ledger['onlineMoney'] / 1000000)}
							<AlgoIcon />
						</div>
					)}
				/>
				<Statscard
					stat="Circulating supply"
					value={loading ? <Load /> : (
						<div>
							{formatValue(ledger['totalMoney'] / 1000000)}
							<AlgoIcon />
						</div>
					)}
				/>
				<Statscard
					stat="Algo Price"
					value={loading ? <Load /> : '$' + formatValue(price)}
				/>
			</div>
			<div className={styles["home-split"]}>
				<div>
					<div className="block-table addresses-table">
						<span>Latest blocks <Link href="/blocks">View more</Link></span>
						<div>
							<ReactTable
								data={blocks}
								columns={block_columns}
								loading={loading}
								defaultPageSize={10}
								showPagination={false}
								sortable={false}
								className="transactions-table"
								getProps={() => block_columns_id}
							/>
						</div>
					</div>
				</div>
				<div>
					<div className="block-table addresses-table">
						<span>Latest transactions <Link href="/transactions">View more</Link></span>
						<div>
							<ReactTable
								data={transactions}
								columns={transaction_columns}
								loading={loading}
								defaultPageSize={10}
								showPagination={false}
								sortable={false}
								className="transactions-table"
								getProps={() => transaction_columns_id}
							/>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default Home;
