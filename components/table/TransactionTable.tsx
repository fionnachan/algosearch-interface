import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import TimeAgo from 'timeago-react';
import { getAlgodClient } from '../../utils/algorand';
import { ellipseAddress, microAlgosToAlgos } from '../../utils/stringUtils';
import AlgoIcon from '../algoicon';
import styles from './TransactionTable.module.scss';

const TransactionTable = ({transactions}) => {
  const algod = getAlgodClient();
  return (
    <div className={styles['transaction-table']}>
      {
        transactions.map(tx => {
          const _receiver = tx['payment-transaction'].receiver || tx.sender;
          let _asaUnit = "";
          // if (tx['tx-type'] === 'axfer') {
          //   algod.getAssetByID(tx['asset-transfer-transaction']['asset-id']).do()
          //     .then(results => {
          //       console.log("asa? ", results)
          //     })
          // }

          
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
                        `${tx['asset-transfer-transaction'].amount} ASA id ${tx['asset-transfer-transaction']['asset-id']}`
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
