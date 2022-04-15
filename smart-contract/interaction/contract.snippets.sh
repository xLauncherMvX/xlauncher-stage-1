PROJECT="${PWD}"

#possible pem values
#devnet_owner_wallet.pem
#testnet_owner_wallet.pem
#mainnet_owner_wallet.pem
PEM_FILE="${PROJECT}/../../utils/devnet_owner_wallet.pem"
ADDRESS=$(erdpy data load --key=address-devnet)
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-devnet)
MY_DECIMALS="000000000000000000"

#devnet proxy and chain
#devnet=https://devnet-gateway.elrond.com
#testnet=https://testnet-gateway.elrond.com
#mainnet=https://mainnet-gateway.elrond.com
PROXY=https://devnet-gateway.elrond.com

#chain values: D, T, M
CHAINID=D


MY_LOGS="interaction-logs"
#envs logs values: devnet, testnet, mainnet
ENV_LOGS="devnet"

#token id values: devnet=XLH-cb26c7, testnet=XLH-0be7d1, mainnet=XLH-8daa50
TOKEN_ID="XLH-cb26c7"
TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)

INITIAL_PRICE=10000000000000000000000
MIN_AMOUNT=250000000000000000
MAX_AMOUNT=5000000000000000000
MAX_BALANCE="55000${MY_DECIMALS}"

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
  amount="13000000${MY_DECIMALS}"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=2000000 \
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

getPrice(){
  erdpy --verbose contract query ${ADDRESS} --function="getPrice" \
    --proxy=${PROXY}
}

getMinAmount(){
  erdpy --verbose contract query ${ADDRESS} --function="getMinAmount" \
    --proxy=${PROXY}
}

getMaxAmount(){
   erdpy --verbose contract query ${ADDRESS} --function="getMaxAmount" \
     --proxy=${PROXY}
 }

 getMaxBalance(){
    erdpy --verbose contract query ${ADDRESS} --function="getMaxBalance" \
      --proxy=${PROXY}
  }

buyTokens(){
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
      --pem=${PEM_FILE} \
      --gas-limit=3000000 \
      --function="buy" \
      --value=1000000000000000000 \
      --proxy=${PROXY} --chain=${CHAINID} \
      --send \
      --outfile="${MY_LOGS}/buyTokens-${ENV_LOGS}.json"
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