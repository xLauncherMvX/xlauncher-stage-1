# X Laucher staking contract

## the flow

### stake funds

The clinet uses the `stake` endpoint in order to add funds to the contrat. He can chuse the pull id. Each pull as a
different funds lock time and apy. The longer the funds are being locked the higher the apy sould be. We plan to have 3
pulls.
The contract settings for each pull is explained in the [variableContractSettings section](#variableContractSettings)
Once the client adds some funds a new instance of `ClientPullState` struct is being created and added to the persisted
vector mapped to the client address [clientState](#clientState)

### claim funds

When client claims the rewords it uses the `claim` endpoint. The contract interates over the list of `ClientPullState`
from the `clientState` storage vector and for each `ClientPullState` that matchess the specific claim pull id, performs
the following actions.

- computes the rewords using `calculate_rewards_v2` function
- addes the item computed rewords to the `total_rewards`
- updates for selected `ClientPullState` items the  `pull_time_stamp_last_collection` field with
  the `current_time_stamp`
- sends using `self.send().direct` the `total_rewards` to the current `client` address

### reinvest funds

For reinvest the contract perform the same actions as `claim` in order to caclulate the amount that will be reinvested
but instead of sendin the funds to the client wallet it will

- create a new instace of `ClientPullState` item and added to the storage vector `clientState`
- update the contract `totalStakedValue`

### unstake funds

For the unstake funds contract iterates over `ClientPullState` items and for each of them compues the rewords and
removed it from the staked lilst.
We keep track of 2 values:

- `total_items_value`: is the value that is stored in each `ClientPullState` item
- `total_value`: is the total_items_value + rewords

If total_items_value == amount we just move the total_value in the client `unstakeState` where the funds are locke for
some number of days without rewords

If amount < total_items_value we move the selected ammount to `unstakeState`, compute the difference left and create a
new ClientPullState and addit to the clientState wit the folowig field values

- pull_id = selected id
- pull_amount = diff
- pull_time_stamp_entry = last_item.pull_time_stamp_entry
- pull_time_stamp_last_collection = current_time_stamp

### claimUnstakedValue

When we `claimUnstakedValue` we check the value stored in `unstakeState` and if the `current_time_stamp` is bigger
then `free_after_time_stamp`

- send the `total_unstaked_amount` that includes also the computed rewords to the client wallet
- deduct from the contract `totalStakedValue` the `requested_amount`

## admin ednpoitns

The are the endpoints exposed only to the contract owner necesery for servicing and maintain the contract

- `switchIsActiveFieldValue`
- `updateUnstakeLockSpan`
- `updatePullSettings`
- `appendPullSettings`

## persisted models

The contract has the following storage mapper macro's

### variableContractSettings

It keeps track of the contract settings and contains the foloowing fields

- `token_id: TokenIdentifier`: The token id
- `min_amount: BigUint`: Not used for now but will be used in the future to limit the minimum amount of staked value or
  reinvested rewords
- `unstake_lock_span: u64`: From the mement unstakes some funds these funds are moved `clientState` storage where the
  funcs receive rewords into `unstakeState` where they do not received rewords and get loked for a specific time span
- `contract_is_active: bool`: Boolean switch used to set the contract in maintenance mode when needed
- `pull_items: ManagedVec<M, Pull<M>>`: nested Managed Vector with the following fields

#### Pull

Nested Managed Vector inside `variableContractSettings` with the following fields

- `id: u32`: This is the pull id. Its values are initialized at deploy time and can have the following values: 1, 2, 3,
- `locking_time_span: u64`: Once certin funds are locked into a specific pull you start receiven rewords but you also
  can not unstake them for the specified time_span.
- `apy_configuration: ManagedVec<M, ApyConfiguration>` Nested manage vector that allows to modify over time the acual
  APY received at any specific point in time.

##### ApyConfiguration

Nested managed vector inside `Pull` struct with the following fieds

- `id: u32`: Just id. The first one is initialized at deploy time and the contract has endpoint to apped new ones to
  the `apy_configuration` vector if needed
- `apy`: This value is the py value multiplied by 100: ex: 1% = 100, 0.5& = 50, 0.01% = 1
- `start_timestamp: u64` start time timestamp
- `end_timestamp: u64` end time timestamp

### clientState

This is `VecMapper<ClientPullState<Self::Api>>` vector where we keep trac of all the funds of any specific client that
are receiving rewords with the fillowing fieds

- `pull_id: u32,` The id of the pull. This field will be used to identify what pull settings will be used to calculate
  the rewords
- `pull_time_stamp_entry: u64`
- `pull_time_stamp_last_collection: u64`
- `pull_amount: BigUint`

### unstakeState

This is  `SingleValueMapper<UnstakeState<Self::Api>>` vector is where the funds are moved once they are unstaked. Once
the funds are here they are loked with zero rewords for a specific ammount of time. When the client specifies a specifi
ammount of value to be unstaked we also compute the rewords from a set `ClientPullState` items and add the rewords also
to the unstake funds. This is why wee need to keep track of 2 value fieds `requested_amount` and `total_unstaked_amount`

- `total_unstaked_amount: BigUint`
- `requested_amount: BigUint`
- `free_after_time_stamp: u64`

### clientList

`VecMapper<ManagedAddress>` vector that keeps track of all the clients that are staking funds in this contract.

### totalStakedValue

`SingleValueMapper<BigUint>` that is being updated everytime funds are being added for staking or removed from staking. 





