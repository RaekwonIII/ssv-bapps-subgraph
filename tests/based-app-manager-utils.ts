import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
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
} from "../generated/BasedAppManager/BasedAppManager"

export function createBAppObligationSetEvent(
  strategyId: BigInt,
  bApp: Address,
  token: Address,
  obligationPercentage: BigInt
): BAppObligationSet {
  let bAppObligationSetEvent = changetype<BAppObligationSet>(newMockEvent())

  bAppObligationSetEvent.parameters = new Array()

  bAppObligationSetEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  bAppObligationSetEvent.parameters.push(
    new ethereum.EventParam("bApp", ethereum.Value.fromAddress(bApp))
  )
  bAppObligationSetEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  bAppObligationSetEvent.parameters.push(
    new ethereum.EventParam(
      "obligationPercentage",
      ethereum.Value.fromUnsignedBigInt(obligationPercentage)
    )
  )

  return bAppObligationSetEvent
}

export function createBAppObligationUpdatedEvent(
  strategyId: BigInt,
  bApp: Address,
  token: Address,
  obligationPercentage: BigInt
): BAppObligationUpdated {
  let bAppObligationUpdatedEvent = changetype<BAppObligationUpdated>(
    newMockEvent()
  )

  bAppObligationUpdatedEvent.parameters = new Array()

  bAppObligationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  bAppObligationUpdatedEvent.parameters.push(
    new ethereum.EventParam("bApp", ethereum.Value.fromAddress(bApp))
  )
  bAppObligationUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  bAppObligationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "obligationPercentage",
      ethereum.Value.fromUnsignedBigInt(obligationPercentage)
    )
  )

  return bAppObligationUpdatedEvent
}

export function createBAppOptedInEvent(
  strategyId: BigInt,
  bApp: Address
): BAppOptedIn {
  let bAppOptedInEvent = changetype<BAppOptedIn>(newMockEvent())

  bAppOptedInEvent.parameters = new Array()

  bAppOptedInEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  bAppOptedInEvent.parameters.push(
    new ethereum.EventParam("bApp", ethereum.Value.fromAddress(bApp))
  )

  return bAppOptedInEvent
}

export function createBAppRegisteredEvent(
  bAppAddress: Address,
  owner: Address,
  from: Address
): BAppRegistered {
  let bAppRegisteredEvent = changetype<BAppRegistered>(newMockEvent())

  bAppRegisteredEvent.parameters = new Array()

  bAppRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "bAppAddress",
      ethereum.Value.fromAddress(bAppAddress)
    )
  )
  bAppRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  bAppRegisteredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )

  return bAppRegisteredEvent
}

export function createBAppTokensUpdatedEvent(
  bAppAddress: Address,
  tokens: Array<Address>
): BAppTokensUpdated {
  let bAppTokensUpdatedEvent = changetype<BAppTokensUpdated>(newMockEvent())

  bAppTokensUpdatedEvent.parameters = new Array()

  bAppTokensUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "bAppAddress",
      ethereum.Value.fromAddress(bAppAddress)
    )
  )
  bAppTokensUpdatedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )

  return bAppTokensUpdatedEvent
}

export function createDelegatedBalanceEvent(
  delegator: Address,
  receiver: Address,
  percentage: BigInt
): DelegatedBalance {
  let delegatedBalanceEvent = changetype<DelegatedBalance>(newMockEvent())

  delegatedBalanceEvent.parameters = new Array()

  delegatedBalanceEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  delegatedBalanceEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  delegatedBalanceEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )

  return delegatedBalanceEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createMaxFeeIncrementSetEvent(
  newMaxFeeIncrement: BigInt
): MaxFeeIncrementSet {
  let maxFeeIncrementSetEvent = changetype<MaxFeeIncrementSet>(newMockEvent())

  maxFeeIncrementSetEvent.parameters = new Array()

  maxFeeIncrementSetEvent.parameters.push(
    new ethereum.EventParam(
      "newMaxFeeIncrement",
      ethereum.Value.fromUnsignedBigInt(newMaxFeeIncrement)
    )
  )

  return maxFeeIncrementSetEvent
}

export function createObligationUpdateFinalizedEvent(
  strategyId: BigInt,
  account: Address,
  token: Address,
  percentage: BigInt
): ObligationUpdateFinalized {
  let obligationUpdateFinalizedEvent = changetype<ObligationUpdateFinalized>(
    newMockEvent()
  )

  obligationUpdateFinalizedEvent.parameters = new Array()

  obligationUpdateFinalizedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  obligationUpdateFinalizedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  obligationUpdateFinalizedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  obligationUpdateFinalizedEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )

  return obligationUpdateFinalizedEvent
}

export function createObligationUpdateProposedEvent(
  strategyId: BigInt,
  account: Address,
  token: Address,
  percentage: BigInt,
  finalizeTime: BigInt
): ObligationUpdateProposed {
  let obligationUpdateProposedEvent = changetype<ObligationUpdateProposed>(
    newMockEvent()
  )

  obligationUpdateProposedEvent.parameters = new Array()

  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )
  obligationUpdateProposedEvent.parameters.push(
    new ethereum.EventParam(
      "finalizeTime",
      ethereum.Value.fromUnsignedBigInt(finalizeTime)
    )
  )

  return obligationUpdateProposedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRemoveDelegatedBalanceEvent(
  delegator: Address,
  receiver: Address
): RemoveDelegatedBalance {
  let removeDelegatedBalanceEvent = changetype<RemoveDelegatedBalance>(
    newMockEvent()
  )

  removeDelegatedBalanceEvent.parameters = new Array()

  removeDelegatedBalanceEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  removeDelegatedBalanceEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )

  return removeDelegatedBalanceEvent
}

export function createStrategyCreatedEvent(
  strategyId: BigInt,
  owner: Address
): StrategyCreated {
  let strategyCreatedEvent = changetype<StrategyCreated>(newMockEvent())

  strategyCreatedEvent.parameters = new Array()

  strategyCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return strategyCreatedEvent
}

export function createStrategyDepositEvent(
  strategyId: BigInt,
  contributor: Address,
  token: Address,
  amount: BigInt
): StrategyDeposit {
  let strategyDepositEvent = changetype<StrategyDeposit>(newMockEvent())

  strategyDepositEvent.parameters = new Array()

  strategyDepositEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyDepositEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor)
    )
  )
  strategyDepositEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  strategyDepositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return strategyDepositEvent
}

export function createStrategyFeeUpdateRequestedEvent(
  strategyId: BigInt,
  owner: Address,
  proposedFee: BigInt,
  fee: BigInt,
  expirationTime: BigInt
): StrategyFeeUpdateRequested {
  let strategyFeeUpdateRequestedEvent = changetype<StrategyFeeUpdateRequested>(
    newMockEvent()
  )

  strategyFeeUpdateRequestedEvent.parameters = new Array()

  strategyFeeUpdateRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyFeeUpdateRequestedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  strategyFeeUpdateRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "proposedFee",
      ethereum.Value.fromUnsignedBigInt(proposedFee)
    )
  )
  strategyFeeUpdateRequestedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )
  strategyFeeUpdateRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "expirationTime",
      ethereum.Value.fromUnsignedBigInt(expirationTime)
    )
  )

  return strategyFeeUpdateRequestedEvent
}

export function createStrategyFeeUpdatedEvent(
  strategyId: BigInt,
  owner: Address,
  fee: BigInt,
  oldFee: BigInt
): StrategyFeeUpdated {
  let strategyFeeUpdatedEvent = changetype<StrategyFeeUpdated>(newMockEvent())

  strategyFeeUpdatedEvent.parameters = new Array()

  strategyFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  strategyFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )
  strategyFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldFee", ethereum.Value.fromUnsignedBigInt(oldFee))
  )

  return strategyFeeUpdatedEvent
}

export function createStrategyWithdrawalEvent(
  strategyId: BigInt,
  contributor: Address,
  token: Address,
  amount: BigInt
): StrategyWithdrawal {
  let strategyWithdrawalEvent = changetype<StrategyWithdrawal>(newMockEvent())

  strategyWithdrawalEvent.parameters = new Array()

  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "contributor",
      ethereum.Value.fromAddress(contributor)
    )
  )
  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  strategyWithdrawalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return strategyWithdrawalEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}

export function createWithdrawalETHFinalizedEvent(
  strategyId: BigInt,
  account: Address,
  amount: BigInt
): WithdrawalETHFinalized {
  let withdrawalEthFinalizedEvent = changetype<WithdrawalETHFinalized>(
    newMockEvent()
  )

  withdrawalEthFinalizedEvent.parameters = new Array()

  withdrawalEthFinalizedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  withdrawalEthFinalizedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  withdrawalEthFinalizedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawalEthFinalizedEvent
}

export function createWithdrawalETHProposedEvent(
  strategyId: BigInt,
  account: Address,
  amount: BigInt,
  finalizeTime: BigInt
): WithdrawalETHProposed {
  let withdrawalEthProposedEvent = changetype<WithdrawalETHProposed>(
    newMockEvent()
  )

  withdrawalEthProposedEvent.parameters = new Array()

  withdrawalEthProposedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  withdrawalEthProposedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  withdrawalEthProposedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawalEthProposedEvent.parameters.push(
    new ethereum.EventParam(
      "finalizeTime",
      ethereum.Value.fromUnsignedBigInt(finalizeTime)
    )
  )

  return withdrawalEthProposedEvent
}

export function createWithdrawalFinalizedEvent(
  strategyId: BigInt,
  account: Address,
  token: Address,
  amount: BigInt
): WithdrawalFinalized {
  let withdrawalFinalizedEvent = changetype<WithdrawalFinalized>(newMockEvent())

  withdrawalFinalizedEvent.parameters = new Array()

  withdrawalFinalizedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  withdrawalFinalizedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  withdrawalFinalizedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  withdrawalFinalizedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawalFinalizedEvent
}

export function createWithdrawalProposedEvent(
  strategyId: BigInt,
  account: Address,
  token: Address,
  amount: BigInt,
  finalizeTime: BigInt
): WithdrawalProposed {
  let withdrawalProposedEvent = changetype<WithdrawalProposed>(newMockEvent())

  withdrawalProposedEvent.parameters = new Array()

  withdrawalProposedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyId",
      ethereum.Value.fromUnsignedBigInt(strategyId)
    )
  )
  withdrawalProposedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  withdrawalProposedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  withdrawalProposedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawalProposedEvent.parameters.push(
    new ethereum.EventParam(
      "finalizeTime",
      ethereum.Value.fromUnsignedBigInt(finalizeTime)
    )
  )

  return withdrawalProposedEvent
}
