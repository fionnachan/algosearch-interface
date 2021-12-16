import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout";
import Breadcrumbs from "../../components/breadcrumbs";
import Load from "../../components/tableloading";
import { siteName } from "../../utils/constants";
import styles from "./Transaction.module.css";
import { useRouter } from "next/router";
import { TxType } from "../../components/table/TransactionTable";
import TransactionDetails from "./TransactionDetails";

export type TransactionResponse = {
  id: number;
  "genesis-id": number;
  "genesis-hash": string;
  "confirmed-round": number;
  "tx-type": TxType;
  sender: string;
  "sender-rewards": number;
  "receiver-rewards": number;
  "payment-transaction": {
    amount: number;
    receiver: string;
  };
  "asset-transfer-transaction": {
    "asset-id": number;
    amount: number;
  };
  fee: number;
  "round-time": number;
  "first-valid": number;
  "last-valid": number;
  timestamp: number;
  note: string;
};

const Transaction = () => {
  const router = useRouter();
  const { _txid } = router.query;
  const [txid, setTxid] = useState("");
  const [transaction, setTransaction] = useState<TransactionResponse>();
  const [loading, setLoading] = useState(true);

  const getTransaction = (txid: string) => {
    axios({
      method: "get",
      url: `${siteName}/v1/transactions/${txid}`,
    })
      .then((response) => {
        console.log("transaction id data: ", response.data);
        setTransaction(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Exception when retrieving transaction details: " + error);
      });
  };

  useEffect(() => {
    document.title = `AlgoSearch | Transaction ${txid}`;
  }, []);

  useEffect(() => {
    if (!_txid) {
      return;
    }
    setTxid(_txid.toString());
    getTransaction(_txid.toString());
  }, [_txid]);

  return (
    <Layout>
      <Breadcrumbs
        name={`Transaction Details`}
        parentLink="/transactions"
        parentLinkName="Transactions"
        currentLinkName={`Transaction Details`}
      />
      <div className={styles["block-table"]}>
        <span>Transaction Details</span>
        {transaction ? (
          <TransactionDetails transaction={transaction} />
        ) : (
          <Load />
        )}
      </div>
    </Layout>
  );
};

export default Transaction;
