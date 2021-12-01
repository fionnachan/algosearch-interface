import Link from 'next/link';
import React from 'react';
import Image from "next/image";
import styles from './MainHeader.module.css';

class MainHeader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
		}
	}
	updateDimensions = e => {
		if (window.innerWidth > 950) {
			this.setState({open: false});
		}
	}
	componentDidMount() {
		this.updateDimensions();
		window.addEventListener('resize', this.updateDimensions.bind(this));
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions.bind(this));
	}
	render() {
		return (
			<div className={styles.mainheader}>
				<div className={styles.logo}>
					<Link href="/">
						<Image src="/algo.svg" width={14} height={14} alt="AlgoSearch logo" />
					</Link>
				</div>
				<div className={styles.menu}>
					<nav>
						<ul>
							<li><Link href="/">Home</Link></li>
							<li><Link href="/blocks">Blocks</Link></li>
							<li><Link href="/transactions">Transactions</Link></li>
							<li><Link href="/dev">Developer APIs</Link></li>
						</ul>
					</nav>
					<div className={styles.hamburger}>
						<span
							onClick={() => this.setState(previous => ({open: !previous.open}))}
						>
							Hamburger Button
						</span>
					</div>
				</div>
				<div className={`${styles["menu-mobile"]} ${this.state.open ? "shown" : "hidden"}`}>
					<nav>
						<ul>
							<li><Link href="/">Home</Link></li>
							<li><Link href="/blocks">Blocks</Link></li>
							<li><Link href="/transactions">Transactions</Link></li>
							<li><Link href="/dev">Developer APIs</Link></li>
						</ul>
					</nav>
				</div>
			</div>
		);
	}
}

export default MainHeader;
