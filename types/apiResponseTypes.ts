export interface ICurrentRoundResponse {
  round: number;
  "genesis-id": number;
  transactions?: [];
}

export interface ILatestBlocksResponse {
  num_of_blks: number;
  num_of_pages: number;
  items: [];
}
