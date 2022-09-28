PROJECT="${PWD}"

#possible pem values
#devnet_owner_wallet.pem
#testnet_owner_wallet.pem
#mainnet_owner_wallet.pem

#address key values: this is the same for all networks

#deploy transaction values: this is the same for all networks
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-devnet)

MY_DECIMALS="000000000000000000"

#devnet proxy and chain
#devnet=https://devnet-gateway.elrond.com
#testnet=https://testnet-gateway.elrond.com
#mainnet=https://mainnet-gateway.elrond.com

#chain values: D, T, M
CURRENT_ENV="not-set"
MY_LOGS="interaction-logs"
#envs logs values: devnet, testnet, mainnet
#token id values: devnet=XLH-4f55ab, testnet=XLH-0be7d1, mainnet=XLH-8daa50

INITIAL_PRICE="14500${MY_DECIMALS}"
MIN_AMOUNT="1${MY_DECIMALS}"
MAX_AMOUNT="25${MY_DECIMALS}"
MAX_BALANCE="362500${MY_DECIMALS}"

setEnvDevnet() {
  cp -f erdpy.data-storage-devnet.json erdpy.data-storage.json
  CURRENT_ENV="devnet"
  #PEM_FILE="${PROJECT}/../../wallets/users/devnet_owner_wallet.pem"
  PEM_FILE="${PROJECT}/../../wallets/users/client1.pem"
  ADDRESS=$(erdpy data load --key=address-devnet)
  PROXY=https://devnet-gateway.elrond.com
  CHAINID=D
  ENV_LOGS="devnet"
  TOKEN_ID="ESTAR-024281"
  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)
}

setEnvTestnet() {
  cp -f erdpy.data-storage-testnet.json erdpy.data-storage.json
  CURRENT_ENV="testnet"
  PEM_FILE="${PROJECT}/../../wallets/users/testnet_owner_wallet.pem"
  #PEM_FILE="${PROJECT}/../../wallets/users/client1.pem"
  ADDRESS=$(erdpy data load --key=address-devnet)
  PROXY=https://testnet-gateway.elrond.com
  CHAINID=T
  ENV_LOGS="testnet"
  TOKEN_ID="XLH-b7f529"
  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)
}

setEnvMainnet() {
  cp -f erdpy.data-storage-mainnet.json erdpy.data-storage.json
  CURRENT_ENV="mainnet"
  PEM_FILE="${PROJECT}/../../wallets/users/mainnet_owner_wallet.pem"
  ADDRESS=$(erdpy data load --key=address-devnet)
  PROXY=https://api.elrond.com
  CHAINID=1
  ENV_LOGS="mainnet"
  #TOKEN_ID="BCOIN-efba9c"
  TOKEN_ID="ESTAR-afaaf0"
  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)
}

printCurrentEnv() {
  echo ${CURRENT_ENV}
}

deploy() {
  erdpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${PEM_FILE} \
    --gas-limit=30000000 --send --outfile="${MY_LOGS}/deploy-${ENV_LOGS}.json" \
    --proxy=${PROXY} --chain=${CHAINID} \
    --arguments "0x${TOKEN_ID_HEX}" ${INITIAL_PRICE} ${MIN_AMOUNT} ${MAX_AMOUNT} ${MAX_BALANCE} || return

  TRANSACTION=$(erdpy data parse --file="${MY_LOGS}/deploy-${ENV_LOGS}.json" --expression="data['emitted_tx']['hash']")
  ADDRESS=$(erdpy data parse --file="${MY_LOGS}/deploy-${ENV_LOGS}.json" --expression="data['emitted_tx']['address']")

  erdpy data store --key=address-devnet --value=${ADDRESS}
  erdpy data store --key=deployTransaction-devnet --value=${TRANSACTION}

  echo ""
  echo "Smart contract address: ${ADDRESS}"
}

updateContract() {
  erdpy --verbose contract upgrade ${ADDRESS} --project=${PROJECT} --recall-nonce --pem=${PEM_FILE} \
    --gas-limit=30000000 --send --outfile="${MY_LOGS}/deploy-${ENV_LOGS}.json" \
    --proxy=${PROXY} --chain=${CHAINID} \
    --arguments "0x${TOKEN_ID_HEX}" ${INITIAL_PRICE} ${MIN_AMOUNT} ${MAX_AMOUNT} ${MAX_BALANCE}
}

fundContract() {
  method_name="0x$(echo -n 'fundContract' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  amount="11600001${MY_DECIMALS}"
  #  amount="58501${MY_DECIMALS}"
  #  amount="1${MY_DECIMALS}"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=3000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTTransfer" \
    --arguments $token_id $amount $method_name \
    --send \
    --outfile="${MY_LOGS}/fundContract-${ENV_LOGS}.json"
}

getTokenBalance() {
  erdpy --verbose contract query ${ADDRESS} --function="getTokenBalance" \
    --proxy=${PROXY}
}

getPrice() {
  erdpy --verbose contract query ${ADDRESS} --function="getPrice" \
    --proxy=${PROXY}
}

getMinAmount() {
  erdpy --verbose contract query ${ADDRESS} --function="getMinAmount" \
    --proxy=${PROXY}
}

getMaxAmount() {
  erdpy --verbose contract query ${ADDRESS} --function="getMaxAmount" \
    --proxy=${PROXY}
}

getMaxBalance() {
  erdpy --verbose contract query ${ADDRESS} --function="getMaxBalance" \
    --proxy=${PROXY}
}

buyTokens() {
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=4000000 \
    --function="buy" \
    --value="1${MY_DECIMALS}" \
    --proxy=${PROXY} --chain=${CHAINID} \
    --send \
    --outfile="${MY_LOGS}/buyTokens-${ENV_LOGS}.json"
}

getClientBoughtValue() {
  # erdpy wallet bech32 --decode erd1m98v82l4vkkejlwjka944r7nhlrf8j4xjefw03m0d2tzt5pywgyqfsq39v
  erdpy --verbose contract query ${ADDRESS} --function="getClientBoughtValue" \
    --arguments 0xd94ec3abf565ad997dd2b74b5a8fd3bfc693caa69652e7c76f6a9625d0247208 \
    --proxy=${PROXY}
}

collect() {
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=5000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="collect" \
    --send \
    --outfile="${MY_LOGS}/fundContract-${ENV_LOGS}.json"
}
