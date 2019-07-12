import {curry2} from 'ts-curry'
import {isNil} from './isNil'

type AType = string | number

/**
 * Interface for Action
 * @interface
 */
export interface Action<V, T = AType> {
  readonly type: T
  readonly value: V
}

function createAction<T extends AType, V>(type: T, value: V) {
  return isNil(value) ? value : {type, value}
}

/**
 * Creates a new Action type object
 * @function
 * @param {string|number} type
 * @param {any} value
 * @returns {Action}
 */
export const action: {
  <T extends AType, V>(type: T, value: V): Action<V, T>
  <T extends AType, V>(type: T): {(value: V): Action<V, T>}
} = curry2(createAction)
