# X Launcher presale contract

This is the X Launcher presale contract. 
Is a very simple contract and al the storage values are initialized at deploy time

## The flow
- owner deploys the contract
- owner uses `fundContract` in order to add specific token funds to the contract
- clients can use `buy` endpoint in order to buy specific amounts of available token funds. The contract decides based on the stored `price` field and the paid `EGLD` value the amount that will be transferred in the client wallet.

