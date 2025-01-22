import {
  BAppObligationSet as BAppObligationSetEvent,
  BAppObligationUpdated as BAppObligationUpdatedEvent,
  BAppOptedIn as BAppOptedInEvent,
  BAppRegistered as BAppRegisteredEvent,
  BAppTokensUpdated as BAppTokensUpdatedEvent,
  DelegatedBalance as DelegatedBalanceEvent,
  Initialized as InitializedEvent,
  MaxFeeIncrementSet as MaxFeeIncrementSetEvent,
  ObligationUpdateFinalized as ObligationUpdateFinalizedEvent,
  ObligationUpdateProposed as ObligationUpdateProposedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RemoveDelegatedBalance as RemoveDelegatedBalanceEvent,
  StrategyCreated as StrategyCreatedEvent,
  StrategyDeposit as StrategyDepositEvent,
  StrategyFeeUpdateRequested as StrategyFeeUpdateRequestedEvent,
  StrategyFeeUpdated as StrategyFeeUpdatedEvent,
  StrategyWithdrawal as StrategyWithdrawalEvent,
  Upgraded as UpgradedEvent,
  WithdrawalETHFinalized as WithdrawalETHFinalizedEvent,
  WithdrawalETHProposed as WithdrawalETHProposedEvent,
  WithdrawalFinalized as WithdrawalFinalizedEvent,
  WithdrawalProposed as WithdrawalProposedEvent
} from "../generated/BasedAppManager/BasedAppManager"
import {
  BAppObligationSet,
  BAppObligationUpdated,
  BAppOptedIn,
  BAppRegistered,
  BAppTokensUpdated,
  DelegatedBalance,
  Initialized,
  MaxFeeIncrementSet,
  ObligationUpdateFinalized,
  ObligationUpdateProposed,
  OwnershipTransferred,
  RemoveDelegatedBalance,
  StrategyCreated,
  StrategyDeposit,
  StrategyFeeUpdateRequested,
  StrategyFeeUpdated,
  StrategyWithdrawal,
  Upgraded,
  WithdrawalETHFinalized,
  WithdrawalETHProposed,
  WithdrawalFinalized,
  WithdrawalProposed
} from "../generated/schema"

export function handleBAppObligationSet(event: BAppObligationSetEvent): void {
  let entity = new BAppObligationSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.bApp = event.params.bApp
  entity.token = event.params.token
  entity.obligationPercentage = event.params.obligationPercentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBAppObligationUpdated(
  event: BAppObligationUpdatedEvent
): void {
  let entity = new BAppObligationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.bApp = event.params.bApp
  entity.token = event.params.token
  entity.obligationPercentage = event.params.obligationPercentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBAppOptedIn(event: BAppOptedInEvent): void {
  let entity = new BAppOptedIn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.bApp = event.params.bApp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBAppRegistered(event: BAppRegisteredEvent): void {
  let entity = new BAppRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bAppAddress = event.params.bAppAddress
  entity.owner = event.params.owner
  entity.from = event.params.from

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBAppTokensUpdated(event: BAppTokensUpdatedEvent): void {
  let entity = new BAppTokensUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bAppAddress = event.params.bAppAddress
  entity.tokens = event.params.tokens

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegatedBalance(event: DelegatedBalanceEvent): void {
  let entity = new DelegatedBalance(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.delegator = event.params.delegator
  entity.receiver = event.params.receiver
  entity.percentage = event.params.percentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMaxFeeIncrementSet(event: MaxFeeIncrementSetEvent): void {
  let entity = new MaxFeeIncrementSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newMaxFeeIncrement = event.params.newMaxFeeIncrement

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleObligationUpdateFinalized(
  event: ObligationUpdateFinalizedEvent
): void {
  let entity = new ObligationUpdateFinalized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.account = event.params.account
  entity.token = event.params.token
  entity.percentage = event.params.percentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleObligationUpdateProposed(
  event: ObligationUpdateProposedEvent
): void {
  let entity = new ObligationUpdateProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.account = event.params.account
  entity.token = event.params.token
  entity.percentage = event.params.percentage
  entity.finalizeTime = event.params.finalizeTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoveDelegatedBalance(
  event: RemoveDelegatedBalanceEvent
): void {
  let entity = new RemoveDelegatedBalance(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.delegator = event.params.delegator
  entity.receiver = event.params.receiver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStrategyCreated(event: StrategyCreatedEvent): void {
  let entity = new StrategyCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStrategyDeposit(event: StrategyDepositEvent): void {
  let entity = new StrategyDeposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.contributor = event.params.contributor
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStrategyFeeUpdateRequested(
  event: StrategyFeeUpdateRequestedEvent
): void {
  let entity = new StrategyFeeUpdateRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.owner = event.params.owner
  entity.proposedFee = event.params.proposedFee
  entity.fee = event.params.fee
  entity.expirationTime = event.params.expirationTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStrategyFeeUpdated(event: StrategyFeeUpdatedEvent): void {
  let entity = new StrategyFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.owner = event.params.owner
  entity.fee = event.params.fee
  entity.oldFee = event.params.oldFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStrategyWithdrawal(event: StrategyWithdrawalEvent): void {
  let entity = new StrategyWithdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.contributor = event.params.contributor
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawalETHFinalized(
  event: WithdrawalETHFinalizedEvent
): void {
  let entity = new WithdrawalETHFinalized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.account = event.params.account
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawalETHProposed(
  event: WithdrawalETHProposedEvent
): void {
  let entity = new WithdrawalETHProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.account = event.params.account
  entity.amount = event.params.amount
  entity.finalizeTime = event.params.finalizeTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawalFinalized(
  event: WithdrawalFinalizedEvent
): void {
  let entity = new WithdrawalFinalized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.account = event.params.account
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawalProposed(event: WithdrawalProposedEvent): void {
  let entity = new WithdrawalProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.account = event.params.account
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.finalizeTime = event.params.finalizeTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
