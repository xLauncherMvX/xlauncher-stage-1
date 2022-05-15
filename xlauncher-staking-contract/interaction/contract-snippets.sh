PROJECT="${PWD}"
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-devnet)

MY_DECIMALS="000000000000000000"
MIN_AMOUNT=250000000000000000

MY_LOGS="interaction-logs"

PULL_A_ID="1"
PULL_A_LOCKING_TIME_SPAN="0"
APY_A0_ID="1"
APY_A0_START=$(date -d '2022-05-12 00:00:00' +"%s")
APY_A0_END=$(date -d '2022-06-02 00:00:00' +"%s")
APY_A0_APY="100"

PULL_B_ID="2"
PULL_B_LOCKING_TIME_SPAN="5184000"
APY_B0_ID="1"
APY_B0_START=$(date -d '2022-05-12 00:00:00' +"%s")
APY_B0_END=$(date -d '2022-06-02 00:00:00' +"%s")
APY_B0_APY="200"

PULL_C_ID="3"
PULL_C_LOCKING_TIME_SPAN="15552000"
APY_C0_ID="1"
APY_C0_START=$(date -d '2022-05-12 00:00:00' +"%s")
APY_C0_END=$(date -d '2022-06-02 00:00:00' +"%s")
APY_C0_APY="300"

setEnvDevnet() {
  cp -f erdpy.data-storage-devnet.json erdpy.data-storage.json
  CURRENT_ENV="devnet"
  PEM_FILE="${PROJECT}/../../wallets/users/devnet_owner_wallet.pem"
  ADDRESS=$(erdpy data load --key=address-devnet)
  PROXY=https://devnet-gateway.elrond.com
  CHAINID=D
  ENV_LOGS="devnet"
  TOKEN_ID="XLH-cb26c7"
  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)

  APPEND_APY_ID="2"
  APPEND_APY_START=$(date -d '2022-06-02 00:00:00' +"%s")
  APPEND_APY_END=$(date -d '2022-06-03 00:00:00' +"%s")
  APPEND_APY_A="50"
  APPEND_APY_B="100"
  APPEND_APY_C="150"
}

printCurrentEnv() {
  echo ${CURRENT_ENV}
}

deploy() {
  erdpy --verbose contract deploy --project=${PROJECT} --recall-nonce --pem=${PEM_FILE} \
    --gas-limit=100000000 --send --outfile="${MY_LOGS}/deploy-${ENV_LOGS}.json" \
    --proxy=${PROXY} --chain=${CHAINID} \
    --arguments "0x${TOKEN_ID_HEX}" ${MIN_AMOUNT} \
    ${PULL_A_ID} ${PULL_A_LOCKING_TIME_SPAN} ${APY_A0_ID} ${APY_A0_START} ${APY_A0_END} ${APY_A0_APY} \
    ${PULL_B_ID} ${PULL_B_LOCKING_TIME_SPAN} ${APY_B0_ID} ${APY_B0_START} ${APY_A0_END} ${APY_B0_APY} \
    ${PULL_C_ID} ${PULL_C_LOCKING_TIME_SPAN} ${APY_C0_ID} ${APY_C0_START} ${APY_C0_END} ${APY_C0_APY} || return

  TRANSACTION=$(erdpy data parse --file="${MY_LOGS}/deploy-${ENV_LOGS}.json" --expression="data['emitted_tx']['hash']")
  ADDRESS=$(erdpy data parse --file="${MY_LOGS}/deploy-${ENV_LOGS}.json" --expression="data['emitted_tx']['address']")

  erdpy data store --key=address-devnet --value=${ADDRESS}
  erdpy data store --key=deployTransaction-devnet --value=${TRANSACTION}

  echo ""
  echo "Smart contract address: ${ADDRESS}"
}

updateContract() {
  erdpy --verbose contract upgrade ${ADDRESS} --project=${PROJECT} --recall-nonce --pem=${PEM_FILE} \
    --gas-limit=100000000 --send --outfile="${MY_LOGS}/update-${ENV_LOGS}.json" \
    --proxy=${PROXY} --chain=${CHAINID} \
    --arguments "0x${TOKEN_ID_HEX}" ${MIN_AMOUNT} \
    ${PULL_A_ID} ${PULL_A_LOCKING_TIME_SPAN} ${APY_A0_ID} ${APY_A0_START} ${APY_A0_END} ${APY_A0_APY} \
    ${PULL_B_ID} ${PULL_B_LOCKING_TIME_SPAN} ${APY_B0_ID} ${APY_B0_START} ${APY_A0_END} ${APY_B0_APY} \
    ${PULL_C_ID} ${PULL_C_LOCKING_TIME_SPAN} ${APY_C0_ID} ${APY_C0_START} ${APY_C0_END} ${APY_C0_APY}
}

fundContract() {
  method_name="0x$(echo -n 'fundContract' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  amount="1${MY_DECIMALS}"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=4000000 \
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

stake() {
  method_name="0x$(echo -n 'stake' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  amount="1${MY_DECIMALS}"
  pull_id="1"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=5000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTTransfer" \
    --arguments $token_id $amount $method_name $pull_id \
    --send \
    --outfile="${MY_LOGS}/stake-${ENV_LOGS}.json"
}

claim() {
  pull_id="1"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="claim" \
    --arguments ${pull_id} \
    --send \
    --outfile="${MY_LOGS}/claim-${ENV_LOGS}.json"
}

unstake() {
  pull_id="1"
  amount="1${MY_DECIMALS}"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="unstake" \
    --arguments ${pull_id} ${amount} \
    --send \
    --outfile="${MY_LOGS}/unstake-${ENV_LOGS}.json"
}

getClientReport() {
  # erdpy wallet bech32 --decode erd1mhhnd3ux2duwc9824dhelherdj3gvzn04erdw29l8cyr5z8fpa7quda68z
  erdpy --verbose contract query ${ADDRESS} --function="getClientReport" \
    --arguments 0xddef36c7865378ec14eaab6f9fdf236ca2860a6fae46d728bf3e083a08e90f7c \
    --proxy=${PROXY}
}

getClientReportV2() {
  # erdpy wallet bech32 --decode erd1mhhnd3ux2duwc9824dhelherdj3gvzn04erdw29l8cyr5z8fpa7quda68z
  erdpy --verbose contract query ${ADDRESS} --function="getClientReportV2" \
    --arguments 0xddef36c7865378ec14eaab6f9fdf236ca2860a6fae46d728bf3e083a08e90f7c \
    --proxy=${PROXY}
}

getClientReportV3() {
  # erdpy wallet bech32 --decode erd1mhhnd3ux2duwc9824dhelherdj3gvzn04erdw29l8cyr5z8fpa7quda68z
  erdpy --verbose contract query ${ADDRESS} --function="getClientReportV3" \
    --arguments 0xddef36c7865378ec14eaab6f9fdf236ca2860a6fae46d728bf3e083a08e90f7c \
    --proxy=${PROXY}
}

getClientState() {
  erdpy --verbose contract query ${ADDRESS} --function="getClientState" \
    --arguments 0xddef36c7865378ec14eaab6f9fdf236ca2860a6fae46d728bf3e083a08e90f7c \
    --proxy=${PROXY}
}

appendPullSettings() {

  # relevant variables
  #    APPEND_APY_ID
  #    APPEND_APY_START
  #    APPEND_APY_END
  #    APPEND_APY_A
  #    APPEND_APY_B
  #    APPEND_APY_C

  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="appendPullSettings" \
    --arguments ${APPEND_APY_ID} ${APPEND_APY_START} ${APPEND_APY_END} ${APPEND_APY_A} ${APPEND_APY_B} ${APPEND_APY_C} \
    --send \
    --outfile="${MY_LOGS}/claim-${ENV_LOGS}.json"
}


updatePullSettings() {

  # relevant variables
  #    APPEND_APY_ID
  #    APPEND_APY_START
  #    APPEND_APY_END
  #    APPEND_APY_A
  #    APPEND_APY_B
  #    APPEND_APY_C

  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="updatePullSettings" \
    --arguments ${APPEND_APY_ID} ${APPEND_APY_START} ${APPEND_APY_END} ${APPEND_APY_A} ${APPEND_APY_B} ${APPEND_APY_C} \
    --send \
    --outfile="${MY_LOGS}/claim-${ENV_LOGS}.json"
}