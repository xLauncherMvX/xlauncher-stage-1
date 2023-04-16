PROJECT="${PWD}"
DEPLOY_TRANSACTION=$(mxpy data load --key=deployTransaction-devnet)
CORE_LOGS="interaction-logs"
setEnvDevnet(){
  CURRENT_ENV="devnet"
  cp -f mxpy.data-storage-devnet.json mxpy.data-storage.json
  PEM_FILE="${PROJECT}/../../wallets/users/devnet_owner_wallet.pem"
  ADDRESS=$(mxpy data load --key=address-devnet)
  PROXY=https://devnet-gateway.multiversx.com
  CHAINID=D
  TOKEN_ID="XLH-4a7cc0"
  TOKEN_ID_HEX=$(echo -n ${TOKEN_ID} | xxd -p)
  SFT_ID="SFT-8ff335"
  SFT_ID_HEX=$(echo -n ${SFT_ID} | xxd -p)
  ENV_LOGS="${CORE_LOGS}/${CURRENT_ENV}"
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

setSettings(){

}

