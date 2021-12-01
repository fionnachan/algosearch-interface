import React from 'react';
import styles from './Footer.module.css';

class Footer extends React.Component {
	render() {
		return (
			<div className={styles.footerItem}>
				<div>
					<p>AlgoSearch &copy; 2021.</p>
				</div>
			</div>
		);
	}
}

export default Footer;
