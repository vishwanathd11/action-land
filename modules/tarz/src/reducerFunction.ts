/**
 * Created by tushar on 25/06/18
 */

/**
 * A function that takes in a Value and a State and returns a new state
 * @param: action
 * @param: Old state
 */
export type ReducerFunction<State, Input = unknown> =
  | ((input: Input, state: State) => State)
  | ((input: Input) => State)
