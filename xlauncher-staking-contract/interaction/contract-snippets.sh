PROJECT="${PWD}"
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-devnet)

MY_DECIMALS="000000000000000000"
MIN_AMOUNT=250000000000000000

MY_LOGS="interaction-logs"



setEnvDevnet() {
  PULL_A_ID="1"
  PULL_A_LOCKING_TIME_SPAN="0"
  APY_A0_ID="1"
  APY_A0_START=$(date -d '2022-05-12 00:00:01' +"%s")
  APY_A0_END=$(date -d '2022-07-04 00:00:00' +"%s")
  APY_A0_APY="4000"

  PULL_B_ID="2"
  #PULL_B_LOCKING_TIME_SPAN="5184000"
  PULL_B_LOCKING_TIME_SPAN="0"
  APY_B0_ID="1"
  APY_B0_START=$(date -d '2022-05-12 00:00:01' +"%s")
  APY_B0_END=$(date -d '2022-07-04 00:00:00' +"%s")
  APY_B0_APY="11000"

  PULL_C_ID="3"
  #PULL_C_LOCKING_TIME_SPAN="15552000"
  PULL_C_LOCKING_TIME_SPAN="0"
  APY_C0_ID="1"
  APY_C0_START=$(date -d '2022-05-12 00:00:01' +"%s")
  APY_C0_END=$(date -d '2022-07-04 00:00:00' +"%s")
  APY_C0_APY="18000"

  cp -f erdpy.data-storage-devnet.json erdpy.data-storage.json
  CURRENT_ENV="devnet"
  PEM_FILE="${PROJECT}/../../wallets/users/devnet_owner_wallet.pem"
  ADDRESS=$(erdpy data load --key=address-devnet)
  PROXY=https://devnet-gateway.elrond.com
  CHAINID=D
  ENV_LOGS="devnet"
  TOKEN_ID="XLH-cb26c7"
  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)


}


setEnvTestnet() {
  PULL_A_ID="1"
  PULL_A_LOCKING_TIME_SPAN="0"
  APY_A0_ID="1"
  APY_A0_START=$(date -d '2022-05-12 00:00:01' +"%s")
  APY_A0_END=$(date -d '2022-07-04 00:00:00' +"%s")
  APY_A0_APY="4000"

  PULL_B_ID="2"
  #PULL_B_LOCKING_TIME_SPAN="5184000"
  PULL_B_LOCKING_TIME_SPAN="300"
  APY_B0_ID="1"
  APY_B0_START=$(date -d '2022-05-12 00:00:01' +"%s")
  APY_B0_END=$(date -d '2022-07-04 00:00:00' +"%s")
  APY_B0_APY="11000"

  PULL_C_ID="3"
  #PULL_C_LOCKING_TIME_SPAN="15552000"
  PULL_C_LOCKING_TIME_SPAN="600"
  APY_C0_ID="1"
  APY_C0_START=$(date -d '2022-05-12 00:00:01' +"%s")
  APY_C0_END=$(date -d '2022-07-04 00:00:00' +"%s")
  APY_C0_APY="18000"

  cp -f erdpy.data-storage-testnet.json erdpy.data-storage.json
  CURRENT_ENV="testnet"
  PEM_FILE="${PROJECT}/../../wallets/users/testnet_owner_wallet.pem"
  ADDRESS=$(erdpy data load --key=address-devnet)
  PROXY=https://testnet-gateway.elrond.com
  CHAINID=T
  ENV_LOGS="testnet"
  TOKEN_ID="XLH-b7f529"
  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)


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
    --gas-limit=150000000 --send --outfile="${MY_LOGS}/update-${ENV_LOGS}.json" \
    --proxy=${PROXY} --chain=${CHAINID} \
    --arguments "0x${TOKEN_ID_HEX}" ${MIN_AMOUNT} \
    ${PULL_A_ID} ${PULL_A_LOCKING_TIME_SPAN} ${APY_A0_ID} ${APY_A0_START} ${APY_A0_END} ${APY_A0_APY} \
    ${PULL_B_ID} ${PULL_B_LOCKING_TIME_SPAN} ${APY_B0_ID} ${APY_B0_START} ${APY_A0_END} ${APY_B0_APY} \
    ${PULL_C_ID} ${PULL_C_LOCKING_TIME_SPAN} ${APY_C0_ID} ${APY_C0_START} ${APY_C0_END} ${APY_C0_APY}
}

fundContract() {
  method_name="0x$(echo -n 'fundContract' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  amount="100000${MY_DECIMALS}"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=5000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTTransfer" \
    --arguments $token_id $amount $method_name \
    --send \
    --outfile="${MY_LOGS}/fundContract-${ENV_LOGS}.json"
}


updateUnstakeLockSpan(){
  # 60 * 5 = 300 (5 minutes)
  UNSTAKE_LOCK_SPAN="1"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
      --pem=${PEM_FILE} \
      --gas-limit=8000000 \
      --proxy=${PROXY} --chain=${CHAINID} \
      --function="updateUnstakeLockSpan" \
      --arguments ${UNSTAKE_LOCK_SPAN} \
      --send \
      --outfile="${MY_LOGS}/updateUnstakeLockSpan-${ENV_LOGS}.json"
}

getTokenBalance() {
  erdpy --verbose contract query ${ADDRESS} --function="getTokenBalance" \
    --proxy=${PROXY}
}

stake() {
  method_name="0x$(echo -n 'stake' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  amount="1000${MY_DECIMALS}"
  pool_id="3"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTTransfer" \
    --arguments $token_id $amount $method_name $pool_id \
    --send \
    --outfile="${MY_LOGS}/stake-${ENV_LOGS}.json"
}

claim() {
  pool_id="3"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="claim" \
    --arguments ${pool_id} \
    --send \
    --outfile="${MY_LOGS}/claim-${ENV_LOGS}.json"
}

reinvest() {
  pool_id="3"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=100000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="reinvest" \
    --arguments ${pool_id} \
    --send \
    --outfile="${MY_LOGS}/claim-${ENV_LOGS}.json"
}



unstake() {
  pool_id="2"
  amount="1000${MY_DECIMALS}"
  #amount="94000${MY_DECIMALS}"
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="unstake" \
    --arguments ${pool_id} ${amount} \
    --send \
    --outfile="${MY_LOGS}/unstake-${ENV_LOGS}.json"
}

claimUnstakedValue() {
   erdpy --verbose contract call ${ADDRESS} --recall-nonce \
     --pem=${PEM_FILE} \
     --gas-limit=8000000 \
     --proxy=${PROXY} --chain=${CHAINID} \
     --function="claimUnstakedValue" \
     --send \
     --outfile="${MY_LOGS}/claimUnstakedValue-${ENV_LOGS}.json"
 }

getClientReport() {
  # erdpy wallet bech32 --decode erd1mhhnd3ux2duwc9824dhelherdj3gvzn04erdw29l8cyr5z8fpa7quda68z
  timestamp=$(date +%s)
  echo "query timestamp=${timestamp}"
  erdpy --verbose contract query ${ADDRESS} --function="getClientReport" \
    --arguments 0xddef36c7865378ec14eaab6f9fdf236ca2860a6fae46d728bf3e083a08e90f7c \
    --proxy=${PROXY}
}

getClientState() {
  erdpy --verbose contract query ${ADDRESS} --function="getClientState" \
    --arguments 0xddef36c7865378ec14eaab6f9fdf236ca2860a6fae46d728bf3e083a08e90f7c \
    --proxy=${PROXY}
}

getVariableContractSettings() {
  erdpy --verbose contract query ${ADDRESS} --function="getVariableContractSettings" \
    --proxy=${PROXY}
}

updatePeriod1PoolSettings() {

    APPEND_APY_ID="1"
    APPEND_APY_START=$(date -d '2022-05-12 00:00:01' +"%s")
    APPEND_APY_END=$(date -d '2022-07-04 00:00:00' +"%s")
    APPEND_APY_A="4000"
    APPEND_APY_B="11000"
    APPEND_APY_C="18000"

  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="updatePoolSettings" \
    --arguments ${APPEND_APY_ID} ${APPEND_APY_START} ${APPEND_APY_END} ${APPEND_APY_A} ${APPEND_APY_B} ${APPEND_APY_C} \
    --send \
    --outfile="${MY_LOGS}/updatePoolSettings-${ENV_LOGS}.json"
}

appendPeriod2PoolSettings() {

  APPEND_APY_ID="2"
  APPEND_APY_START=$(date -d '2022-07-04 00:00:01' +"%s")
  APPEND_APY_END=$(date -d '2022-07-18 00:00:00' +"%s")
  APPEND_APY_A="3200"
  APPEND_APY_B="9500"
  APPEND_APY_C="16000"

  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=8000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="appendPoolSettings" \
    --arguments ${APPEND_APY_ID} ${APPEND_APY_START} ${APPEND_APY_END} ${APPEND_APY_A} ${APPEND_APY_B} ${APPEND_APY_C} \
    --send \
    --outfile="${MY_LOGS}/appendPoolSettings-${ENV_LOGS}.json"
}

appendPeriod3PoolSettings() {

  APPEND_APY_ID="3"
  APPEND_APY_START=$(date -d '2022-07-18 00:00:01' +"%s")
  APPEND_APY_END=$(date -d '2022-08-08 00:00:00' +"%s")
  APPEND_APY_A="3000"
  APPEND_APY_B="9000"
  APPEND_APY_C="15000"

  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=9000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="appendPoolSettings" \
    --arguments ${APPEND_APY_ID} ${APPEND_APY_START} ${APPEND_APY_END} ${APPEND_APY_A} ${APPEND_APY_B} ${APPEND_APY_C} \
    --send \
    --outfile="${MY_LOGS}/appendPoolSettings-${ENV_LOGS}.json"
}

appendPeriod4PoolSettings() {

  APPEND_APY_ID="4"
  APPEND_APY_START=$(date -d '2022-08-08 00:00:01' +"%s")
  APPEND_APY_END=$(date -d '2022-08-29 00:00:00' +"%s")
  APPEND_APY_A="2500"
  APPEND_APY_B="7500"
  APPEND_APY_C="12500"

  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=10000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="appendPoolSettings" \
    --arguments ${APPEND_APY_ID} ${APPEND_APY_START} ${APPEND_APY_END} ${APPEND_APY_A} ${APPEND_APY_B} ${APPEND_APY_C} \
    --send \
    --outfile="${MY_LOGS}/appendPoolSettings-${ENV_LOGS}.json"
}

appendPeriod5PoolSettings() {

  APPEND_APY_ID="5"
  APPEND_APY_START=$(date -d '2022-08-29 00:00:01' +"%s")
  APPEND_APY_END=$(date -d '2023-05-12 00:00:00' +"%s")
  APPEND_APY_A="2500"
  APPEND_APY_B="7500"
  APPEND_APY_C="12500"

  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=11000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="appendPoolSettings" \
    --arguments ${APPEND_APY_ID} ${APPEND_APY_START} ${APPEND_APY_END} ${APPEND_APY_A} ${APPEND_APY_B} ${APPEND_APY_C} \
    --send \
    --outfile="${MY_LOGS}/appendPoolSettings-${ENV_LOGS}.json"
}





switchIsActiveFieldValue(){
  erdpy --verbose contract call ${ADDRESS} --recall-nonce \
      --pem=${PEM_FILE} \
      --gas-limit=8000000 \
      --proxy=${PROXY} --chain=${CHAINID} \
      --function="switchIsActiveFieldValue" \
      --send \
      --outfile="${MY_LOGS}/switchIsActiveFieldValue-${ENV_LOGS}.json"
}


getApiConfigReport1(){
  erdpy --verbose contract query ${ADDRESS} --function="getApiConfigReport1" \
      --arguments 1 \
      --proxy=${PROXY}
}