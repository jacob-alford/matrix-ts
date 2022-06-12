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
export type LogLevel = 'Info' | 'Success' | 'Failure' | 'Warning'

/**
 * @since 1.0.0
 * @category Model
 */
export type LogDetails<E> = {
  message: E
  timestamp: string
  level: LogLevel
}

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const info = <E>(message: E): LogDetails<E> => ({
  message,
  timestamp: new Date().toISOString(),
  level: 'Info',
})

/**
 * @since 1.0.0
 * @category Constructors
 */
export const success = <E>(message: E): LogDetails<E> => ({
  message,
  timestamp: new Date().toISOString(),
  level: 'Success',
})

/**
 * @since 1.0.0
 * @category Constructors
 */
export const failure = <E>(message: E): LogDetails<E> => ({
  message,
  timestamp: new Date().toISOString(),
  level: 'Failure',
})

/**
 * @since 1.0.0
 * @category Constructors
 */
export const warning = <E>(message: E): LogDetails<E> => ({
  message,
  timestamp: new Date().toISOString(),
  level: 'Warning',
})

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerVerboseImpure: Logger<string, LogDetails<string>> = {
  info: flow(info, IO.of, IO.chainFirst(C.info)),
  success: flow(success, IO.of, IO.chainFirst(C.log)),
  failure: flow(failure, IO.of, IO.chainFirst(C.error)),
  warning: flow(warning, IO.of, IO.chainFirst(C.warn)),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerVerbosePure: Logger<string, LogDetails<string>> = {
  info: flow(info, IO.of),
  success: flow(success, IO.of),
  failure: flow(failure, IO.of),
  warning: flow(warning, IO.of),
}

/**
 * @since 1.0.0
 * @category Instances
 */
export const LoggerImpure: Logger<string> = {
  info: flow(IO.of, IO.chainFirst(C.error)),
  success: flow(IO.of, IO.chainFirst(C.error)),
  failure: flow(IO.of, IO.chainFirst(C.error)),
  warning: flow(IO.of, IO.chainFirst(C.error)),
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
