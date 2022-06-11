import * as C from 'fp-ts/Console'
import { flow } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'

import * as LFM from './LoggerFreeMonoid'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export type LogLevel<A> =
  | { _tag: 'Info'; log: A }
  | { _tag: 'Success'; success: A }
  | { _tag: 'Failure'; failure: A }
  | { _tag: 'Warn'; warning: A }

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const info = <A>(log: A): LogLevel<A> => ({ _tag: 'Info', log })

/**
 * @since 1.0.0
 * @category Constructors
 */
export const success = <A>(success: A): LogLevel<A> => ({ _tag: 'Success', success })

/**
 * @since 1.0.0
 * @category Constructors
 */
export const failure = <A>(failure: A): LogLevel<A> => ({ _tag: 'Failure', failure })

/**
 * @since 1.0.0
 * @category Constructors
 */
export const warn = <A>(warning: A): LogLevel<A> => ({ _tag: 'Warn', warning })

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerImpure: LFM.Logger<string> = {
  info: flow(IO.of, IO.chainFirst(C.info), LFM.of),
  success: flow(IO.of, IO.chainFirst(C.log), LFM.of),
  failure: flow(IO.of, IO.chainFirst(C.error), LFM.of),
  warning: flow(IO.of, IO.chainFirst(C.warn), LFM.of),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerPure: LFM.Logger<string, LogLevel<string>> = {
  info: flow(info, IO.of, LFM.of),
  success: flow(success, IO.of, LFM.of),
  failure: flow(failure, IO.of, LFM.of),
  warning: flow(warn, IO.of, LFM.of),
}
