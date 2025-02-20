import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  BAppOptedInByStrategy as BAppOptedInByStrategyEventLegacy,
  InitializeCall,
  ObligationCreated as ObligationCreatedEventLegacy,
  ObligationUpdateProposed as ObligationUpdateProposedEventLegacy,
  ObligationUpdated as ObligationUpdatedEventLegacy,
  StrategyCreated as StrategyCreatedEventLegacy,
  StrategyDeposit as StrategyDepositEventLegacy,
  StrategyFeeUpdateProposed as StrategyFeeUpdateProposedEventLegacy,
  StrategyFeeUpdated as StrategyFeeUpdatedEventLegacy,
  StrategyWithdrawal as StrategyWithdrawalEventLegacy,
  StrategyWithdrawalProposed as StrategyWithdrawalProposedEventLegacy,
} from "../generated/BasedAppManagerLegacy/BasedAppManagerLegacy";
import {
  Account,
  BAppConstants,
  BAppOptedInByStrategy,
  Obligation,
  ObligationCreated,
  ObligationUpdateProposed,
  ObligationUpdated,
  BAppToken,
  Strategy,
  StrategyBAppOptIn,
  StrategyCreated,
  StrategyDeposit,
  StrategyFeeUpdateProposed,
  StrategyFeeUpdated,
  StrategyUserBalance,
  StrategyWithdrawal,
  StrategyWithdrawalProposed,
  StrategyTokenBalance,
} from "../generated/schema";

export function handleInitialize(call: InitializeCall): void {
  let proxyContract = call.from;
  if (
    !proxyContract
      .toHexString()
      .toLowerCase()
      .includes("0x1bd6ceb98daf7ffeb590236b720f81b65213836a")
  ) {
    log.error(
      `Caller is ${proxyContract.toHexString()}, but we only expect 0x1bd6ceb98daf7ffeb590236b720f81b65213836a`,
      []
    );
    return;
  }

  log.info(
    `New contract Initialized, Bapp Constant values stored with ID ${proxyContract.toHexString()} does not exist on the database, creating it. Update type: INITIALIZATION`,
    []
  );
  let bAppConstants = new BAppConstants(proxyContract);
  bAppConstants._maxFeeIncrement = call.inputs._maxFeeIncrement;

  bAppConstants.totalAccounts = BigInt.zero();
  bAppConstants.totalBApps = BigInt.zero();
  bAppConstants.totalStrategies = BigInt.zero();

  bAppConstants.save();
}

export function handleBAppOptedInByStrategy(
  event: BAppOptedInByStrategyEventLegacy
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
    let obligationId = strategyBAppOptInId.concat(token.toHexString());
    obligationsList.push(obligationId);
  }
  strategyBAppOptIn.bApp = event.params.bApp;
  strategyBAppOptIn.strategy = event.params.strategyId.toString();
  strategyBAppOptIn.save();
}

export function handleObligationCreated(event: ObligationCreatedEventLegacy): void {
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

  // Creating the Obligation itself
  let strategyId = event.params.strategyId.toString();
  let token = event.params.token;
  let percentage = event.params.percentage;
  let strategyBAppOptInId = strategyId
    .toString()
    .concat(event.params.bApp.toHexString());
  let obligationId = strategyBAppOptInId.concat(token.toHexString());
  let obligation = Obligation.load(obligationId);
  if (!obligation) {
    log.info(
      `New Obligation created ${obligationId} as Strategy ${strategyId} has opted in to BApp ${event.params.bApp.toHexString()}`,
      []
    );
    obligation = new Obligation(obligationId);
    obligation.percentageProposedTimestamp = BigInt.zero();
    obligation.obligatedBalance = BigInt.zero();
  }

  const strategyTokenBalanceId = strategyId.concat(token.toHexString());
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.info(
      `Trying to update the balance for token ${token.toHexString()} on Strategy ${strategyId}, but the StrategyTokenBalance entity does not exist, creating it.`,
      []
    );
    strategyTokenBalance = new StrategyTokenBalance(strategyTokenBalanceId);
    strategyTokenBalance.strategy = strategyId;
    strategyTokenBalance.token = token;
    strategyTokenBalance.balance = BigInt.zero();
    strategyTokenBalance.riskValue = BigInt.zero();
  }
  // update the risk value for this token by adding the % of this obligation
  strategyTokenBalance.riskValue =
    strategyTokenBalance.riskValue.plus(percentage);
  strategyTokenBalance.save();

  let obligatedBalance = strategyTokenBalance.balance.times(percentage);

  let bAppToken = BAppToken.load(
    event.params.bApp.toHexString().concat(token.toHexString())
  );
  if (!bAppToken) {
    log.error(
      `Trying to update the total balance obligated to BApp ${event.params.bApp.toHexString()} but the related token entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  // new obligation created, add new obligated balance
  bAppToken.totalObligatedBalance = bAppToken.totalObligatedBalance.plus(obligatedBalance);
  bAppToken.save();

  // update obligated balance, along other things
  obligation.obligatedBalance = obligatedBalance;
  obligation.strategyBAppOptIn = strategyBAppOptInId;
  obligation.token = token;
  obligation.percentage = percentage;
  obligation.percentageProposed = percentage;
  obligation.save();
}

export function handleObligationUpdateProposed(
  event: ObligationUpdateProposedEventLegacy
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

  let token = event.params.token;
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
  obligation.percentageProposed = event.params.percentage;
  obligation.percentageProposedTimestamp = event.block.timestamp;
  obligation.percentage = obligation.percentageProposed;
  obligation.save();
}

export function handleObligationUpdated(event: ObligationUpdatedEventLegacy ): void {
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

  let strategyId = event.params.strategyId.toString();
  let percentage = event.params.percentage;
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

  let strategyTokenBalance = StrategyTokenBalance.load(
    strategyId.concat(token.toHexString())
  );
  if (!strategyTokenBalance) {
    log.error(
      `Transaction ${event.transaction.hash.toHexString()} is updating Obligation. Trying to update the balance for token ${token.toHexString()} on Strategy ${strategyId}, but the balance does not exist, and it cannot be created.`,
      []
    );
    return;
  }
  // update the risk value for this token by adding the % of this obligation
  strategyTokenBalance.riskValue =
    strategyTokenBalance.riskValue.plus(percentage);
  strategyTokenBalance.save();

  let obligatedBalance = strategyTokenBalance.balance.times(percentage);

  let bAppToken = BAppToken.load(
    event.params.bApp.toHexString().concat(token.toHexString())
  );
  if (!bAppToken) {
    log.error(
      `Trying to update the total balance obligated to BApp ${event.params.bApp.toHexString()} but the BAppToken entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  // subtract old obligated balance, add new obligated balance
  bAppToken.totalObligatedBalance = bAppToken.totalObligatedBalance
    .minus(obligation.obligatedBalance)
    .plus(obligatedBalance);
  bAppToken.save();

  // update obligated balance, along other things
  // no need to do .minus().plus() since the token balance in the strategy has not changed
  // and the event has the new percentage, so it's just an overwrite
  obligation.obligatedBalance = obligatedBalance;
  obligation.token = token;
  obligation.percentage = percentage;
  obligation.percentageProposed = percentage;
  obligation.save();
}

export function handleStrategyCreated(event: StrategyCreatedEventLegacy): void {
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

  let newAccountsCount = 0;
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
    newAccountsCount += 1;
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

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    return;
  }
  bAppConstants.totalAccounts = bAppConstants.totalAccounts.plus(
    BigInt.fromI32(newAccountsCount)
  );
  bAppConstants.totalStrategies = bAppConstants.totalStrategies.plus(
    BigInt.fromI32(1)
  );
  bAppConstants.save();
}

export function handleStrategyDeposit(event: StrategyDepositEventLegacy): void {
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

  let newAccountsCount = 0;
  let contributor = Account.load(event.params.account);
  if (!contributor) {
    log.info(
      `Trying to create new StrategyUserBalance but owner account ${event.params.account.toHexString()} does not exist, creating it`,
      []
    );
    contributor = new Account(event.params.account);
    contributor.nonce = BigInt.zero();
    contributor.validatorCount = BigInt.zero();
    contributor.feeRecipient = event.params.account;
    contributor.totalDelegatedPercentage = BigInt.zero();
    newAccountsCount += 1;
  }
  contributor.save();

  let bAppConstants = BAppConstants.load(event.address);
  if (!bAppConstants) {
    log.error(
      "Trying to adjust total Accounts, but constant entry does not exist, and cannot be created",
      []
    );
    return;
  }
  bAppConstants.totalAccounts = bAppConstants.totalAccounts.plus(
    BigInt.fromI32(newAccountsCount)
  );
  bAppConstants.save();

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to create StrategyUserBalance but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyUserBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyUserBalance = StrategyUserBalance.load(strategyUserBalanceId);
  if (!strategyUserBalance) {
    log.info(
      `Strategy ${
        strategy.id
      } is receiving a deposit of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the StrategyUserBalance entity does not exist, creating it`,
      []
    );
    strategyUserBalance = new StrategyUserBalance(strategyUserBalanceId);
    strategyUserBalance.depositAmount = BigInt.zero();
    strategyUserBalance.contributor = contributor.id;
    strategyUserBalance.strategy = strategy.id;
    strategyUserBalance.token = token;
    strategyUserBalance.proposedWithdrawal = BigInt.zero();
    strategyUserBalance.proposedWithdrawalTimestamp = BigInt.zero();
  }
  strategyUserBalance.depositAmount = strategyUserBalance.depositAmount.plus(event.params.amount);
  strategyUserBalance.save();

  let strategyBAppOptIns = strategy.bApps.load();

  let strategyTokenBalanceId = strategy.id.concat(token.toHexString());
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.info(
      `Strategy ${
        strategy.id
      } is receiving a deposit of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the StrategyTokenBalance entity does not exist, creating it`,
      []
    );
    strategyTokenBalance = new StrategyTokenBalance(strategyTokenBalanceId);
    strategyTokenBalance.strategy = strategy.id;
    strategyTokenBalance.token = token;
    strategyTokenBalance.balance = BigInt.zero();
    strategyTokenBalance.riskValue = BigInt.zero();
  }
  strategyTokenBalance.balance = strategyTokenBalance.balance.plus(
    event.params.amount
  );
  strategyTokenBalance.save();

  for (var i = 0; i < strategyBAppOptIns.length; i++) {
    let strategyBAppOptIn = strategyBAppOptIns[i];
    let obligations = strategyBAppOptIn.obligations.load();

    let obligatedBalanceDelta = BigInt.zero();
    for (let j = 0; j < obligations.length; j++) {
      let obligation = obligations[j];
      if (obligation.token == token) {
        obligatedBalanceDelta = event.params.amount.times(
          obligation.percentage
        );
        obligation.obligatedBalance = obligation.obligatedBalance.plus(
          obligatedBalanceDelta
        );
        obligation.save();
      }
    }

    let bAppToken = BAppToken.load(
      strategyBAppOptIn.bApp.toHexString().concat(token.toHexString())
    );
    if (!bAppToken) {
      log.info(
        `Strategy ${
          strategy.id
        } is receiving a deposit of token ${token.toHexString()} by address ${contributor.id.toHexString()}. Trying to update the total balance obligated to BApp ${strategyBAppOptIn.bApp.toHexString()} but the BAppToken entity ${strategyBAppOptIn.bApp
          .toHexString()
          .concat(
            token.toHexString()
          )} does not exist. Likely means this token is not accepted by the BApp, so skipping it`,
        []
      );
      return;
    }
    let oldValue = bAppToken.totalObligatedBalance
    let newValue = oldValue.plus(obligatedBalanceDelta)
    log.info(
      `updating the BAppToken entity ${strategyBAppOptIn.bApp
        .toHexString()
        .concat(token.toHexString())}. Old value: ${oldValue}, new value: ${newValue}`,
        []
      );
    bAppToken.totalObligatedBalance = bAppToken.totalObligatedBalance.plus(obligatedBalanceDelta);
    bAppToken.save();
  }
}

export function handleStrategyFeeUpdateProposed(
  event: StrategyFeeUpdateProposedEventLegacy
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

export function handleStrategyFeeUpdated(event: StrategyFeeUpdatedEventLegacy): void {
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

export function handleStrategyWithdrawal(event: StrategyWithdrawalEventLegacy): void {
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
      `Trying to withdraw from StrategyUserBalance but contributor Account ${event.params.account.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to withdraw from StrategyUserBalance but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyUserBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyUserBalance = StrategyUserBalance.load(strategyUserBalanceId);
  if (!strategyUserBalance) {
    log.error(
      `Strategy ${
        strategy.id
      } is being withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategyUserBalance.contributor = contributor.id;
  strategyUserBalance.strategy = strategy.id;
  strategyUserBalance.token = token;
  strategyUserBalance.depositAmount.minus(event.params.amount);
  strategyUserBalance.proposedWithdrawal = BigInt.zero();
  strategyUserBalance.proposedWithdrawalTimestamp = BigInt.zero();
  strategyUserBalance.save();

  let strategyTokenBalanceId = strategy.id.concat(token.toHexString());
  let strategyTokenBalance = StrategyTokenBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.error(
      `Strategy ${
        strategy.id
      } is receiving withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the entity does not exist, and it can't be created`,
      []
    );
    return;
  }
  strategyTokenBalance.balance = strategyTokenBalance.balance.minus(
    event.params.amount
  );
  strategyTokenBalance.save();

  let strategyBAppOptIns = strategy.bApps.load();

  for (var i = 0; i < strategyBAppOptIns.length; i++) {
    let strategyBAppOptIn = strategyBAppOptIns[i];
    let obligations = strategyBAppOptIn.obligations.load();

    let obligatedBalanceDelta = BigInt.zero();
    for (let j = 0; j < obligations.length; j++) {
      let obligation = obligations[j];
      if (obligation.token == token) {
        obligatedBalanceDelta = event.params.amount.times(
          obligation.percentage
        );
        obligation.obligatedBalance = obligation.obligatedBalance.minus(
          obligatedBalanceDelta
        );
        obligation.save();
      }
    }

    let bAppToken = BAppToken.load(
      strategyBAppOptIn.bApp.toHexString().concat(token.toHexString())
    );
    if (!bAppToken) {
      log.info(
        `Strategy ${
          strategy.id
        } is being withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}. Trying to update the total balance obligated to BApp ${strategyBAppOptIn.bApp.toHexString()} but the related token entity  ${strategyBAppOptIn.bApp
          .toHexString()
          .concat(
            token.toHexString()
          )} does not exist. Likely means this token is not accepted by the BApp, so skipping it`,
        []
      );
      return;
    }
    bAppToken.totalObligatedBalance.minus(obligatedBalanceDelta);
    bAppToken.save();
  }
}

export function handleStrategyWithdrawalProposed(
  event: StrategyWithdrawalProposedEventLegacy
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
      `Strategy ${event.params.strategyId} is being withdrawn of token ${
        event.params.token
      } but contributor Account ${event.params.account.toHexString()} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let strategy = Strategy.load(event.params.strategyId.toString());
  if (!strategy) {
    log.error(
      `Trying to withdraw from Strategy but receiving Strategy ${event.params.strategyId} does not exist, and cannot be created`,
      []
    );
    return;
  }

  let token = event.params.token;
  let strategyTokenBalanceId = strategy.id.concat(
    contributor.id.toHexString().concat(token.toHexString())
  );
  let strategyTokenBalance = StrategyUserBalance.load(strategyTokenBalanceId);
  if (!strategyTokenBalance) {
    log.error(
      `Strategy ${
        strategy.id
      } is being withdrawn of token ${token.toHexString()} by address ${contributor.id.toHexString()}, but the StrategyUserBalance ${strategyTokenBalanceId} does not exist, and it can't be created`,
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
