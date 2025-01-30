import {
  BAppMetadataURIUpdated as BAppMetadataURIUpdatedEvent,
  BAppOptedInByStrategy as BAppOptedInByStrategyEvent,
  BAppRegistered as BAppRegisteredEvent,
  BAppTokensCreated as BAppTokensCreatedEvent,
  BAppTokensUpdated as BAppTokensUpdatedEvent,
  DelegationCreated as DelegationCreatedEvent,
  DelegationRemoved as DelegationRemovedEvent,
  DelegationUpdated as DelegationUpdatedEvent,
  Initialized as InitializedEvent,
  MaxFeeIncrementSet as MaxFeeIncrementSetEvent,
  ObligationCreated as ObligationCreatedEvent,
  ObligationUpdateProposed as ObligationUpdateProposedEvent,
  ObligationUpdated as ObligationUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  StrategyCreated as StrategyCreatedEvent,
  StrategyDeposit as StrategyDepositEvent,
  StrategyFeeUpdateProposed as StrategyFeeUpdateProposedEvent,
  StrategyFeeUpdated as StrategyFeeUpdatedEvent,
  StrategyWithdrawal as StrategyWithdrawalEvent,
  StrategyWithdrawalProposed as StrategyWithdrawalProposedEvent,
  Upgraded as UpgradedEvent
} from "../generated/BasedAppManager/BasedAppManager"
import {
  BAppMetadataURIUpdated,
  BAppOptedInByStrategy,
  BAppRegistered,
  BAppTokensCreated,
  BAppTokensUpdated,
  DelegationCreated,
  DelegationRemoved,
  DelegationUpdated,
  Initialized,
  MaxFeeIncrementSet,
  ObligationCreated,
  ObligationUpdateProposed,
  ObligationUpdated,
  OwnershipTransferred,
  StrategyCreated,
  StrategyDeposit,
  StrategyFeeUpdateProposed,
  StrategyFeeUpdated,
  StrategyWithdrawal,
  StrategyWithdrawalProposed,
  Upgraded
} from "../generated/schema"

export function handleBAppMetadataURIUpdated(
  event: BAppMetadataURIUpdatedEvent
): void {
  let entity = new BAppMetadataURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bAppAddress = event.params.bAppAddress
  entity.metadataURI = event.params.metadataURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBAppOptedInByStrategy(
  event: BAppOptedInByStrategyEvent
): void {
  let entity = new BAppOptedInByStrategy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.bApp = event.params.bApp
  entity.data = event.params.data
  entity.tokens = event.params.tokens
  entity.obligationPercentages = event.params.obligationPercentages

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
  entity.tokens = event.params.tokens
  entity.sharedRiskLevel = event.params.sharedRiskLevel
  entity.metadataURI = event.params.metadataURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBAppTokensCreated(event: BAppTokensCreatedEvent): void {
  let entity = new BAppTokensCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bAppAddress = event.params.bAppAddress
  entity.tokens = event.params.tokens
  entity.sharedRiskLevels = event.params.sharedRiskLevels

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
  entity.sharedRiskLevels = event.params.sharedRiskLevels

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegationCreated(event: DelegationCreatedEvent): void {
  let entity = new DelegationCreated(
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

export function handleDelegationRemoved(event: DelegationRemovedEvent): void {
  let entity = new DelegationRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.delegator = event.params.delegator
  entity.receiver = event.params.receiver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegationUpdated(event: DelegationUpdatedEvent): void {
  let entity = new DelegationUpdated(
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

export function handleObligationCreated(event: ObligationCreatedEvent): void {
  let entity = new ObligationCreated(
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

export function handleObligationUpdated(event: ObligationUpdatedEvent): void {
  let entity = new ObligationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.bApp = event.params.bApp
  entity.token = event.params.token
  entity.obligationPercentage = event.params.obligationPercentage
  entity.isFast = event.params.isFast

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

export function handleStrategyCreated(event: StrategyCreatedEvent): void {
  let entity = new StrategyCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.strategyId = event.params.strategyId
  entity.owner = event.params.owner
  entity.fee = event.params.fee

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

export function handleStrategyFeeUpdateProposed(
  event: StrategyFeeUpdateProposedEvent
): void {
  let entity = new StrategyFeeUpdateProposed(
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
  entity.isFast = event.params.isFast

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStrategyWithdrawalProposed(
  event: StrategyWithdrawalProposedEvent
): void {
  let entity = new StrategyWithdrawalProposed(
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
