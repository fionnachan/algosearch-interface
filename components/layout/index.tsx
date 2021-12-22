import React, { useEffect, useState } from "react";
import moment from "moment";
import Head from "next/head";
import styles from "./Layout.module.css";

import AddressHeader from "../addressheader";
import MainHeader from "../mainheader";
import Footer from "../footer";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";

type LayoutPropsType = {
  addresspage?: boolean;
  data?: {
    balance: number;
    address: string;
  };
  children: React.ReactNode;
  homepage?: boolean;
};

const Layout = ({ addresspage, data, homepage, children }: LayoutPropsType) => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    // Moment global setup
    moment.updateLocale("en", {
      relativeTime: {
        s: (number) => number + " seconds",
      },
    });
    // Check for scroll to top button position
    window.addEventListener("scroll", renderScrollTop);
  }, []);

  // Scroll to top button — render behaviour
  const renderScrollTop = () => {
    let scroll_position = window.pageYOffset;
    setScroll(!scroll && scroll_position > 500);
  };

  // Scroll to top button — scroll up behaviour
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.layout}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="shortcut icon" href="/favicon.svg" />
        <title>AlgoSearch | Algorand Block Explorer</title>
      </Head>
      <MainHeader />
      {addresspage && (
        <AddressHeader balance={data.balance} address={data.address} />
      )}
      {homepage && <HomeHeader />}
      <div className={styles.content}>
        <div className="sizer">{children}</div>
      </div>
      {homepage && (
        <div className={styles.subfooter}>
          <HomeFooter />
        </div>
      )}
      <Footer />
      <button
        className={`${styles.scrolltop} ${scroll ? "" : styles.hiddenscroll}`}
        onClick={scrollToTop}
      >
        ➜
      </button>
    </div>
  );
};

export default Layout;
