import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import TimeAgo from 'timeago-react';
import {siteName} from '../../utils/constants';
import { ellipseAddress, microAlgosToAlgos } from '../../utils/stringUtils';
import AlgoIcon from '../algoicon';
import styles from './TransactionTable.module.scss';

const TransactionTable = ({transactions}) => {
  const [asaList, setAsaList] = useState([]);

  useEffect(() => {
    async function getAsas() {
      const _asaList =await Promise.all(transactions.map(async (tx) => {
        if (tx['tx-type'] === 'axfer') {
          const asa_id = tx['asset-transfer-transaction']['asset-id'];          
          return await axios({
            method: 'get',
            url: `${siteName}/v1/algod/assets/${asa_id}`
          }).then(response => {
            console.log("asa unit name?", response.data.params["unit-name"])
            return response.data.params["unit-name"];
            // console.log("asa? ", response.data.params)
          }).catch(error => {
            console.error("Error when retrieving Algorand ASA");
          })
        } else {
          return null;
        }
      }))
      setAsaList(_asaList);
      console.log("_asalist: ", _asaList)
    }
    getAsas();
  }, []);

  return (
    <div className={styles['transaction-table']}>
      {
        transactions.map((tx, index) => {
          const _receiver = tx['payment-transaction'].receiver || tx.sender;
          let _asaUnit = asaList[index];
          
          // * (pay) payment-transaction
          // * (keyreg) keyreg-transaction
          // * (acfg) asset-config-transaction
          // * (axfer) asset-transfer-transaction
          // * (afrz) asset-freeze-transaction
          // * (appl) application-transaction
          

          return (
            <div key={tx.id} className={styles['transaction-row']}>
              <div className={styles['transaction-subrow']}>
                <span className={styles['transaction-id']}>
                  <Link href={`/transaction/${tx.id}`}>{tx.id}</Link>
                </span>
                <span className={styles.time}>
                  <TimeAgo datetime={new Date(moment.unix(tx['round-time'])._d)} locale="en_short"/>
                </span>
              </div>
              <div className={styles['transaction-subrow']}>
                <div className={styles['relevant-accounts']}>
                  <span>From: <Link href={`/address/${tx.sender}`}>{ellipseAddress(tx.sender)}</Link></span>
                  <span>To: <Link href={`/address/${_receiver}`}>{ellipseAddress(_receiver)}</Link></span>
                </div>
                <div className={styles['transaction-info']}>
                  <span>Type: {tx['tx-type']}</span>
                  <span>
                    {
                      tx['tx-type'] === 'axfer' ?
                        `${microAlgosToAlgos(tx['asset-transfer-transaction'].amount)} ${_asaUnit}`
                        : <>
                          <AlgoIcon /> {microAlgosToAlgos(tx['payment-transaction'].amount)}
                        </>
                    }
                  </span>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  );
}

export default TransactionTable;
