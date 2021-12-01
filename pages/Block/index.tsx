import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AlgoIcon from '../../components/algoicon';
import Load from '../../components/tableloading';
import {formatValue, siteName} from '../../utils/constants';
import styles from './Block.module.css';

class Block extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			blocknum: 0,
			data: [],
			transactions: [],
			loading: true,
		}
	}

	getBlock = blockNum => {
		axios({
			type: 'get',
			url: `${siteName}/blockservice/${blockNum}`
		}).then(response => {
			this.setState({data: response.data, transactions: response.data.transactions, loading: false});
		}).catch(error => {
			console.log(`Exception when retrieving block #${blockNum}: ${error}`)
		})
	}

	componentDidMount() {
		const { blocknum } = this.props.match.params;
		this.setState({blocknum: blocknum});
		document.title=`AlgoSearch | Block ${blocknum}`;
		this.getBlock(blocknum);
	}

	render() {
		const columns = [
			{Header: 'Round', accessor: 'confirmed-round', Cell: props => <Link href={`/block/${props.value}`}>{props.value}</Link>},
			{Header: 'TX ID', accessor: 'id', Cell: props => <Link href={`/tx/${props.value}`}>{props.value}</Link>},
			{Header: 'Type', accessor: 'tx-type', Cell: props => <span className="type noselect">{props.value}</span>},
			{Header: 'From', accessor: 'sender', Cell: props => <Link href={`/address/${props.value}`}>{props.value}</Link>},
			{Header: 'To', accessor: 'payment-transaction.receiver', Cell: props => <Link href={`/address/${props.value}`}>{props.value}</Link>},
			{Header: 'Amount', accessor: 'payment-transaction.amount', Cell: props => <span>{formatValue(props.value/1000000)} <AlgoIcon /></span>},
			{Header: 'Fee', accessor: 'fee', Cell: props => <span>{formatValue(props.value/1000000)} <AlgoIcon /></span>}
		];

		return (
			<Layout>
				<Breadcrumbs
					name={`Block #${this.state.blocknum}`}
					parentLink="/blocks"
					parentLinkName="Blocks"
					currentLinkName={`Block #${this.state.blocknum}`}
				/>
				<div className="block-table">
					<span>Block Overview</span>
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
									<td>Round</td>
									<td>{this.state.blocknum}</td>
								</tr>
								<tr>
									<td>Proposer</td>
									<td>{this.state.loading ? <Load/> : (<Link href={`/address/${this.state.data.proposer}`}>{this.state.data.proposer}</Link>)}</td>
								</tr>
								<tr>
									<td>Block hash</td>
									<td>{this.state.loading ? <Load/> : this.state.data.blockHash}</td>
								</tr>
								<tr>
									<td>Previous block hash</td>
									<td>{this.state.loading ? <Load/> : (<Link href={`/block/${parseInt(this.state.blocknum) - 1}`}>{this.state.data['previous-block-hash']}</Link>)}</td>
								</tr>
								<tr>
									<td>Seed</td>
									<td>{this.state.loading ? <Load/> : this.state.data.seed}</td>
								</tr>
								<tr>
									<td>Created at</td>
									<td>{this.state.loading ? <Load/> : moment.unix(this.state.data.timestamp).format("LLLL")}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				{this.state.transactions && this.state.transactions.length > 0 ? (
					<div className="block-table">
						<span>Transactions</span>
						<div>
							<ReactTable
								data={this.state.transactions}
								columns={columns}
								loading={this.state.loading}
								defaultPageSize={5}
								pageSizeOptions={[5, 10, 15]}
								sortable={false}
								className="transactions-table"
							/>
						</div>
					</div>
				) : null}
				<div className="block-table">
					<span>Governance Overview</span>
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
									<td>Current protocol</td>
									<td>
										{this.state.loading ? <Load/> : (<a href={this.state.data['upgrade-state']['current-protocol']} target="_blank" rel="noopener noreferrer">{this.state.data['upgrade-state']['current-protocol']}</a>)}
									</td>
								</tr>
								<tr>
									<td>Next protocol</td>
									<td>
										{this.state.loading ? <Load/> : (<a href={this.state.data['upgrade-state']['next-protocol']} target="_blank" rel="noopener noreferrer">{this.state.data['upgrade-state']['next-protocol']}</a>)}
									</td>
								</tr>
								<tr>
									<td>Next protocol approvals</td>
									<td>{this.state.loading ? <Load/> : this.state.data['upgrade-state']['next-protocol-approvals']}</td>
								</tr>
								<tr>
									<td>Next protocol vote before</td>
									<td>{this.state.loading ? <Load/> : this.state.data['upgrade-state']['next-protocol-vote-before']}</td>
								</tr>
								<tr>
									<td>Next protocol switch on</td>
									<td>{this.state.loading ? <Load/> : this.state.data['upgrade-state']['next-protocol-switch-on']}</td>
								</tr>
								<tr>
									<td>Upgrade proposal</td>
									<td>{this.state.loading ? <Load/> : this.state.data['upgrade-vote']['upgrade-propose']}</td>
								</tr>
								<tr>
									<td>Upgrade approved</td>
									<td>{this.state.loading ? <Load/> : this.state.data['upgrade-vote']['upgrade-approve']}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</Layout>
		);
	}
}

export default Block;
