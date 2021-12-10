import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import Layout from '../components/layout';
import {formatValue, siteName} from '../utils/constants';
import AlgoIcon from '../components/algoicon';
import Statscard from '../components/statscard';
import Load from '../components/tableloading';
import styles from './Home.module.css';
import { getAlgodClient } from '../utils/algorand';
import { currencyFormatter, ellipseAddress, integerFormatter, microAlgosToAlgos, removeSpace, timeAgoLocale } from '../utils/stringUtils';
import { BigNumber } from 'bignumber.js';
import Button from '@mui/material/Button';
import Table from '../components/table';
import TransactionTable from '../components/table/TransactionTable';

const Home = (props) => {
	const [blocks, setBlocks] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [genesisId, setGenesisId] = useState(0);
	const [currentRound, setCurrentRound] = useState(0);
	const [price, setPrice] = useState(0);
	const [circulatingSupply, setCirculatingSupply] = useState("");
	const [ledger, setLedger] = useState({});

	const algod = getAlgodClient();

	timeago.register('en_short', timeAgoLocale);

	BigNumber.config({ DECIMAL_PLACES: 2 });
	const getLatest = () => {
		return axios({
			method: 'get',
			url: `${siteName}/v1/algod/current-round`
		}).then(response => {
		    if (response.data) {
				console.log("algod current round: ",response.data)
				const genesisId = response.data['genesis-id'];
				setCurrentRound(response.data.round);
				setTransactions(response.data.transactions.slice(0, 10))
				setGenesisId(genesisId);

				return axios({
					method: 'get',
					url: `${siteName}/v1/rounds?latest_blk=${response.data.round}&page=1&limit=10&order=desc`,
				}).then(resp => {
					console.log("blocks: ", resp.data)
					return resp.data;
				}).catch(error => {
					console.log("Exception when retrieving last 10 blocks: " + error);
				})
			}
		}).catch(error => {
			console.error("Error when retrieving latest statistics: " + error);
		})
	};

	const getPrice = () => {
		return axios({
			method: 'get',
			url: 'https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd'
		}).then(response => {
			return response.data.algorand.usd;
		}).catch(error => {
			console.error("Error when retrieving Algorand price from CoinGecko: " + error);
		})
	}

	const getCirculatingSupply = () => {
		return axios({
			method: 'get',
			url: 'https://metricsapi.algorand.foundation/v1/supply/circulating?unit=algo'
		}).then(response => {
			const _circulatingSupply = currencyFormatter.format(response.data);
			return _circulatingSupply;
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
					"online-money": currencyFormatter.format(microAlgosToAlgos(results["online-money"]))
				}
				setLedger(_results);
			})
			.catch(error => {
				console.error("Error when retrieving ledger supply from Algod: " + error);
			});

		Promise.all([getPrice(), getCirculatingSupply(), getLatest()])
			.then((results) => {
				console.log("Promise.all results: ",results)
				setPrice(results[0]);
				setCirculatingSupply(results[1] || "");
				setBlocks(results[2]?.items || []);
				setLoading(false);
			})
	}, []);
	
	const block_columns = [
		{Header: 'Block', accessor: 'round', Cell: ({value}) => {
			const _value = value.toString().replace(" ", "");
			return (
				<Link href={`/block/${_value}`}>{integerFormatter.format(_value)}</Link>
			)
		}},
		{Header: 'Proposer', accessor: 'proposer',  Cell: props => <Link href={`/address/${props.value}`}>{ellipseAddress(props.value)}</Link>},
		{Header: '# TX', accessor: 'numtxn', Cell: props => <span className="nocolor">{props.value}</span>},
		{Header: 'Time', accessor: 'timestamp', Cell: props => <TimeAgo datetime={new Date(moment.unix(props.value)._d)} locale="en_short"></TimeAgo>}
	];
	const block_columns_id = {id: "home-latest-block-sizing"};

	const transaction_columns = [
		{Header: 'TX ID', accessor: 'id', Cell: props => <Link href={`/transaction/${props.value}`}>{ellipseAddress(props.value)}</Link>},
		{Header: 'From', accessor: 'sender',  Cell: props => <Link href={`/address/${props.value}`}>{ellipseAddress(props.value)}</Link>},
		{Header: 'To', accessor: 'payment-transaction.receiver',  Cell: props => props.value && <Link href={`/address/${props.value}`}>{ellipseAddress(props.value)}</Link>},
		{Header: 'Amount', accessor: 'payment-transaction.amount', Cell: props => <span>{<span className="nocolor">{formatValue(props.value / 1000000)}</span>} <AlgoIcon /></span>},
		{Header: 'Time', accessor: 'round-time', Cell: props => <span className="nocolor">{<TimeAgo datetime={new Date(moment.unix(props.value)._d)} locale="en_short"></TimeAgo>}</span>}
	];
	const transaction_columns_id = {id: "home-latest-transaction-sizing"};

	return (
		<Layout genesisId={genesisId} homepage>
			<div className={"cardcontainer address-cards "+styles["home-cards"]}>
				<Statscard
					stat="Latest Round"
					value={loading ? <Load /> : ledger['current_round']}
				/>
				<Statscard
					stat="Online Stake"
					value={loading ? <Load /> : (
						<div>
							<AlgoIcon /> {ledger['online-money']}
						</div>
					)}
				/>
				<Statscard
					stat="Circulating supply"
					value={loading ? <Load /> : (
						<div>
							<AlgoIcon /> {circulatingSupply}
						</div>
					)}
				/>
				<Statscard
					stat="Algo Price"
					value={loading ? <Load /> : `$${price}`}
				/>
			</div>
			<div className={styles["home-split"]}>
				<div className={styles["block-table"]+" addresses-table"}>
					<div>
						<span>Latest blocks</span>
						<Button><Link href="/blocks">View more</Link></Button>
					</div>
					<Table
						data={blocks}
						columns={block_columns}
						loading={loading}
						className="transactions-table"
						getProps={() => block_columns_id}
					/>
				</div>
				<div className={styles["block-table"]}>
					<div>
						<span>Latest transactions</span>
						<Button><Link href="/transactions">View more</Link></Button>
					</div>
          <TransactionTable
            transactions={transactions}
          />
				</div>
			</div>
		</Layout>
	);
}

export default Home;
