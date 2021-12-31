import React from "react";
import styles from "./Statscard.module.scss";

const Statscard = ({ stat, value }: { stat: string; value: JSX.Element }) => {
  return (
    <div className={styles.statscard}>
      <h5>{stat}</h5>
      {value}
    </div>
  );
};

export default Statscard;
