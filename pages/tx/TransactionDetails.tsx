import React from "react";
import Link from "next/link";
import AlgoIcon from "../../components/algoicon";
import { integerFormatter, removeSpace } from "../../utils/stringUtils";
import { TransactionResponse } from "./[_txid]";
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
    <>
      <div>
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
                <div className="tx-hasicon">
                  {transaction["payment-transaction"].amount / 1000000}
                  <AlgoIcon />
                </div>
              </td>
            </tr>
            <tr>
              <td>Fee</td>
              <td>
                <div className="tx-hasicon">
                  {transaction.fee / 1000000}
                  <AlgoIcon />
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
              <td>{moment.unix(transaction.timestamp).format("LLLL")}</td>
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
      <div className="block-table">
        <span>Miscellaneous Details</span>
        <div>
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
                  <div className="tx-hasicon">
                    {transaction["sender-rewards"] / 1000000}
                    <AlgoIcon />
                  </div>
                </td>
              </tr>
              <tr>
                <td>To rewards</td>
                <td>
                  <div className="tx-hasicon">
                    {transaction["receiver-rewards"] / 1000000}
                    <AlgoIcon />
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
    </>
  );
};

export default TransactionDetails;
