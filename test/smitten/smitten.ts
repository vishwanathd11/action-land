/**
 * Created by tushar on 15/01/17.
 */

import {Action, action} from '@action-land/core'
import * as assert from 'assert'

import {create} from '../../modules/smitten/index'

export const testListener = <T>(): {
  actions: Array<Action<T>>
  listener(action: Action<T>): void
} => {
  const actions: any[] = []
  const listener = (action: any): void => {
    actions.push(action)
  }

  return {actions, listener}
}

describe('hoe', () => {
  it('should emit actions', () => {
    const {actions, listener} = testListener()
    const e = create(listener)
    e.emit(100)
    e.emit(200)
    assert.deepStrictEqual(actions, [100, 200])
  })
  it('should emit nested action with type', () => {
    const {actions, listener} = testListener()
    const e = create(listener).of('T')
    e.emit(100)
    e.emit(200)
    assert.deepStrictEqual(actions, [action('T', 100), action('T', 200)])
  })
  it('should nested actions', () => {
    const {actions, listener} = testListener()
    const e = create(listener)
      .of('A')
      .of('B')
    e.emit(100)
    e.emit(200)
    assert.deepStrictEqual(actions, [
      action('A', action('B', 100)),
      action('A', action('B', 200))
    ])
  })

  it('should persist arguments', () => {
    const {actions, listener} = testListener()
    const e = create(listener)
    const f = e.of('F')
    e.emit.call(null, 100)
    f.emit.call(null, 200)
    assert.deepStrictEqual(actions, [100, action('F', 200)])
  })
  it.skip('should be stack safe', () => {
    const {listener} = testListener()
    let e = create(listener)
    assert.doesNotThrow(() => {
      for (let i = 0; i < 1e6; i++) {
        e = e.of(i.toString())
      }
      e.emit(null)
    })
  })
})
