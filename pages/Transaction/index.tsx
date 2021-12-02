import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import Load from '../../components/tableloading';
import AlgoIcon from '../../components/algoicon';
import {formatValue, siteName} from '../../utils/constants';
import styles from './Transaction.module.css';
import { useRouter } from 'next/router';

const Transaction = (props) => {
	const router = useRouter();
	const { _txid } = router.query;
	const [txid, setTxid] = useState("");
	const [transaction, setTransaction] = useState([]);
	const [loading, setLoading] = useState(true);

	const getTransaction = txid => {
		axios({
			method: 'get',
			url: `${siteName}/v1/transactions/${txid}`
		}).then(response => {
			setTransaction(response.data);
			setLoading(false);
		}).catch(error => {
			console.log("Exception when retrieving transaction details: " + error);
		})
	};

	useEffect(() => {
		document.title=`AlgoSearch | Transaction ${txid}`;
	}, []);

	useEffect(() => {
		setTxid(_txid.toString());
		getTransaction(txid);
	}, [_txid]);

	return (
		<Layout>
			<Breadcrumbs
				name={`Transaction Details`}
				parentLink="/transactions"
				parentLinkName="Transactions"
				currentLinkName={`Transaction Details`}
			/>
			<div className={styles["block-table"]}>
				<span>Transaction Details</span>
				<div>
					<table cellSpacing="0">
						<thead>
							<tr>
								<th>Identifier</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ID</td>
								<td>{loading ? <Load /> : transaction.transaction.id}</td>
							</tr>
							<tr>
								<td>Round</td>
								<td>{loading ? <Load /> : <Link href={`/block/${transaction.transaction['comfirmed-round']}`}>{transaction.transaction['confirmed-round']}</Link>}</td>
							</tr>
							<tr>
								<td>Type</td>
								<td>{loading ? <Load /> : <span className="type noselect">{transaction.transaction['tx-type']}</span>}</td>
							</tr>
							<tr>
								<td>Sender</td>
								<td>{loading ? <Load /> : <Link href={`/address/${transaction.transaction.sender}`}>{transaction.transaction.sender}</Link>}</td>
							</tr>
							<tr>
								<td>Receiver</td>
								<td>{loading ? <Load /> : <Link href={`/address/${transaction.transaction['payment-transaction'].receiver}`}>{transaction.transaction['payment-transaction'].receiver}</Link>}</td>
							</tr>
							<tr>
								<td>Amount</td>
								<td>{loading ? <Load /> : (
									<div className="tx-hasicon">
										{formatValue(transaction.transaction['payment-transaction'].amount / 1000000)}
										<AlgoIcon />
									</div>
								)}</td>
							</tr>
							<tr>
								<td>Fee</td>
								<td>{loading ? <Load /> : (
									<div className="tx-hasicon">
										{formatValue(transaction.transaction.fee / 1000000)}
										<AlgoIcon />
									</div>
								)}</td>
							</tr>
							<tr>
								<td>First round</td>
								<td>{loading ? <Load /> : <Link href={`/block/${transaction.transaction["first-valid"]}`}>{transaction.transaction["first-valid"]}</Link>}</td>
							</tr>
							<tr>
								<td>Last round</td>
								<td>{loading ? <Load /> : <Link href={`/block/${transaction.transaction["last-valid"]}`}>{transaction.transaction["last-valid"]}</Link>}</td>
							</tr>
							<tr>
								<td>Timestamp</td>
								<td>{loading ? <Load /> : moment.unix(transaction.timestamp).format("LLLL")}</td>
							</tr>
							<tr>
								<td>Note</td>
								<td>
									{loading ? <Load /> : (
										<div>
											{transaction.transaction.note && transaction.transaction.note !== '' ? (
												<div>
													<div>
														<span>Base 64:</span>
														<textarea defaultValue={transaction.transaction.note} readOnly></textarea>
													</div>
													<div>
														<span>Converted:</span>
														<textarea defaultValue={atob(transaction.transaction.note)} readOnly></textarea>
													</div>
												</div>
											) : null}
										</div>
									)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div className="block-table">
				<span>Miscellaneous Details</span>
				<div>
					<table cellSpacing="0">
						<thead>
							<tr>
								<th>Identifier</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>From rewards</td>
								<td>{loading ? <Load /> : (
									<div className="tx-hasicon">
										{formatValue(transaction.transaction['sender-rewards'] / 1000000)}
										<AlgoIcon />
									</div>
								)}</td>
							</tr>
							<tr>
								<td>To rewards</td>
								<td>{loading ? <Load /> : (
									<div className="tx-hasicon">
										{formatValue(transaction.transaction['receiver-rewards'] / 1000000)}
										<AlgoIcon />
									</div>
								)}</td>
							</tr>
							<tr>
								<td>Genesis ID</td>
								<td>{loading ? <Load /> : transaction.transaction['genesis-id']}</td>
							</tr>
							<tr>
								<td>Genesis hash</td>
								<td>{loading ? <Load /> : transaction.transaction['genesis-hash']}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
}

export default Transaction;
