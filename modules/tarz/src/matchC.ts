/**
 * Created by tushar on 26/06/18
 */

import {IAction, isAction, Nil} from '@action-land/core'
import {CurriedFunction2, curry2} from 'ts-curry'

import {hasOwnProperty} from '../../utils'

import {CommandFunction} from './commandFunction'

/**
 * Spec of Thunks for each Command that needs to be handled
 */
export interface IMatchActionCSpec<State> {
  [key: string]: CommandFunction<State>
}

export const matchC = <State>(
  spec: IMatchActionCSpec<State>
): CurriedFunction2<unknown, State, IAction<unknown>> =>
  curry2(
    (action: unknown, state: State): IAction<unknown> =>
      isAction(action) && hasOwnProperty(action.type, spec)
        ? spec[action.type](action.value, state)
        : Nil()
  )
