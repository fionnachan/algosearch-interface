import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/layout";
import Breadcrumbs from "../../components/breadcrumbs";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import AlgoIcon from "../../components/algoicon";
import Load from "../../components/tableloading";
import { formatValue, siteName } from "../../utils/constants";
import styles from "./Block.module.css";
import {
  integerFormatter,
  microAlgosToAlgos,
  removeSpace,
} from "../../utils/stringUtils";

const Block = () => {
  const router = useRouter();
  const { _block } = router.query;
  const [blockNum, setBlockNum] = useState(0);
  const [data, setData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBlock = (blockNum: number) => {
    console.log("IN HERE");
    axios({
      method: "get",
      url: `${siteName}/v1/algod/rounds/${blockNum}`,
    })
      .then((response) => {
        console.log("block: ", response.data);
        setData(response.data);
        setTransactions(response.data.transactions);
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Exception when retrieving block #${blockNum}: ${error}`);
      });
  };

  useEffect(() => {
    console.log("_block: ", _block);
    if (!_block) {
      return;
    }
    document.title = `AlgoSearch | Block ${_block}`;
    getBlock(Number(_block));
    setBlockNum(Number(_block));
  }, [_block]);

  const columns = [
    {
      Header: "Block",
      accessor: "confirmed-round",
      Cell: ({ value }: { value: number }) => {
        const _value = removeSpace(value.toString());
        return (
          <Link href={`/block/${_value}`}>
            {integerFormatter.format(Number(_value))}
          </Link>
        );
      },
    },
    {
      Header: "TX ID",
      accessor: "id",
      Cell: ({ value }: { value: string }) => (
        <Link href={`/tx/${value}`}>{value}</Link>
      ),
    },
    {
      Header: "Type",
      accessor: "tx-type",
      Cell: (props) => <span className="type noselect">{props.value}</span>,
    },
    {
      Header: "From",
      accessor: "sender",
      Cell: (props) => (
        <Link href={`/address/${props.value}`}>{props.value}</Link>
      ),
    },
    {
      Header: "To",
      accessor: "payment-transaction.receiver",
      Cell: (props) => (
        <Link href={`/address/${props.value}`}>{props.value}</Link>
      ),
    },
    {
      Header: "Amount",
      accessor: "payment-transaction.amount",
      Cell: (props) => (
        <span>
          <AlgoIcon /> {microAlgosToAlgos(props.value)}
        </span>
      ),
    },
    {
      Header: "Fee",
      accessor: "fee",
      Cell: ({ value }: { value: number }) => (
        <span>
          <AlgoIcon /> {microAlgosToAlgos(value)}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <Breadcrumbs
        name={`Block #${blockNum}`}
        parentLink="/blocks"
        parentLinkName="Blocks"
        currentLinkName={`Block #${blockNum}`}
      />
      <div className="block-table">
        <span>Block Overview</span>
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
                <td>Round</td>
                <td>{blockNum}</td>
              </tr>
              <tr>
                <td>Proposer</td>
                <td>
                  {loading ? (
                    <Load />
                  ) : (
                    <Link href={`/address/${data.proposer}`}>
                      {data.proposer}
                    </Link>
                  )}
                </td>
              </tr>
              <tr>
                <td>Block hash</td>
                <td>{loading ? <Load /> : data.blockHash}</td>
              </tr>
              <tr>
                <td>Previous block hash</td>
                <td>
                  {loading ? (
                    <Load />
                  ) : (
                    <Link href={`/block/${parseInt(blockNum) - 1}`}>
                      {data["previous-block-hash"]}
                    </Link>
                  )}
                </td>
              </tr>
              <tr>
                <td>Seed</td>
                <td>{loading ? <Load /> : data.seed}</td>
              </tr>
              <tr>
                <td>Created at</td>
                <td>
                  {loading ? (
                    <Load />
                  ) : (
                    moment.unix(data.timestamp).format("LLLL")
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {transactions && transactions.length > 0 ? (
        <div className="block-table">
          <span>Transactions</span>
          <div>
            <ReactTable
              data={transactions}
              columns={columns}
              loading={loading}
              defaultPageSize={5}
              pageSizeOptions={[5, 10, 15]}
              sortable={false}
              className="transactions-table"
            />
          </div>
        </div>
      ) : null}
      <div className="block-table">
        <span>Governance Overview</span>
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
                <td>Current protocol</td>
                <td>
                  {loading ? (
                    <Load />
                  ) : (
                    <a
                      href={data["upgrade-state"]["current-protocol"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data["upgrade-state"]["current-protocol"]}
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>Next protocol</td>
                <td>
                  {loading ? (
                    <Load />
                  ) : (
                    <a
                      href={data["upgrade-state"]["next-protocol"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data["upgrade-state"]["next-protocol"]}
                    </a>
                  )}
                </td>
              </tr>
              <tr>
                <td>Next protocol approvals</td>
                <td>
                  {loading ? (
                    <Load />
                  ) : (
                    data["upgrade-state"]["next-protocol-approvals"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Next protocol vote before</td>
                <td>
                  {loading ? (
                    <Load />
                  ) : (
                    data["upgrade-state"]["next-protocol-vote-before"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Next protocol switch on</td>
                <td>
                  {loading ? (
                    <Load />
                  ) : (
                    data["upgrade-state"]["next-protocol-switch-on"]
                  )}
                </td>
              </tr>
              <tr>
                <td>Upgrade proposal</td>
                <td>
                  {loading ? <Load /> : data["upgrade-vote"]["upgrade-propose"]}
                </td>
              </tr>
              <tr>
                <td>Upgrade approved</td>
                <td>
                  {loading ? <Load /> : data["upgrade-vote"]["upgrade-approve"]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Block;
