import React, { useEffect } from 'react';
import Layout from '../../components/layout';
import Breadcrumbs from '../../components/breadcrumbs';

const Dev = () => {
	useEffect(() => {
		document.title="AlgoSearch | Developer APIs";
	}, []);

	return (
		<Layout>
			<Breadcrumbs
				name="Developer APIs"
				parentLink="/"
				parentLinkName="Home"
				currentLinkName="Developer APIs"
			/>
			<h1>Coming Soon</h1>
		</Layout>
	);
}

export default Dev;
