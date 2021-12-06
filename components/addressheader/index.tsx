import React from 'react';
import AlgoIcon from '../algoicon';
import CopyAddress from './copyaddress';
import styles from './AddressHeader.module.scss';

const AddressHeader = (props) => {
	const algoIconSize = 20;
	return (
		<div className={styles["address-header"]}>
			<div className="sizer">
				<div>
					<h3>Address Information <CopyAddress address={props.data.address} /></h3>
					<p>{props.data.address}</p>
				</div>
				<div>
					<h4>Balance</h4>
					<div className={styles.balance}>
						<AlgoIcon width={algoIconSize} height={algoIconSize}/>
						<span>{props.data.balance}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddressHeader;
