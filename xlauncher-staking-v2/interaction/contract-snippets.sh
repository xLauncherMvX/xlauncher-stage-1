PROJECT="${PWD}"
DEPLOY_TRANSACTION=$(mxpy data load --key=deployTransaction-devnet)
CORE_LOGS="interaction-logs"
MY_DECIMALS="000000000000000000"

MAX_STAKING_VAL="1000000${MY_DECIMALS}"
UNSTAKE_XLH_LOCK_SPAN="864000"
UNSTAKE_SFT_LOCK_SPAN="5184000"
MIN_APY="150000"
MAX_APY="300000"
SFT_INCREMENT_APY="15000"

RANK_1_PRICE="3000000${MY_DECIMALS}"
RANK_2_PRICE="2000000${MY_DECIMALS}"
RANK_3_PRICE="1000000${MY_DECIMALS}"

setEnvDevnet() {
  CURRENT_ENV="devnet"
  ENV_LOGS="${CORE_LOGS}/${CURRENT_ENV}"

  cp -f mxpy.data-storage-devnet.json mxpy.data-storage.json
  PEM_FILE="${PROJECT}/../../wallets/users/devnet_owner_wallet.pem"
  ADDRESS=$(mxpy data load --key=address-devnet)
  PROXY=https://devnet-gateway.multiversx.com
  CHAINID=D

  TOKEN_ID="XLH-4a7cc0"
  SFT_ID="SFT-8ff335"

  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)
  SFT_ID_HEX=$(echo -n ${SFT_ID} | xxd -p)
}

deploy() {
  MY_LOGS="${ENV_LOGS}-deploy.json"
  mxpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${PEM_FILE} \
    --gas-limit=100000000 --send --outfile="${MY_LOGS}" \
    --proxy=${PROXY} --chain=${CHAINID} || return

  TRANSACTION=$(mxpy data parse --file="${MY_LOGS}" --expression="data['emitted_tx']['hash']")
  ADDRESS=$(mxpy data parse --file="${MY_LOGS}" --expression="data['emitted_tx']['address']")

  mxpy data store --key=address-devnet --value=${ADDRESS}
  mxpy data store --key=deployTransaction-devnet --value=${TRANSACTION}

  echo ""
  echo "Smart contract address: ${ADDRESS}"
}

updateContract() {
  MY_LOGS="${ENV_LOGS}-updateContract.json"
  mxpy --verbose contract upgrade ${ADDRESS} --project=${PROJECT} --recall-nonce --pem=${PEM_FILE} \
    --gas-limit=100000000 --send --outfile="${MY_LOGS}" \
    --proxy=${PROXY} --chain=${CHAINID}
}

setContractSettings() {
  MY_LOGS="${ENV_LOGS}-setContractSettings.json"
  mxpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="setContractSettings" \
    --arguments "0x${TOKEN_ID_HEX}" "0x${SFT_ID_HEX}" 1 \
    ${MAX_STAKING_VAL} ${UNSTAKE_XLH_LOCK_SPAN} ${UNSTAKE_SFT_LOCK_SPAN} \
    ${MIN_APY} ${MAX_APY} ${SFT_INCREMENT_APY} \
    --send \
    --outfile="${MY_LOGS}"
}

setPoolPrice() {
  MY_LOGS="${ENV_LOGS}-setPoolPrice.json"
  mxpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="setPoolPrice" \
    --arguments ${RANK_1_PRICE} ${RANK_2_PRICE} ${RANK_3_PRICE} \
    --send \
    --outfile="${MY_LOGS}"
}

createNewPool() {
  method_name="0x$(echo -n 'createNewPool' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  amount="3000000${MY_DECIMALS}"
  rank_id="1"
  MY_LOGS="${ENV_LOGS}-createNewPool.json"
  mxpy --verbose contract call ${ADDRESS} --recall-nonce \
      --pem=${PEM_FILE} \
      --gas-limit=5000000 \
      --proxy=${PROXY} --chain=${CHAINID} \
      --function="ESDTTransfer" \
      --arguments $token_id $amount $method_name $rank_id \
      --send \
      --outfile="${MY_LOGS}"
}

fundWithRewords() {
  MY_LOGS="${ENV_LOGS}-fundWithRewords.json"
  method_name="0x$(echo -n 'fundWithRewords' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  amount="2000000${MY_DECIMALS}"
  mxpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=5000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTTransfer" \
    --arguments $token_id $amount $method_name \
    --send \
    --outfile="${MY_LOGS}"
}
