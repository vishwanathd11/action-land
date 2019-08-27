import {PPP} from './pickValueFromComponent'

/**
 * Pick component children type from component or component props
 * @typeparam P Either ComponentProps or ComponentNext
 * @category ComponentNext
 */
export type iChildren<P> = PPP<P, 'iChildren'>
