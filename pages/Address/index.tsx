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

const Address = (props) => {
	const router = useRouter();
	const { _address } = router.query;
	const [address, setAddress] = useState("");
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	const getAddressData = address => {
		axios({
			method: 'get',
			url: `${siteName}/addressservice/${address}`
		}).then(response => {
			setData(response.data);
			setLoading(false);
		}).catch(error => {
			console.log("Exception when querying for address information: " + error);
		});
	};

	useEffect(() => {
		setAddress(_address.toString());
		document.title=`AlgoSearch | Address ${address}`;
		getAddressData(address);
	}, []);

	const columns = [
		{Header: '#', accessor: 'confirmed-round', Cell: props => <span className="rownumber">{props.index + 1}</span>},
		{Header: 'Round', accessor: 'confirmed-round', Cell: props => <Link href={`/block/${props.value}`}>{props.value}</Link>},
		{Header: 'TX ID', accessor: 'id', Cell: props => <Link href={`/tx/${props.value}`}>{props.value}</Link>},
		{Header: 'From', accessor: 'sender', Cell: props => address === props.value ? <span className="nocolor">{props.value}</span> : <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: '', accessor: 'from', Cell: props => address === props.value ? <span className="type noselect">OUT</span> : <span className="type type-width-in noselect">IN</span>},
		{Header: 'To', accessor: 'payment-transaction.receiver', Cell: props => address === props.value ? <span className="nocolor">{props.value}</span> : <Link href={`/address/${props.value}`}>{props.value}</Link>},
		{Header: 'Amount', accessor: 'payment-transaction.amount', Cell: props => <span>{formatValue(props.value / 1000000)} <AlgoIcon /></span>},
		{Header: 'Time', accessor: 'timestamp', Cell: props=> <span className="nocolor">{moment.unix(props.value).fromNow()}</span>}
	];

	return (
		<Layout data={{
			"address": address,
			// "balance": formatValue(data.amount / 1000000)
			"balance": formatValue(data['amount-without-pending-rewards'] / 1000000)
		}}
		addresspage>
			<div className="cardcontainer address-cards">
				<Statscard
					stat="Round last seen"
					value={loading
						? <Load />
						: (data.confirmed_transactions.length > 0
							? formatValue(data.confirmed_transactions[0]['confirmed-round'])
							: '-'
						)}
				/>
				<Statscard
					stat="Rewards"
					value={loading ? <Load /> : (
						<div>
							{formatValue(data.rewards / 1000000)}
							<AlgoIcon />
						</div>
					)}
				/>
				<Statscard
					stat="Pending rewards"
					value={loading ? <Load /> : (
						<div>
							{formatValue(data['pending-rewards'] / 1000000)}
							<AlgoIcon />
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
				<span>Latest {loading ? 0 : data.confirmed_transactions.length} transactions {loading !== true && data.confirmed_transactions.length > 24 ? <Link href={`/addresstx/${address}`} className="viewmore">View more</Link>: null }</span>
				<div>
					<ReactTable
						data={data.confirmed_transactions}
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
