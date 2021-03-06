/**
 * Created by tushar on 01/07/18
 */

import * as assert from 'assert'
import {action, isAction} from '../../modules/core/index'

describe('isAction', () => {
  describe('valid actions', () => {
    it('should return true if obj is an action', () => {
      const actual = isAction(action('WONDER', {count: 10}))
      assert.ok(actual)
    })
  })
  it('should return false for primitive values', () => {
    assert.ok(!isAction(null))
    assert.ok(!isAction(undefined))
    assert.ok(!isAction(false))
    assert.ok(!isAction(0))
    assert.ok(!isAction(true))
  })
})
