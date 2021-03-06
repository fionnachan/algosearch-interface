import React from "react";
import styles from "./AlgoIcon.module.scss";

const AlgoIcon = ({
  isLightColor = false,
  width = 14,
  height = 14,
}: {
  isLightColor?: boolean;
  width?: number;
  height?: number;
}) => {
  return (
    <div className={styles.icon} style={{ width: width, height: height }}>
      <svg
        className={isLightColor ? styles.light : styles.dark}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 38.79 38.928"
      >
        <path
          id="algosvg"
          d="M6.728,38.928l5.63-9.749,5.63-9.715,5.6-9.749L24.51,8.17l.412,1.545,1.716,6.419-1.922,3.33-5.63,9.715-5.6,9.749h6.728l5.63-9.749,2.918-5.046,1.373,5.046,2.609,9.749H38.79l-2.609-9.749-2.609-9.715-.687-2.506,4.188-7.243h-6.11l-.206-.721L28.629,1.03,28.355,0h-5.87l-.137.206L16.855,9.715l-5.63,9.749-5.6,9.715L0,38.928Z"
        />
      </svg>
    </div>
  );
};

export default AlgoIcon;
