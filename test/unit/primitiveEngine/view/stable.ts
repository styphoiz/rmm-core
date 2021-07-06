import { expect } from 'chai'
import { waffle } from 'hardhat'
import loadContext from '../../context'

describe('owner', function () {
  beforeEach(async function () {
    await loadContext(waffle.provider, [], async function () {})
  })

  it('returns the deployer of the contract as the owner', async function () {
    expect(await this.contracts.engine.stable()).to.equal(this.contracts.stable.address)
  })
})
