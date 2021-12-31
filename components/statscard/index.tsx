import React from "react";
import styles from "./Statscard.module.scss";

const Statscard = ({ stat, value }: { stat: string; value: JSX.Element }) => {
  return (
    <div className={styles.statscard}>
      <h4>{stat}</h4>
      {value}
    </div>
  );
};

export default Statscard;
