import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { BAppObligationSet } from "../generated/schema"
import { BAppObligationSet as BAppObligationSetEvent } from "../generated/BasedAppManager/BasedAppManager"
import { handleBAppObligationSet } from "../src/based-app-manager"
import { createBAppObligationSetEvent } from "./based-app-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let strategyId = BigInt.fromI32(234)
    let bApp = Address.fromString("0x0000000000000000000000000000000000000001")
    let token = Address.fromString("0x0000000000000000000000000000000000000001")
    let obligationPercentage = BigInt.fromI32(234)
    let newBAppObligationSetEvent = createBAppObligationSetEvent(
      strategyId,
      bApp,
      token,
      obligationPercentage
    )
    handleBAppObligationSet(newBAppObligationSetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BAppObligationSet created and stored", () => {
    assert.entityCount("BAppObligationSet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BAppObligationSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "strategyId",
      "234"
    )
    assert.fieldEquals(
      "BAppObligationSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "bApp",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BAppObligationSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BAppObligationSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "obligationPercentage",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
