import Link from 'next/link';
import React from 'react';
import styles from "./Breadcrumbs.module.css";

const Breadcrumbs = (props) => {
	return (
		<div className={`${styles.breadcrumbs} ${props.address && props.address !== '' ? styles["breadcrumbs-address-tx"] : null}`}>
			<div>
				<h1>{props.name}</h1>
				{props.address && props.address !== '' ? <span>{props.address}</span> : null}
			</div>
			<div>
				<p><Link href={props.parentLink}>{props.parentLinkName}</Link> <span className="noselect">/</span> {props.currentLinkName}</p>
			</div>
		</div>
	);
}

export default Breadcrumbs;
