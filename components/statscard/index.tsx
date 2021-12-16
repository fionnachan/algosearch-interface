import React from "react";
import styles from "./Statscard.module.scss";

const Statscard = ({ stat, value }: { stat: string; value: JSX.Element }) => {
  return (
    <div className={styles.statscard}>
      <h2>{stat}</h2>
      {value}
    </div>
  );
};

export default Statscard;
