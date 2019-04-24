/**
 * Created by tushar on 26/06/18
 */

import {IAction, isAction, isList, isNil, List, Nil} from '@action-land/core'
import {CurriedFunction2, curry2} from 'ts-curry'

import {CommandFunction} from './commandFunction'

export const concatC = <State>(
  ...t: Array<CommandFunction<State>>
): CurriedFunction2<unknown, State, IAction<unknown>> =>
  curry2(
    (input: unknown, state: State): IAction<unknown> => {
      const result: Array<IAction<unknown>> = []
      for (const item of t) {
        const act = item(input, state)
        if (isList(act)) {
          act.value.forEach(val => {
            if (isAction(val) && !isNil(val)) {
              result.push(val)
            }
          })
        } else if (!isNil(act)) {
          result.push(act)
        }
      }

      return result.length === 0
        ? Nil()
        : result.length === 1
        ? result[0]
        : List(...result)
    }
  )
