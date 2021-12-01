import React from 'react';
import Link from 'next/link'
import Image from 'next/image';
import Layout from '../../components/layout';
import styles from './Error.module.css';

export default class FourOhFour extends React.Component {
	render() {
		return (
			<Layout>
				<div className="FourOhFour">
					<img src="/404.svg" alt="404" />
					<h1>Oops!</h1>
					<p>It looks like this page has been lost.</p>
					<p>While we try to find it, how about taking a trip back home?</p>
					<Link href="/home">Return home</Link>
				</div>
			</Layout>
		);
	}
}