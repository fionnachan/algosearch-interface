import React from 'react';
import Image from 'next/image';
import { algodurl } from '../../utils/constants';
import styles from './HomeHeader.module.css';

export default class HomeHeader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			synced: false,
		};
	}
	render() {
		return (
			<div className={styles["home-search"]}>
				<div className="sizer">
					<div>
						<h1><Image src="/algo.svg" width={14} height={14} alt="Algorand logo"/>Block Explorer</h1>
						<span>Open-source block explorer for the Algorand mainnet. Currently
							<div className={styles["home-status"]}>
								<div className={`status-light ${this.props.synced ? "status-online" : "status-offline"}`} /> {this.props.synced ? "in sync" : "out of sync"}
							</div> with the network <a href={algodurl}>{this.props.genesisId}</a>
						</span>
					</div>
					<div>
					</div>
				</div>
			</div>
		)
	}
}
