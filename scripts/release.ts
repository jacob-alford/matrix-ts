import * as RTE from 'fp-ts/ReaderTaskEither'

import { CLI, cli } from './CLI'
import { run } from './run'

interface Build<A> extends RTE.ReaderTaskEither<CLI, Error, A> {}

export const main: Build<void> = C =>
  C.exec('npm publish', {
    cwd: 'dist',
    env: {
      NODE_AUTH_TOKEN: process.env.NODE_AUTH_TOKEN,
    },
  })

run(
  main({
    ...cli,
  })
)
