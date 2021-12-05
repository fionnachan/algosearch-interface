import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import styles from './MainHeader.module.scss';
import HeaderSearch from '../headersearch';

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
			<div className="sizer">
				<div className={styles.headerLeft}>
					<Link href="/">
						<Image src="/logo.svg" width="160" height="40"/>
					</Link>
					<nav className={styles.menu}>
						<ul>
							<li><Link href="/">Home</Link></li>
							<li><Link href="/blocks">Blocks</Link></li>
							<li><Link href="/transactions">Transactions</Link></li>
							<li><Link href="/dev">Developer APIs</Link></li>
						</ul>
					</nav>
				</div>
				<HeaderSearch />
			</div>
		</div>
	);
}

export default MainHeader;
