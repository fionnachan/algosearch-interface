import Configuration from "./config"
import algosdk from 'algosdk'

let algodClient: algosdk.Algodv2;
export function getAlgodClient(): algosdk.Algodv2 {
    if (algodClient !== undefined) return algodClient

    const token = Configuration.algod.token
    const server= Configuration.algod.host 
    const port  = Configuration.algod.port

    algodClient = new algosdk.Algodv2(token, server, port)

    return algodClient
}

let indexerClient: algosdk.Indexer;
function getIndexerClient(): algosdk.Indexer {
    if (indexerClient !== undefined) return indexerClient

    const token = Configuration.indexer.token
    const server= Configuration.indexer.host 
    const port  = Configuration.indexer.port

    indexerClient = new algosdk.Indexer(token, server, port)

    return indexerClient
}