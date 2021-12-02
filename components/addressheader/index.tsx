import React from 'react';
import AlgoIcon from '../algoicon';
import CopyAddress from './copyaddress';
import styles from './AddressHeader.module.css';

const AddressHeader = () => {
	return (
		<div className={styles["address-header"]}>
			<div className="sizer">
				<div>
					<div>
						<h3>Address Information <CopyAddress address={this.props.data.address} /></h3>
						<p>{this.props.data.address}</p>
					</div>
					<div>
						<h6>Algo Balance</h6>
						<p><AlgoIcon /> {this.props.data.balance}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddressHeader;
