import * as C from 'fp-ts/Console'
import * as IO from 'fp-ts/IO'
import { constVoid, flow } from 'fp-ts/function'

// ###################
// ### Typeclasses ###
// ###################

/**
 * @since 1.0.0
 * @category Typeclasses
 */
export interface Logger<A, B = A> {
  info: (a: A) => IO.IO<B>
  success: (a: A) => IO.IO<B>
  failure: (a: A) => IO.IO<B>
  warning: (a: A) => IO.IO<B>
}

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
export const LoggerVerboseImpure: Logger<string> = {
  info: flow(IO.of, IO.chainFirst(C.info)),
  success: flow(IO.of, IO.chainFirst(C.log)),
  failure: flow(IO.of, IO.chainFirst(C.error)),
  warning: flow(IO.of, IO.chainFirst(C.warn)),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerVerbosePure: Logger<string> = {
  info: IO.of,
  success: IO.of,
  failure: IO.of,
  warning: IO.of,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerTaggedVerbosePure: Logger<string> = {
  info: flow(info, IO.of),
  success: flow(success, IO.of),
  failure: flow(failure, IO.of),
  warning: flow(warn, IO.of),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerSparseImpure: Logger<string> = {
  info: IO.of,
  success: IO.of,
  failure: flow(IO.of, IO.chainFirst(C.error)),
  warning: IO.of,
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerVoid: Logger<unknown, void> = {
  info: flow(constVoid, IO.of),
  success: flow(constVoid, IO.of),
  failure: flow(constVoid, IO.of),
  warning: flow(constVoid, IO.of),
}