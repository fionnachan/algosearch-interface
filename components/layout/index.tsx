import React from 'react';
import moment from 'moment';
import styles from './Layout.module.css';

import AddressHeader from '../addressheader';
import HeaderSearch from '../headersearch';
import MainHeader from '../mainheader';
import Footer from '../footer';
import HomeHeader from '../homeheader';
import HomeFooter from '../homefooter';

class Layout extends React.Component {
	state = {
		scroll: false
	};

	componentDidMount() {
		// Moment global setup
		moment.updateLocale('en', {
			relativeTime: {
				s: number=>number + " seconds",
			}
		});
		// Check for scroll to top button position
		window.addEventListener('scroll', this.renderScrollTop.bind(this));
	}

	// Scroll to top button — render behaviour
	renderScrollTop() {
		let scroll_position = window.pageYOffset;

		if (!this.state.scroll && scroll_position > 500) {
			this.setState({scroll: true});
		} else if (this.state.scroll && scroll_position <= 500) {
			this.setState({scroll: false});
		}
	}

	// Scroll to top button — scroll up behaviour
	scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}

	render() {
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
				{this.props.addresspage ? (
					<AddressHeader data={this.props.data} />
				) : null}
				{this.props.homepage ? (
					<HomeHeader synced={this.props.synced} genesisId={this.props.genesisId} />
				) : null}
				<div className={`${styles.content} ${this.props.homepage ? styles["content-shortened"] : ""}`}>
					<div className={styles.sizer}>
						{this.props.children}
					</div>
				</div>
				{this.props.homepage ? (
					<div className={styles.subfooter}>
						<div className={styles.sizer}>
							<HomeFooter />
						</div>
					</div>
				) : null }
				<div className={styles.footer}>
					<div className={styles.sizer}>
						<Footer />
					</div>
				</div>
				<button className={`${styles.scrolltop} ${this.state.scroll ? '' : styles.hiddenscroll}`} onClick={this.scrollToTop}>➜</button>
			</div>
		);
	}
}

export default Layout;
