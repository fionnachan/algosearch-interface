import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout';
import {formatValue, siteName} from '../../utils/constants';
import Load from '../../components/tableloading';
import Statscard from '../../components/statscard';
import AlgoIcon from '../../components/algoicon';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import styles from './Address.module.css';
import statcardStyles from '../../components/statscard/Statscard.module.scss';
import { integerFormatter, microAlgosToAlgos, removeSpace } from '../../utils/stringUtils';
import TimeAgo from 'timeago-react';

const Address = (props) => {
	const router = useRouter();
	const { _address } = router.query;
	const [address, setAddress] = useState("");
  const [accountTxNum, setAccountTxNum] = useState(0);
  const [accountTxns, setAccountTxns] = useState([]);
	const [data, setData] = useState({});
	const [txData, setTxData] = useState({});
	const [loading, setLoading] = useState(true);

	const getAddressData = address => {
    axios({
      method: 'get',
      url: `${siteName}/v1/accounts/${address}?page=1&limit=10&order=desc`
    }).then(response => {
      console.log("address data: ", response.data);
      setData(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Exception when querying for address information: " + error);
    });
	};

  const getAccountTx = address => {
    axios({
      method: 'get',
      url: `${siteName}/v1/transactions/acct/${address}?page=1&limit=25`
    }).then(response => {
      console.log("account txns data: ", response.data);
      setAccountTxNum(response.data.num_of_txns);
      setAccountTxns(response.data.items);
      setLoading(false);
    })
    .catch(error => {
      console.error("Exception when querying for address transactions: " + error);
    });
  }

	useEffect(() => {
		if (!_address) {
			return;
		}
		console.log("_address: ",_address)
		setAddress(_address.toString());
		document.title=`AlgoSearch | Address ${address}`;
		getAddressData(_address);
    getAccountTx(_address);
	}, [_address]);

	const columns = [
		{Header: '#', accessor: 'confirmed-round', Cell: props => <span className="rownumber">{props.index + 1}</span>},
		
		{Header: 'Block', accessor: 'confirmed-round', Cell: ({value}) => {
			const _value = removeSpace(value.toString());
			return <Link href={`/block/${_value}`}>{integerFormatter.format(Number(_value))}</Link>
		}},
		{Header: 'Tx id', accessor: 'id', Cell: props => <Link href={`/tx/${props.value}`}>{props.value}</Link>},
		{Header: 'From', accessor: 'sender', Cell: props => address === props.value ? <span className="nocolor">{props.value}</span> : <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: '', accessor: 'sender', Cell: props => address === props.value ? <span className="type noselect">OUT</span> : <span className="type type-width-in noselect">IN</span>},
		{Header: 'To', accessor: 'payment-transaction.receiver', Cell: props => address === props.value ? <span className="nocolor">{props.value}</span> : <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: 'Amount', accessor: 'payment-transaction.amount', Cell: props => <span><AlgoIcon /> {microAlgosToAlgos(props.value)}</span>},
		{Header: 'Time', accessor: 'round-time', Cell: props=> <span className="nocolor"><TimeAgo datetime={new Date(moment.unix(props.value)._d)} locale="en_short"/></span>}
	];

	return (
		<Layout data={{
			"address": address,
			"balance": microAlgosToAlgos(data['amount-without-pending-rewards'])
		}}
		addresspage>
			<div className={`${statcardStyles["cardcontainer"]} ${statcardStyles["address-cards"]}`}>
				<Statscard
					stat="Rewards"
					value={loading ? <Load /> : (
						<div>
              <AlgoIcon /> {microAlgosToAlgos(data.rewards)}
						</div>
					)}
				/>
				<Statscard
					stat="Pending rewards"
					value={loading ? <Load /> : (
						<div>
              <AlgoIcon /> {microAlgosToAlgos(data['pending-rewards'])}
						</div>
					)}
				/>
				<Statscard
					stat="Status"
					value={loading ? <Load /> : (
						<div>
							<div className={`status-light ${data.status === "Offline" ? "status-offline" : "status-online"}`}></div>
							<span>{data.status}</span>
						</div>
					)}
				/>
			</div>
			<div className="block-table addresses-table">
				<span>Latest {loading || !accountTxns ? 0 : accountTxns.length} transactions {loading !== true && accountTxns && accountTxns.length > 24 && <Link href={`/addresstx/${address}`}>View more</Link> }</span>
				<div>
					<ReactTable
						data={accountTxns}
						columns={columns}
						loading={loading}
						defaultPageSize={25}
						showPagination={false}
						sortable={false}
						className="transactions-table addresses-table-sizing"
					/>
				</div>
			</div>
		</Layout>
	);
}

export default Address;
