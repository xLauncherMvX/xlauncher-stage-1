# notes

pool 2: 60 * 60 * 24 * 10 =

# devnet address list of contracts that might have funds

- `erd1qqqqqqqqqqqqqpgq8w8msav2ylahz0sxnfhaf25ww3jk8uzzpa7qk7kd79`
- `erd1qqqqqqqqqqqqqpgqpd3jax5gu9nrq2jnxczc40u9alqrelxppa7qvcxu54`
- `erd1qqqqqqqqqqqqqpgqtxsxsuush8d7lpqmku0g3kkj2nguprswpa7q3zl9y9`
- `erd1qqqqqqqqqqqqqpgq5n5unx6vtg3muqxu5h0pw7ywupkluvd9pa7qvxj7tv`

# 037-investigate-frozen-in-time-report-bug

Just for posterity to keep track of this behaviour on devnet use this brach

- branch: `037-investigate-frozen-in-time-report-bug`
- commit:  no is not the rounding errors: `975269ca784e001c747d6a955da00f7880373fd3

# last set of coments before moving to main net

Sorin Petreasca: There are still a few observations from my side:

- At this moment, there are no limits on staking or investing. Considering the current storage handling method, where we
  have a new ClientPoolState for each stake or reinvest operation, this could scale up pretty unfavourable, with a large
  adoption (where lots of users would just reinvest their rewards each hour. This is an extreme example, given just to
  better understand the implications). Even if you don't want to put a limit on the Claim function, I recommend one for
  stake and reinvest at least. (for example like on MaiarDEX a minimum denominated amount of tokens, or, more simply, a
  preset number of said tokens).
- There is an unfair inconsistency in the claim and unstake functions. When users claim their rewards, they get the
  tokens right at that moment. When they unstake, they get their rewards together with the base amount, after a said
  amount of time. This means the user needs to first claim the rewards and then to unstake what's left. That is why the
  unstake function should put only the base amount in the UnstakeState and should immediately send the rewards to the
  user.
- The point above also helps the decrement_total_staked_value() function, to better account for the staked amounts. At
  this moment, this function takes into consideration the requested_amount, which could be inconsistent, as sometimes it
  may contain rewards, sometimes not. Rewards should not be considered staked amount, as they are immediately accessible
  through the Claim function. As I see it: The rewards are always sent to the user when unstaking (the only case when it
  becomes a staked value is when the user is reinvesting his rewards). Because of that, UnstakeState should only contain
  the total_unstaked_amount value, which refers to the base staked amount. This way, staking/unstaking statistics are
  also more accurate.
- I don't think it is such a high priority, because the code with result with a failed transaction, but I suggest having
  an early check (in calculate_pool_rewards() function) in case there are not enough tokens in the contract when
  claiming or reinvesting, not to go through the entire claim or reinvest functions. This, or having an average
  calculation when there aren't enough tokens, just to be fair among all users, but that would overcomplicate the code.


