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

RANK_1_PRICE="300000${MY_DECIMALS}"
RANK_2_PRICE="200000${MY_DECIMALS}"
RANK_3_PRICE="100000${MY_DECIMALS}"

setEnvDevnet() {
  CURRENT_ENV="devnet"
  ENV_LOGS="${CORE_LOGS}/${CURRENT_ENV}"

  cp -f mxpy.data-storage-devnet.json mxpy.data-storage.json
  PEM_FILE="${PROJECT}/../../wallets/users/devnet_owner_wallet.pem"
  ADDRESS=$(mxpy data load --key=address-devnet)
  MAIN_XLH_ADDRESS="erd1mhhnd3ux2duwc9824dhelherdj3gvzn04erdw29l8cyr5z8fpa7quda68z"
  PROXY=https://devnet-gateway.multiversx.com
  CHAINID=D

  TOKEN_ID="XLH-4a7cc0"
  SFT_ID="SFT-8ff335"

  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)
  SFT_ID_HEX=$(echo -n ${SFT_ID} | xxd -p)
}

setEnvTestnet() {
  CURRENT_ENV="testnet"
  ENV_LOGS="${CORE_LOGS}/${CURRENT_ENV}"

  cp -f mxpy.data-storage-testnet.json mxpy.data-storage.json
  PEM_FILE="${PROJECT}/../../wallets/users/testnet_owner_wallet.pem"
  ADDRESS=$(mxpy data load --key=address-devnet)
  PROXY=https://testnet-gateway.multiversx.com
  CHAINID=T

  TOKEN_ID="XLH-869748"
  SFT_ID="XLHSTAKING-dfb81e"

  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)
  SFT_ID_HEX=$(echo -n ${SFT_ID} | xxd -p)
}

setEnvMainnet() {
  CURRENT_ENV="mainnet"
  ENV_LOGS="${CORE_LOGS}/${CURRENT_ENV}"

  cp -f mxpy.data-storage-mainnet.json mxpy.data-storage.json
  PEM_FILE="${PROJECT}/../../wallets/users/mainnet_owner_wallet.pem"
  ADDRESS=$(mxpy data load --key=address-devnet)
  MAIN_XLH_ADDRESS="erd1xa39h8q20gy25449vw2qt4dm38pp3nnxp7kzga2pt54z4u2rgjlqadlgdl"
  PROXY=https://api.multiversx.com
  CHAINID=1

  TOKEN_ID="XLH-8daa50"
  SFT_ID="XLHB-4989e2"

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

  #  amount="3000000${MY_DECIMALS}"
  #  rank_id="1"
  #  pool_title="0x$(echo -n 'BogdanPool' | xxd -p -u | tr -d '\n')"

  #  amount="2000000${MY_DECIMALS}"
  #  rank_id="2"
  #  pool_title="0x$(echo -n 'IonutPool' | xxd -p -u | tr -d '\n')"

  amount="3000000${MY_DECIMALS}"
  rank_id="1"
  pool_title="0x$(echo -n 'Alex is the best moderator' | xxd -p -u | tr -d '\n')"

  MY_LOGS="${ENV_LOGS}-createNewPool.json"
  mxpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=10000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTTransfer" \
    --arguments $token_id $amount $method_name $rank_id $pool_title \
    --send \
    --outfile="${MY_LOGS}"
}

fundWithRewords() {
  MY_LOGS="${ENV_LOGS}-fundWithRewords.json"
  method_name="0x$(echo -n 'fundWithRewords' | xxd -p -u | tr -d '\n')"
  token_id="0x$(echo -n ${TOKEN_ID} | xxd -p -u | tr -d '\n')"
  #amount="2000000${MY_DECIMALS}"
  #amount="5000000${MY_DECIMALS}"
  amount="3500000${MY_DECIMALS}"
  mxpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=5000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTTransfer" \
    --arguments $token_id $amount $method_name \
    --send \
    --outfile="${MY_LOGS}"
}

stakeSft() {
  MY_LOGS="${ENV_LOGS}-stakeSft.json"
  user_address="$(mxpy wallet pem-address $PEM_FILE)"
  method_name=str:stakeSft
  token_id="0x$(echo -n ${SFT_ID} | xxd -p -u | tr -d '\n')"
  token_nonce=1
  amount=1
  mxpy --verbose contract call $user_address --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=10000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="ESDTNFTTransfer" \
    --arguments $token_id $token_nonce $amount $ADDRESS $method_name \
    --send \
    --outfile="${MY_LOGS}"
}

getAllClientsReport() {
  mxpy --verbose contract query ${ADDRESS} --function="getAllClientsReport" \
   --proxy=${PROXY}
}

setMainXlhAddress(){
  MY_LOGS="${ENV_LOGS}-setMainXlhAddress.json"
  mxpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=10000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="setMainXlhAddress" \
    --arguments ${MAIN_XLH_ADDRESS} \
    --send \
    --outfile="${MY_LOGS}"
}

collectCreationFunds(){
  MY_LOGS="${ENV_LOGS}-collectCreationFunds.json"
  mxpy --verbose contract call ${ADDRESS} --recall-nonce \
    --pem=${PEM_FILE} \
    --gas-limit=90000000 \
    --proxy=${PROXY} --chain=${CHAINID} \
    --function="collectCreationFunds" \
    --send \
    --outfile="${MY_LOGS}"
}