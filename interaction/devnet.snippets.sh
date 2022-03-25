PROJECT="${PWD}"
PEM_FILE="${PROJECT}/../walets/users/x-launcher-owner-devnet.pem"
ADDRESS=$(erdpy data load --key=address-devnet)
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-devnet)
MY_DECIMALS="000000000000000000"

PROXY=https://devnet-gateway.elrond.com
CHAINID=D

MY_LOGS="interaction-logs"
ENV_LOGS="devnet"

DEPLOY_GAS="15000000"

TOKEN_ID="BCOIN-aafe6c"
TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)

deploy() {
  local INITIAL_PRICE=100

  erdpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${PEM_FILE} \
    --gas-limit=${DEPLOY_GAS} --send --outfile="${MY_LOGS}/deploy-${ENV_LOGS}.json" \
    --proxy=${PROXY} --chain=${CHAINID} \
    --arguments "0x${TOKEN_ID_HEX}" ${INITIAL_PRICE} || return

  TRANSACTION=$(erdpy data parse --file="${MY_LOGS}/deploy-${ENV_LOGS}.json" --expression="data['emitted_tx']['hash']")
  ADDRESS=$(erdpy data parse --file="${MY_LOGS}/deploy-${ENV_LOGS}.json" --expression="data['emitted_tx']['address']")

  erdpy data store --key=address-devnet --value=${ADDRESS}
  erdpy data store --key=deployTransaction-devnet --value=${TRANSACTION}

  echo ""
  echo "Smart contract address: ${ADDRESS}"
}

fundContract() {
  method_name="0x$(echo -n 'fundContract' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  amount="25${MY_DECIMALS}"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=2000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTTransfer" \
    --arguments $token_id $amount $method_name \
    --send \
    --outfile="${MY_LOGS}/fundContract-${ENV_LOGS}.json"
}

getBalance() {
  erdpy --verbose contract query ${ADDRESS} --function="getBalance" \
    --proxy=${PROXY}
}

getPrice(){
  erdpy --verbose contract query ${ADDRESS} --function="getPrice" \
    --proxy=${PROXY}
}
