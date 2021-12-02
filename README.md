# Krypto bird project

## How to run this project on rinkeby network

add secret info in secrest.json
 ```
 {
    "mnemonic": "get from your metamask",
    "infuraProjectId": "get from infura",
    "etherscanApiKey": "eherscan api key (OPTIONAL)",
    "privateKey": "get from your metamask"
}
```
```bash
npx hardhat run --network rinkeby scripts/deploy.js
npm run dev
```

open http://localhost:3000
