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
export type LogLevel =
  | `   [Info]: ${string}`
  | `[Success]: ${string}`
  | `[Failure]: ${string}`
  | `[Warning]: ${string}`

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const info = (log: string): LogLevel => `   [Info]: ${log}`

/**
 * @since 1.0.0
 * @category Constructors
 */
export const success = (success: string): LogLevel => `[Success]: ${success}`

/**
 * @since 1.0.0
 * @category Constructors
 */
export const failure = (failure: string): LogLevel => `[Failure]: ${failure}`

/**
 * @since 1.0.0
 * @category Constructors
 */
export const warn = (warning: string): LogLevel => `[Warning]: ${warning}`

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerVerboseImpure: LFM.Logger<string> = {
  info: flow(IO.of, IO.chainFirst(C.info), LFM.of),
  success: flow(IO.of, IO.chainFirst(C.log), LFM.of),
  failure: flow(IO.of, IO.chainFirst(C.error), LFM.of),
  warning: flow(IO.of, IO.chainFirst(C.warn), LFM.of),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerVerbosePure: LFM.Logger<string> = {
  info: flow(info, IO.of, LFM.of),
  success: flow(success, IO.of, LFM.of),
  failure: flow(failure, IO.of, LFM.of),
  warning: flow(warn, IO.of, LFM.of),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerSparseImpure: LFM.Logger<string> = {
  info: () => LFM.nil,
  success: () => LFM.nil,
  failure: flow(IO.of, IO.chainFirst(C.error), LFM.of),
  warning: () => LFM.nil,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerSparsePure: LFM.Logger<string> = {
  info: () => LFM.nil,
  success: () => LFM.nil,
  failure: flow(failure, IO.of, LFM.of),
  warning: () => LFM.nil,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerNilPure: LFM.Logger<string> = {
  info: () => LFM.nil,
  success: () => LFM.nil,
  failure: () => LFM.nil,
  warning: () => LFM.nil,
}
