import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  BAppMetadataURIUpdated as BAppMetadataURIUpdatedEvent,
  BAppOptedInByStrategy as BAppOptedInByStrategyEvent,
  BAppRegistered as BAppRegisteredEvent,
  BAppTokensCreated as BAppTokensCreatedEvent,
  BAppTokensUpdated as BAppTokensUpdatedEvent,
  DelegationCreated as DelegationCreatedEvent,
  DelegationRemoved as DelegationRemovedEvent,
  DelegationUpdated as DelegationUpdatedEvent,
  InitializeCall,
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
  Upgraded as UpgradedEvent,
} from "../generated/BasedAppManager/BasedAppManager";
import {
  Account,
  BApp,
  BAppConstants,
  BAppMetadataURIUpdated,
  BAppOptedInByStrategy,
  BAppRegistered,
  BAppTokensCreated,
  BAppTokensUpdated,
  Delegation,
  DelegationCreated,
  DelegationRemoved,
  DelegationUpdated,
  Initialized,
  MaxFeeIncrementSet,
  Obligation,
  ObligationCreated,
  ObligationUpdateProposed,
  ObligationUpdated,
  OwnershipTransferred,
  SharedRiskLevel,
  Strategy,
  StrategyBAppOptIn,
  StrategyCreated,
  StrategyDeposit,
  StrategyFeeUpdateProposed,
  StrategyFeeUpdated,
  StrategyTokenBalance,
  StrategyWithdrawal,
  StrategyWithdrawalProposed,
  Upgraded,
} from "../generated/schema";

export function handleInitialize(
  call: InitializeCall
): void {
  let implementationContract = call.from
  if (!implementationContract.toHexString().toLowerCase().includes("0x9B3345F3B1Ce2d8655FC4B6e2ed39322d52aA317") && !implementationContract.toHexString().toLowerCase().includes("0x9B3345F3B1Ce2d8655FC4B6e2ed39322d52aA317"))
  {
    log.error(`Caller is ${implementationContract.toHexString()}, but we only expect 0x9B3345F3B1Ce2d8655FC4B6e2ed39322d52aA317`,[])
    return
  }

  log.info(`New contract Initialized, DAO values store with ID ${implementationContract.toHexString()} does not exist on the database, creating it. Update type: INITIALIZATION`, [])
  let bAppConstants = new BAppConstants(implementationContract)
  bAppConstants._maxFeeIncrement = call.inputs._maxFeeIncrement

  bAppConstants.save()
}

export function handleBAppMetadataURIUpdated(
  event: BAppMetadataURIUpdatedEvent
): void {
  let entity = new BAppMetadataURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.bAppAddress = event.params.bAppAddress;
  entity.metadataURI = event.params.metadataURI;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let bApp = BApp.load(event.params.bAppAddress);
  if (!bApp) {
    log.error(
      `New BApp Event, BApp address ${event.params.bAppAddress.toHexString()} does not exist on the database, and it can't be created`,
      []
    );
  } else {
    bApp.metadataURI = event.params.metadataURI;
    bApp.save();
  }
}

export function handleBAppOptedInByStrategy(
  event: BAppOptedInByStrategyEvent
): void {
  let entity = new BAppOptedInByStrategy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.bApp = event.params.bApp;
  entity.data = event.params.data;
  entity.tokens = changetype<Bytes[]>(event.params.tokens);
  entity.obligationPercentages = event.params.obligationPercentages;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Generating the many-to-many entity that serves as the mapping table
  let strategyBAppOptInId = event.params.strategyId
    .toString()
    .concat(event.params.bApp.toHexString());
  let strategyBAppOptIn = StrategyBAppOptIn.load(strategyBAppOptInId);
  if (!strategyBAppOptIn) {
    strategyBAppOptIn = new StrategyBAppOptIn(strategyBAppOptInId);
    log.info(
      `New StrategyBAppOptIn created ${strategyBAppOptInId} as Strategy ${
        event.params.strategyId
      } has opted in to BApp ${event.params.bApp.toHexString()}`,
      []
    );
  }
  // Generating the list of obligation IDs (the actual objects are created via separate event)
  let obligationsList: string[] = [];
  for (var i = 0; i < event.params.tokens.length; i++) {
    let token = event.params.tokens[i];
    // let percentage = event.params.obligationPercentages[i];
    let obligationId = strategyBAppOptInId.concat(token.toHexString());
    // let obligation = Obligation.load(obligationId);
    // if (!obligation) {
    //   log.info(
    //     `New Obligation created ${obligationId} as Strategy ${
    //       event.params.strategyId
    //     } has opted in to BApp ${event.params.bApp.toHexString()}`,
    //     []
    //   );
    //   obligation = new Obligation(obligationId);
    //   obligation.token = token;
    //   obligation.percentage = percentage;
    //   obligation.save();
    // }
    obligationsList.push(obligationId);
  }
  // Setting the list of obligations in the Strategy <=> BApp mapping table (the StrategyBAppOptIn <> Obligations relation is not derived from a field)
  strategyBAppOptIn.bApp = event.params.bApp;
  strategyBAppOptIn.strategy = event.params.strategyId.toString();
  strategyBAppOptIn.obligations = obligationsList;
  strategyBAppOptIn.save();
}

export function handleBAppRegistered(event: BAppRegisteredEvent): void {
  let entity = new BAppRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.bAppAddress = event.params.bAppAddress;
  entity.owner = event.params.owner;
  entity.tokens = changetype<Bytes[]>(event.params.tokens);
  entity.sharedRiskLevel = event.params.sharedRiskLevel;
  entity.metadataURI = event.params.metadataURI;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    log.info(
      `Trying to create new BApp but owner account ${event.params.owner.toHexString()} does not exist, creating it`,
      []
    );
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.totalDelegatedPercentage = BigInt.zero();
  }
  owner.save();

  let bApp = BApp.load(event.params.bAppAddress);
  if (!bApp) {
    bApp = new BApp(event.params.bAppAddress);
    log.info(
      `New BApp Event, BApp address ${event.params.bAppAddress.toHexString()} does not exist on the database, creating a new entity`,
      []
    );
  }

  bApp.metadataURI = event.params.metadataURI;
  bApp.owner = event.params.owner;
  for (var i = 0; i < event.params.tokens.length; i++) {
    let token = event.params.tokens[i];
    let sharedRiskLevelValue = event.params.sharedRiskLevel[i];
    let sharedRiskLevelId = bApp.id.toHexString().concat(token.toHexString());
    let sharedRiskLevel = SharedRiskLevel.load(sharedRiskLevelId);
    if (!sharedRiskLevel) {
      log.info(
        `New SharedRiskLevel created ${sharedRiskLevelId} as BApp ${event.params.bAppAddress.toHexString()} is created, and supports token ${token.toHexString()}`,
        []
      );
      sharedRiskLevel = new SharedRiskLevel(sharedRiskLevelId);
      sharedRiskLevel.token = token;
      sharedRiskLevel.sharedRiskLevel = sharedRiskLevelValue;
      sharedRiskLevel.bApp = bApp.id;
      sharedRiskLevel.save();
    }
  }
  bApp.save();
}

export function handleBAppTokensCreated(event: BAppTokensCreatedEvent): void {
  let entity = new BAppTokensCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.bAppAddress = event.params.bAppAddress;
  entity.tokens = changetype<Bytes[]>(event.params.tokens);
  entity.sharedRiskLevels = event.params.sharedRiskLevels;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  for (var i = 0; i < event.params.tokens.length; i++) {
    let token = event.params.tokens[i];
    let sharedRiskLevelValue = event.params.sharedRiskLevels[i];
    let sharedRiskLevelId = event.params.bAppAddress
      .toHexString()
      .concat(token.toHexString());
    let sharedRiskLevel = SharedRiskLevel.load(sharedRiskLevelId);
    if (!sharedRiskLevel) {
      log.info(
        `New SharedRiskLevel created ${sharedRiskLevelId} as new token ${token.toHexString()} is supported by BApp ${event.params.bAppAddress.toHexString()}`,
        []
      );
      sharedRiskLevel = new SharedRiskLevel(sharedRiskLevelId);
      sharedRiskLevel.token = token;
      sharedRiskLevel.sharedRiskLevel = sharedRiskLevelValue;
      sharedRiskLevel.save();
    }
  }
}

export function handleBAppTokensUpdated(event: BAppTokensUpdatedEvent): void {
  let entity = new BAppTokensUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.bAppAddress = event.params.bAppAddress;
  entity.tokens = changetype<Bytes[]>(event.params.tokens);
  entity.sharedRiskLevels = event.params.sharedRiskLevels;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  for (var i = 0; i < event.params.tokens.length; i++) {
    let token = event.params.tokens[i];
    let sharedRiskLevelValue = event.params.sharedRiskLevels[i];
    let sharedRiskLevelId = event.params.bAppAddress
      .toHexString()
      .concat(token.toHexString());
    let sharedRiskLevel = SharedRiskLevel.load(sharedRiskLevelId);
    if (!sharedRiskLevel) {
      log.error(
        `Trying to update SharedRiskLevel ${sharedRiskLevelId} for BApp ${event.params.bAppAddress.toHexString()}, as token ${token.toHexString()} risk level has changed, but SharedRiskLevel does not exist and cannot be created`,
        []
      );
    } else {
      sharedRiskLevel.token = token;
      sharedRiskLevel.sharedRiskLevel = sharedRiskLevelValue;
      sharedRiskLevel.save();
    }
  }
}

export function handleDelegationCreated(event: DelegationCreatedEvent): void {
  let entity = new DelegationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.delegator = event.params.delegator;
  entity.receiver = event.params.receiver;
  entity.percentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let delegator = Account.load(event.params.delegator);
  if (!delegator) {
    log.info(
      `Trying to create new Delegation but delegator account ${event.params.delegator.toHexString()} does not exist, creating it`,
      []
    );
    delegator = new Account(event.params.delegator);
    delegator.nonce = BigInt.zero();
    delegator.validatorCount = BigInt.zero();
    delegator.feeRecipient = event.params.delegator;
    delegator.totalDelegatedPercentage = BigInt.zero();
  }
  delegator.totalDelegatedPercentage = delegator.totalDelegatedPercentage.plus(
    event.params.percentage
  );
  delegator.save();

  let receiver = Account.load(event.params.receiver);
  if (!receiver) {
    log.info(
      `Trying to create new Delegation but receiver account ${event.params.delegator.toHexString()} does not exist, creating it`,
      []
    );
    receiver = new Account(event.params.receiver);
    receiver.nonce = BigInt.zero();
    receiver.validatorCount = BigInt.zero();
    receiver.feeRecipient = event.params.receiver;
    receiver.totalDelegatedPercentage = BigInt.zero()
    receiver.save();
  }

  let delegationId = event.params.delegator
    .toHexString()
    .concat(event.params.receiver.toHexString());
  let delegation = Delegation.load(delegationId);
  if (!delegation) {
    log.info(
      `New Delegation created ${delegationId} as account ${event.params.delegator.toHexString()} is delegating ${
        event.params.percentage
      } of their validator balance to ${event.params.receiver.toHexString()}`,
      []
    );
    delegation = new Delegation(delegationId);
  }
  delegation.delegator = delegator.id;
  delegation.receiver = receiver.id;
  delegation.percentage = event.params.percentage;
  delegation.save();
}

export function handleDelegationRemoved(event: DelegationRemovedEvent): void {
  let entity = new DelegationRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.delegator = event.params.delegator;
  entity.receiver = event.params.receiver;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let delegator = Account.load(event.params.delegator);
  if (!delegator) {
    log.error(
      `Trying to remove Delegation but delegator account ${event.params.delegator.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }
  let existingPercentage = delegator.totalDelegatedPercentage;
  delegator.totalDelegatedPercentage =
    delegator.totalDelegatedPercentage.minus(existingPercentage);
  delegator.save();

  let receiver = Account.load(event.params.receiver);
  if (!receiver) {
    log.info(
      `Trying to remove Delegation but receiver account ${event.params.delegator.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }
  receiver.nonce = BigInt.zero();
  receiver.validatorCount = BigInt.zero();
  receiver.feeRecipient = event.params.receiver;
  receiver.save();

  let delegationId = event.params.delegator
    .toHexString()
    .concat(event.params.receiver.toHexString());
  let delegation = Delegation.load(delegationId);
  if (!delegation) {
    log.error(
      `Trying to remove delegated balance from Delegation ${delegationId}, but it does not exist and cannot be created`,
      []
    );
  } else {
    delegation.delegator = delegator.id;
    delegation.receiver = receiver.id;
    delegation.percentage = BigInt.zero();
    delegation.save();
  }
}

export function handleDelegationUpdated(event: DelegationUpdatedEvent): void {
  let entity = new DelegationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.delegator = event.params.delegator;
  entity.receiver = event.params.receiver;
  entity.percentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let delegator = Account.load(event.params.delegator);
  if (!delegator) {
    log.error(
      `Trying to update Delegation but delegator account ${event.params.delegator.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }
  let existingPercentage = delegator.totalDelegatedPercentage;
  delegator.totalDelegatedPercentage = delegator.totalDelegatedPercentage
    .minus(existingPercentage)
    .plus(event.params.percentage);
  delegator.save();

  let receiver = Account.load(event.params.receiver);
  if (!receiver) {
    log.info(
      `Trying to update Delegation but receiver account ${event.params.receiver.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let delegationId = event.params.delegator
    .toHexString()
    .concat(event.params.receiver.toHexString());
  let delegation = Delegation.load(delegationId);
  if (!delegation) {
    log.error(
      `Trying to update delegated balance from Delegation ${delegationId}, but it does not exist and cannot be created`,
      []
    );
  } else {
    delegation.delegator = delegator.id;
    delegation.receiver = receiver.id;
    delegation.percentage = event.params.percentage;
    delegation.save();
  }
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMaxFeeIncrementSet(event: MaxFeeIncrementSetEvent): void {
  let entity = new MaxFeeIncrementSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newMaxFeeIncrement = event.params.newMaxFeeIncrement;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleObligationCreated(event: ObligationCreatedEvent): void {
  let entity = new ObligationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.bApp = event.params.bApp;
  entity.token = event.params.token;
  entity.obligationPercentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let token = event.params.token;
  let percentage = event.params.percentage;
  let strategyBAppOptInId = event.params.strategyId
    .toString()
    .concat(event.params.bApp.toHexString());
  let obligationId = strategyBAppOptInId.concat(token.toHexString());
  let obligation = Obligation.load(obligationId);
  if (!obligation) {
    log.info(
      `New Obligation created ${obligationId} as Strategy ${
        event.params.strategyId
      } has opted in to BApp ${event.params.bApp.toHexString()}`,
      []
    );
    obligation = new Obligation(obligationId);
    obligation.token = token;
    obligation.percentage = percentage;
    obligation.percentageProposed = percentage;
    obligation.percentageProposedTimestamp = BigInt.zero();
    obligation.save();
  }
}

export function handleObligationUpdateProposed(
  event: ObligationUpdateProposedEvent
): void {
  let entity = new ObligationUpdateProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.bApp = event.params.bApp;
  entity.token = event.params.token;
  entity.percentage = event.params.percentage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // let token = event.params.token;
  // let percentage = event.params.percentage;
  // let strategyBAppOptInId = event.params.strategyId
  //   .toString()
  //   .concat(event.params.bApp.toHexString())
  // let obligationId = strategyBAppOptInId.concat(token.toHexString());
  // let obligation = Obligation.load(obligationId);
  // if (!obligation) {
  //   log.error(
  //     `Obligation ${obligationId} is being updated but it does not exist, and it can't be created`,
  //     []
  //   );
  //   return
  // }
  // obligation.token = token;
  // obligation.percentageProposedTimestamp = event.block.timestamp;
  // obligation.percentage = obligation.percentageProposed;
  // obligation.save();
}

export function handleObligationUpdated(event: ObligationUpdatedEvent): void {
  let entity = new ObligationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.bApp = event.params.bApp;
  entity.token = event.params.token;
  entity.percentage = event.params.percentage;
  entity.isFast = event.params.isFast;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  let token = event.params.token;

  // need to copy the percentage from `percentageProposed`
  let strategyBAppOptInId = event.params.strategyId
    .toString()
    .concat(event.params.bApp.toHexString());
  let obligationId = strategyBAppOptInId.concat(token.toHexString());
  let obligation = Obligation.load(obligationId);
  if (!obligation) {
    log.error(
      `Obligation ${obligationId} is being updated but it does not exist, and it can't be created`,
      []
    );
    return;
  }
  obligation.token = token;
  obligation.percentage = obligation.percentageProposed;
  obligation.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleStrategyCreated(event: StrategyCreatedEvent): void {
  let entity = new StrategyCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.owner = event.params.owner;
  entity.fee = event.params.fee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let owner = Account.load(event.params.owner);
  if (!owner) {
    log.info(
      `Trying to create new Strategy but owner account ${event.params.owner.toHexString()} does not exist, creating it`,
      []
    );
    owner = new Account(event.params.owner);
    owner.nonce = BigInt.zero();
    owner.validatorCount = BigInt.zero();
    owner.feeRecipient = event.params.owner;
    owner.totalDelegatedPercentage = BigInt.zero();
  }
  owner.save();

  let strategyId = event.params.strategyId.toString();
  let strategy = Strategy.load(strategyId);
  if (!strategy) {
    log.info(`New Strategy created ${strategyId}`, []);
    strategy = new Strategy(strategyId);
  }
  strategy.owner = event.params.owner;
  strategy.strategyId = event.params.strategyId;
  strategy.fee = event.params.fee;
  strategy.feeProposed = event.params.fee;
  strategy.feeProposedTimestamp = event.block.timestamp;
  strategy.save();
}

export function handleStrategyDeposit(event: StrategyDepositEvent): void {
  let entity = new StrategyDeposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.contributor = event.params.account;
  entity.token = event.params.token;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let contributor = Account.load(event.params.account);
  if (!contributor) {
    log.error(
      `Trying to create new StrategyTokenBalance but contributor Account ${event.params.account.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to create StrategyTokenBalance but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyTokenBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.info(
      `Strategy ${
        strategy.id
      } is receiving a deposit of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the entity does not exist, creating it`,
      []
    );
    strategyTokenBalance = new StrategyTokenBalance(strategyTokenBalanceId);
    strategyTokenBalance.balance = BigInt.zero();
    strategyTokenBalance.contributor = contributor.id;
    strategyTokenBalance.strategy = strategy.id;
    strategyTokenBalance.token = token;
    strategyTokenBalance.proposedWithdrawal = BigInt.zero();
    strategyTokenBalance.proposedWithdrawalTimestamp = BigInt.zero();
  }
  strategyTokenBalance.balance.plus(event.params.amount);
  strategyTokenBalance.save();
}

export function handleStrategyFeeUpdateProposed(
  event: StrategyFeeUpdateProposedEvent
): void {
  let entity = new StrategyFeeUpdateProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.owner = event.params.owner;
  entity.proposedFee = event.params.proposedFee;
  entity.fee = event.params.fee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let strategyId = event.params.strategyId.toString();
  let strategy = Strategy.load(strategyId);
  if (!strategy) {
    log.error(
      `Strategy ${strategyId} is being updated but it does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategy.feeProposed = event.params.proposedFee;
  strategy.feeProposedTimestamp = event.block.timestamp;
  strategy.save();
}

export function handleStrategyFeeUpdated(event: StrategyFeeUpdatedEvent): void {
  let entity = new StrategyFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.owner = event.params.owner;
  entity.fee = event.params.fee;
  entity.oldFee = event.params.oldFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let strategyId = event.params.strategyId.toString();
  let strategy = Strategy.load(strategyId);
  if (!strategy) {
    log.error(
      `Strategy ${strategyId} is being updated but it does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategy.fee = event.params.fee;
  strategy.feeProposed = event.params.fee;
  strategy.feeProposedTimestamp = BigInt.zero();
  strategy.save();
}

export function handleStrategyWithdrawal(event: StrategyWithdrawalEvent): void {
  let entity = new StrategyWithdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.contributor = event.params.account;
  entity.token = event.params.token;
  entity.amount = event.params.amount;
  entity.isFast = event.params.isFast;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let contributor = Account.load(event.params.account);
  if (!contributor) {
    log.error(
      `Trying to withdraw from StrategyTokenBalance but contributor Account ${event.params.account.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to withdraw from StrategyTokenBalance but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyTokenBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.error(
      `Strategy ${
        strategy.id
      } is being withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategyTokenBalance.contributor = contributor.id;
  strategyTokenBalance.strategy = strategy.id;
  strategyTokenBalance.token = token;
  strategyTokenBalance.balance.minus(event.params.amount);
  strategyTokenBalance.proposedWithdrawal = BigInt.zero();
  strategyTokenBalance.proposedWithdrawalTimestamp = BigInt.zero();
  strategyTokenBalance.save();
}

export function handleStrategyWithdrawalProposed(
  event: StrategyWithdrawalProposedEvent
): void {
  let entity = new StrategyWithdrawalProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategyId = event.params.strategyId;
  entity.account = event.params.account;
  entity.token = event.params.token;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let contributor = Account.load(event.params.account);
  if (!contributor) {
    log.error(
      `Trying to withdraw from StrategyTokenBalance but contributor Account ${event.params.account.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to withdraw from StrategyTokenBalance but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyTokenBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.error(
      `Strategy ${
        strategy.id
      } is being withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategyTokenBalance.contributor = contributor.id;
  strategyTokenBalance.strategy = strategy.id;
  strategyTokenBalance.token = token;
  strategyTokenBalance.proposedWithdrawal = event.params.amount;
  strategyTokenBalance.proposedWithdrawalTimestamp = event.block.timestamp;
  strategyTokenBalance.save();
}
