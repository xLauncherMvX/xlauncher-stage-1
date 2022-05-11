PROJECT="${PWD}"
DEPLOY_TRANSACTION=$(erdpy data load --key=deployTransaction-devnet)

MY_DECIMALS="000000000000000000"
MIN_AMOUNT=250000000000000000

MY_LOGS="interaction-logs"

PULL_A_ID=1
PULL_A_LOCKING_TIME_SPAN=0
APY_A0_ID=1
APY_A0_START=`date -d '2022-05-12 00:00:00 7 days' +"%s"`
APY_A0_END=`date -d '2022-06-02 00:00:00 7 days' +"%s"`
APY_A0_APY=100

PULL_B_ID=2
PULL_A_LOCKING_TIME_SPAN=5184000
APY_B0_ID=1
APY_B0_START=`date -d '2022-05-12 00:00:00 7 days' +"%s"`
APY_B0_END=`date -d '2022-06-02 00:00:00 7 days' +"%s"`
APY_B0_APY=200

PULL_C_ID=3
PULL_C_LOCKING_TIME_SPAN=15552000
APY_C0_ID=1
APY_C0_START=`date -d '2022-05-12 00:00:00 7 days' +"%s"`
APY_C0_END=`date -d '2022-06-02 00:00:00 7 days' +"%s"`
APY_C0_APY=300

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
     ${PULL_B_ID} ${PULL_B_LOCKING_TIME_SPAN} ${APY_B0_ID} ${APY_B0_START} ${APY_B0_END} ${APY_B0_APY} \
     ${PULL_C_ID} ${PULL_C_LOCKING_TIME_SPAN} ${APY_C0_ID} ${APY_C0_START} ${APY_C0_END} ${APY_C0_APY} \
     || return

  TRANSACTION=$(erdpy data parse --file="${MY_LOGS}/deploy-${ENV_LOGS}.json" --expression="data['emitted_tx']['hash']")
  ADDRESS=$(erdpy data parse --file="${MY_LOGS}/deploy-${ENV_LOGS}.json" --expression="data['emitted_tx']['address']")

  erdpy data store --key=address-devnet --value=${ADDRESS}
  erdpy data store --key=deployTransaction-devnet --value=${TRANSACTION}

  echo ""
  echo "Smart contract address: ${ADDRESS}"
}
