import React from 'react';
import AlgoIcon from '../algoicon';
import CopyAddress from './copyaddress';
import styles from './AddressHeader.module.css';

const AddressHeader = (props) => {
	return (
		<div className={styles["address-header"]}>
			<div className="sizer">
				<div>
					<div>
						<h3>Address Information <CopyAddress address={props.data.address} /></h3>
						<p>{props.data.address}</p>
					</div>
					<div>
						<h6>Algo Balance</h6>
						<p><AlgoIcon /> {props.data.balance}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddressHeader;
