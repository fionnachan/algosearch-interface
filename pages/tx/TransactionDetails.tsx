import React from "react";
import Link from "next/link";
import AlgoIcon from "../../components/algoicon";
import {
  integerFormatter,
  microAlgosToAlgos,
  removeSpace,
} from "../../utils/stringUtils";
import { TransactionResponse } from "./[_txid]";
import "react-table-6/react-table.css";
import styles from "../block/Block.module.scss";
import moment from "moment";

const TransactionDetails = ({
  transaction,
}: {
  transaction: TransactionResponse;
}) => {
  if (!transaction) {
    return null;
  }
  return (
    <div className={styles["table-wrapper"]}>
      <div className={styles["block-table"]}>
        <table cellSpacing="0">
          <thead>
            <tr>
              <th>Identifier</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td>{transaction.id}</td>
            </tr>
            <tr>
              <td>Round</td>
              <td>
                <Link
                  href={`/block/${removeSpace(
                    transaction["confirmed-round"].toString()
                  )}`}
                >
                  {integerFormatter.format(
                    Number(
                      removeSpace(transaction["confirmed-round"].toString())
                    )
                  )}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Type</td>
              <td>
                <span className="type noselect">{transaction["tx-type"]}</span>
              </td>
            </tr>
            <tr>
              <td>Sender</td>
              <td>
                <Link href={`/address/${transaction.sender}`}>
                  {transaction.sender}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Receiver</td>
              <td>
                <Link
                  href={`/address/${transaction["payment-transaction"].receiver}`}
                >
                  {transaction["payment-transaction"].receiver}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>
                <div>
                  <AlgoIcon />{" "}
                  {transaction["payment-transaction"].amount / 1000000}
                </div>
              </td>
            </tr>
            <tr>
              <td>Fee</td>
              <td>
                <div>
                  <AlgoIcon /> {microAlgosToAlgos(transaction.fee)}
                </div>
              </td>
            </tr>
            <tr>
              <td>First round</td>
              <td>
                <Link
                  href={`/block/${removeSpace(
                    transaction["first-valid"].toString()
                  )}`}
                >
                  {integerFormatter.format(
                    Number(removeSpace(transaction["first-valid"].toString()))
                  )}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Last round</td>
              <td>
                <Link
                  href={`/block/${removeSpace(
                    transaction["last-valid"].toString()
                  )}`}
                >
                  {integerFormatter.format(
                    Number(removeSpace(transaction["last-valid"].toString()))
                  )}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Timestamp</td>
              <td>{moment.unix(transaction["round-time"]).format("LLLL")}</td>
            </tr>
            <tr>
              <td>Note</td>
              <td>
                {transaction.note && transaction.note !== "" && (
                  <div>
                    <div>
                      <span>Base 64:</span>
                      <textarea
                        defaultValue={transaction.note}
                        readOnly
                      ></textarea>
                    </div>
                    <div>
                      <span>Converted:</span>
                      <textarea
                        defaultValue={atob(transaction.note)}
                        readOnly
                      ></textarea>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h4>Miscellaneous Details</h4>
        <div className={styles["block-table"]}>
          <table cellSpacing="0">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>From rewards</td>
                <td>
                  <div>
                    <AlgoIcon />{" "}
                    {microAlgosToAlgos(transaction["sender-rewards"])}
                  </div>
                </td>
              </tr>
              <tr>
                <td>To rewards</td>
                <td>
                  <div>
                    <AlgoIcon />{" "}
                    {microAlgosToAlgos(transaction["receiver-rewards"])}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Genesis ID</td>
                <td>{transaction["genesis-id"]}</td>
              </tr>
              <tr>
                <td>Genesis hash</td>
                <td>{transaction["genesis-hash"]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
