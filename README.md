```
git@github.com:RaekwonIII/ssv-bapps-subgraph.git
npm install -g @graphprotocol/graph-cli
npm i
graph codegen
graph create bapp-lite --node http://127.0.0.1:8020
graph build --network mainnet
graph deploy --ipfs http://localhost:5001 --node http://localhost:8020 bapp-lite
```