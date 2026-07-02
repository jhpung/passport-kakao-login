import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'

const external = ['passport-oauth2']

export default [
  {
    input: 'src/index.ts',
    external,
    output: [
      { file: 'dist/index.cjs', format: 'cjs', sourcemap: true, exports: 'named' },
      { file: 'dist/index.mjs', format: 'esm', sourcemap: true },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', declaration: true, declarationDir: 'dist/types' }),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    external,
    plugins: [dts()],
  },
]
