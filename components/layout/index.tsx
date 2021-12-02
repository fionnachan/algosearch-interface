import React, { useEffect, useState } from 'react';
import moment from 'moment';
import styles from './Layout.module.css';

import AddressHeader from '../addressheader';
import HeaderSearch from '../headersearch';
import MainHeader from '../mainheader';
import Footer from '../footer';
import HomeHeader from '../homeheader';
import HomeFooter from '../homefooter';

const Layout = (props) => {
	const [scroll, setScroll] = useState(false);

	useEffect(() => {
		// Moment global setup
		moment.updateLocale('en', {
			relativeTime: {
				s: number=>number + " seconds",
			}
		});
		// Check for scroll to top button position
		window.addEventListener('scroll', renderScrollTop);

	}, []);


	// Scroll to top button — render behaviour
	const renderScrollTop = () => {
		let scroll_position = window.pageYOffset;
		setScroll(!scroll && scroll_position > 500);
	}

	// Scroll to top button — scroll up behaviour
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}

	return (
		<div className={styles.layout}>
			<div className={styles.topheader}>
				<div className={styles.sizer}>
					<HeaderSearch />
				</div>
			</div>
			<div className={styles.bottomheader}>
				<div className={styles.sizer}>
					<MainHeader />
				</div>
			</div>
			{props.addresspage ? (
				<AddressHeader data={props.data} />
			) : null}
			{props.homepage ? (
				<HomeHeader synced={props.synced} genesisId={props.genesisId} />
			) : null}
			<div className={`${styles.content} ${props.homepage ? styles["content-shortened"] : ""}`}>
				<div className={styles.sizer}>
					{props.children}
				</div>
			</div>
			{props.homepage && (
				<div className={styles.subfooter}>
					<div className={styles.sizer}>
						<HomeFooter />
					</div>
				</div>
			)}
			<div className={styles.footer}>
				<div className={styles.sizer}>
					<Footer />
				</div>
			</div>
			<button className={`${styles.scrolltop} ${scroll ? '' : styles.hiddenscroll}`} onClick={scrollToTop}>➜</button>
		</div>
	);
}

export default Layout;
