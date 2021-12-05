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
import styles from './Home.module.css';
import { getAlgodClient } from '../utils/algorand';
import algosdk from 'algosdk';
import { removeSpace } from '../utils/stringUtils';
import { BigNumber } from 'bignumber.js';
import Button from '@mui/material/Button';

const Home = (props) => {
	const [blocks, setBlocks] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [genesisId, setGenesisId] = useState(0);
	const [currentRound, setCurrentRound] = useState(0);
	const [price, setPrice] = useState(0);
	const [circulatingSupply, setCirculatingSupply] = useState("");
	const [ledger, setLedger] = useState({});
	const [synced, setSynced] = useState(false);

	const algod = getAlgodClient();

	BigNumber.config({ DECIMAL_PLACES: 2 });
	const currencyFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	const integerFormatter = new Intl.NumberFormat('en-US');

	const getLatest = () => {
		axios({
			method: 'get',
			url: `${siteName}/v1/algod/current-round`
		}).then(response => {
		    if (response.data) {
				console.log("algod current round: ",response.data)
				const genesisId = response.data['genesis-id'];
				setCurrentRound(response.data.round);
				setTransactions(response.data.transactions)
				setLoading(false);
				setGenesisId(genesisId);

				let pageNum = Math.floor(response.data.round/25);

				axios({
					method: 'get',
					url: `${siteName}/v1/rounds?latest_blk=${response.data.round}&page=1&limit=25&order=desc`,
				}).then(resp => {
					console.log("blocks: ", resp.data)
					setBlocks(resp.data.items);
					setLoading(false);
				}).catch(error => {
					console.log("Exception when retrieving last 25 blocks: " + error);
				})
			}
		}).catch(error => {
			console.error("Error when retrieving latest statistics: " + error);
		})
	};

	const getPrice = () => {
		axios({
			method: 'get',
			url: 'https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd'
		}).then(response => {
			setPrice(response.data.algorand.usd);
			setLoading(false);
		}).catch(error => {
			console.error("Error when retrieving Algorand price from CoinGecko: " + error);
		})
	}

	const getCirculatingSupply = () => {
		axios({
			method: 'get',
			url: 'https://metricsapi.algorand.foundation/v1/supply/circulating?unit=algo'
		}).then(response => {
			const _circulatingSupply = currencyFormatter.format(response.data);
			setCirculatingSupply(_circulatingSupply);
			setLoading(false);
		}).catch(error => {
			console.error("Error when retrieving Algorand circulating suppy: " + error);
		})
	}

	useEffect(() => {
		document.title="AlgoSearch (ALGO) Blockchain Explorer";
		algod.supply().do()
			.then(results => {
				const _results = {
					"current_round": integerFormatter.format(results.current_round),
					"online-money": currencyFormatter.format(new BigNumber(results["online-money"]).dividedBy(1e6).toNumber())
				}
				console.log("supply: ",_results)
				setLedger(_results);
			})
			.catch(error => {
				console.error("Error when retrieving ledger supply from Algod: " + error);
			});

		getPrice();
		getCirculatingSupply();
		getLatest();
	}, []);
	
	const block_columns = [
		{Header: 'Round', accessor: 'round', Cell: ({value}) => {
			const _value = value.toString().replace(" ", "");
			return (
				<Link href={`/block/${_value}`}>{_value}</Link>
			)
		}},
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
		{Header: 'Time', accessor: 'round-time', Cell: props => <span className="nocolor">{moment.unix(props.value).fromNow()}</span>}
	];
	const transaction_columns_id = {id: "home-latest-transaction-sizing"};

	return (
		<Layout synced={synced} genesisId={genesisId} homepage>
			<div className={"cardcontainer address-cards "+styles["home-cards"]}>
				<Statscard
					stat="Latest Round"
					value={loading ? <Load /> : ledger['current_round']}
				/>
				<Statscard
					stat="Online Stake"
					value={loading ? <Load /> : (
						<div>
							{ledger['online-money']}
							<AlgoIcon />
						</div>
					)}
				/>
				<Statscard
					stat="Circulating supply"
					value={loading ? <Load /> : (
						<div>
							{circulatingSupply}
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
				<div className={styles["block-table"]+" addresses-table"}>
					<div>
						<span>Latest blocks</span>
						<Button><Link href="/blocks">View more</Link></Button>
					</div>
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
				<div className={styles["block-table"]+" addresses-table"}>
					<div>
						<span>Latest transactions</span>
						<Button><Link href="/transactions">View more</Link></Button>
					</div>
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
		</Layout>
	);
}

export default Home;
