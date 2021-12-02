import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import styles from './MainHeader.module.css';

const MainHeader = () => {
	const [open, setOpen] = useState(false);

	const updateDimensions = (event) => {
		if (window.innerWidth > 950) {
			setOpen(false);
		}
	}

	useEffect(() => {
		window.addEventListener('resize', updateDimensions);

		// returned function will be called on component unmount 
		return () => {
		  window.removeEventListener('resize', updateDimensions)
		}
	}, []);

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
						onClick={() => setOpen(!open)}
					>
						Hamburger Button
					</span>
				</div>
			</div>
			<div className={`${styles["menu-mobile"]} ${open ? styles.shown : styles.hidden}`}>
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

export default MainHeader;
