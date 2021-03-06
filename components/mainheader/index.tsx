import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./MainHeader.module.scss";
import HeaderSearch from "../headersearch";

const MainHeader = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const updateDimensions = (event: UIEvent) => {
    if (window.innerWidth > 950) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);

    // returned function will be called on component unmount
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div className={styles.mainheader}>
      <div className="sizer">
        <div className={styles.headerLeft}>
          <Link href="/">
            <a className={styles.logo}>
              <svg
                id="svg"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="34"
                height="34"
                viewBox="0, 0, 400,400"
              >
                <g id="svgg">
                  <path
                    id="path0"
                    d="M224.369 79.978 C 216.424 93.432,210.255 104.639,210.658 104.884 C 221.255 111.315,227.589 115.985,236.058 123.613 C 241.736 128.727,246.787 131.772,247.283 130.380 C 252.357 116.120,254.031 118.005,261.939 146.881 C 277.506 203.725,278.653 223.236,268.366 256.286 C 261.718 277.647,265.711 279.697,277.183 260.812 C 282.375 252.265,286.964 245.624,287.381 246.054 C 288.171 246.868,302.696 299.475,312.413 336.709 L 318.028 358.228 341.292 358.956 C 354.088 359.356,364.557 358.792,364.557 357.703 C 364.557 356.613,359.443 336.918,353.194 313.937 C 346.944 290.955,336.703 253.221,330.436 230.082 L 319.042 188.012 334.205 161.768 C 353.008 129.223,353.613 131.646,326.680 131.646 L 303.993 131.646 301.095 120.886 C 299.502 114.968,295.081 98.165,291.271 83.544 L 284.345 56.962 261.579 56.240 L 238.813 55.517 224.369 79.978 M129.229 116.690 C 66.135 129.057,30.824 200.265,58.413 259.494 C 80.197 306.261,143.680 329.738,190.364 308.293 L 204.778 301.671 231.389 329.316 C 260.247 359.296,267.571 362.809,278.481 351.899 C 288.120 342.260,285.264 332.982,266.521 313.045 C 257.158 303.085,245.564 290.695,240.756 285.510 L 232.015 276.084 238.725 262.726 C 277.144 186.232,212.729 100.321,129.229 116.690 M175.949 156.635 C 199.777 167.519,217.764 199.202,213.914 223.511 C 203.974 286.290,123.956 301.220,92.980 246.075 C 63.641 193.843,121.309 131.677,175.949 156.635 M147.468 212.694 C 126.675 249.300,126.829 248.779,135.562 252.758 C 171.506 269.135,206.064 219.361,178.945 190.274 C 167.440 177.934,167.060 178.205,147.468 212.694 M77.880 333.634 C 74.460 338.806,69.749 346.741,67.412 351.266 L 63.161 359.494 89.175 359.473 L 115.190 359.452 120.557 349.564 L 125.923 339.676 114.520 336.804 C 108.248 335.225,98.838 331.750,93.608 329.082 L 84.098 324.230 77.880 333.634 M189.490 335.021 C 181.327 337.192,169.620 350.695,169.620 357.940 C 169.620 360.322,219.774 359.786,221.256 357.388 C 225.155 351.080,198.822 332.539,189.490 335.021 "
                    stroke="none"
                    fill="var(--blue-dark)"
                    fillRule="evenodd"
                  ></path>
                </g>
              </svg>
              <span className={styles["logo-text"]}>lgoSearch</span>
            </a>
            {/* <Image src="/logo.svg" width="160" height="40" /> */}
          </Link>
          <nav className={styles.menu}>
            <ul>
              <li>
                <Link href="/blocks">
                  <a
                    className={
                      router.pathname == "/blocks" ? styles.active : ""
                    }
                  >
                    Blocks
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/transactions">
                  <a
                    className={
                      router.pathname == "/transactions" ? styles.active : ""
                    }
                  >
                    Transactions
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <HeaderSearch />
      </div>
    </div>
  );
};

export default MainHeader;
