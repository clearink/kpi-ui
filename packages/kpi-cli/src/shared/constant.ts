import { resolve } from 'path'

const NAME = 'kpi'

// cli
export const CWD = process.cwd()
export const KPI_CONFIG = resolve(CWD, `./${NAME}.config.js`)
export const SRC_DIR = resolve(CWD, 'src')
export const LIB_DIR = resolve(CWD, 'lib')
export const ES_DIR = resolve(CWD, 'es')
export const UMD_DIR = resolve(CWD, 'umd')
export const TYPES_DIR = resolve(CWD, 'types')
export const DOCS_DIR = resolve(CWD, 'docs')
export const UI_PACKAGE_JSON = resolve(CWD, './package.json')

// common
export const ESLINT_EXTENSION = ['.ts', '.tsx', '.js', '.jsx', '.mjs']
export const RESOLVE_EXTENSION = ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css']
export const SCRIPTS_EXTENSION = ['.ts', '.tsx', '.js', '.jsx']
export const PUBLIC_ENTRY = ['index.ts', 'index.tsx', 'index.js', 'index.jsx']
export const STYLE_DIR_NAME = 'style'
export const EXAMPLE_DIR_NAME = 'example'
export const EXAMPLE_LOCALE_DIR_NAME = 'locale'
export const EXAMPLE_DIR_ENTRY = 'index.tsx'
export const DOCS_DIR_NAME = 'docs'
export const TESTS_DIR_NAME = '__tests__'
export const GENERATE_DIR = resolve(__dirname, '/generate')
export const CLI_PACKAGE_JSON = resolve(__dirname, '../../package.json')

// site
export const SITE_CONFIG = resolve(CWD, '.kpi/site.config.json')
