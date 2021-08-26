// https://umijs.org/config/
//import { layout } from '@/app';
import { defineConfig } from 'umi'
import { join, parse } from 'path'
import copyWebpackPlugin from 'copy-webpack-plugin'
import proxy from './proxy'
const packageName = require('../package.json').name

// import defaultSettings from './defaultSettings';
// import proxy from './proxy';
// import routes from './routes';

const { REACT_APP_ENV, NODE_ENV } = process.env

export const EVN_CONFIG = {
  dev: {
    imgUrl: 'http://test.bogengkeji.com/images',
    apiUrl: '/webapi-dev',
    masterUrl: 'http://172.18.164.54/',
  },
  pro: {
    imgUrl: 'https://images.bogengkeji.com',
    apiUrl: '/webapi',
    masterUrl: 'https://cat.bogengkeji.com/',
  },
  test: {
    imgUrl: 'http://test.bogengkeji.com/images',
    apiUrl: '/webapi-test',
    masterUrl: 'http://172.18.164.55/',
  },
}
const externalCSS: any[] = [
  //"antd/dist/antd.min.css",
  // "@ant-design/pro-layout/dist/layout.min.css",
]

const externalJS = [
  `react/umd/react.${
    NODE_ENV === 'production' ? 'production.min' : 'development'
  }.js`,
  `react-dom/umd/react-dom.${
    NODE_ENV === 'production' ? 'production.min' : 'development'
  }.js`,
  'moment/min/moment.min.js',
  `lodash/lodash${NODE_ENV === 'production' ? '.min' : ''}.js`,
  // `antd/dist/antd${NODE_ENV === "production" ? ".min" : ""}.js`,
  `@ant-design/icons/dist/index.umd${
    NODE_ENV === 'production' ? '.min' : ''
  }.js`,
 
]
const publicPath = NODE_ENV === 'development' ? 'http://localhost:9000/' : '/'
const outputPath = NODE_ENV === 'development' ? './public' : './dist'

export default defineConfig({
  hash: true,
  antd: {},
  favicon: '/favicon.png',
  define: {
    SC_GLOBAL_API_URL: EVN_CONFIG[REACT_APP_ENV || 'dev'].apiUrl,
    SC_GLOBAL_IMG_URL: EVN_CONFIG[REACT_APP_ENV || 'dev'].imgUrl,
    SC_MASTER_URL: EVN_CONFIG[REACT_APP_ENV || 'dev'].masterUrl,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: false,
  // dynamicImport: {
  // loading: '@ant-design/pro-layout/es/PageLoading',
  // },
  devtool: REACT_APP_ENV === 'pro' ? false : 'source-map',

  targets: {
    ie: 11,
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  qiankun: {
    master: { apps: [] },
  },
  alias: {
    '@@service': '@/services',
  },
  outputPath,
  devServer: {
    // dev write assets into public
    writeToDisk: (filePath: string) =>
      [...externalJS, ...externalCSS].some(
        (external) => parse(external).base === parse(filePath).base
      ),
  },
  links: [
    ...externalCSS.map((external) => ({
      rel: 'stylesheet',
      href: `${publicPath}${parse(external).base}`,
    })),
  ],
  scripts: [
    // polyfill
    ...externalJS.map((external) => ({
      src: `${publicPath}${parse(external).base}`,
      crossOrigin: 'anonymous',
    })),
  ],
  // extraBabelPlugins: ["babel-plugin-lodash"],

  chainWebpack(memo, { env, webpack, createCSSRule }) {
  
    memo.merge({
      externals: [
        {
          react: 'React',
          'react-dom': 'ReactDOM',
          lodash: '_',
          moment: 'moment',
          '@ant-design/icons': 'icons',
          
        },
      ],
    })
    const output = memo.toConfig().output
    let absOutputPath = output?.path

    const to =
      NODE_ENV === 'development' ? join(__dirname, '../public') : absOutputPath
    // memo.plugins.get("copy")
    //memo.plugins.

    memo
      .plugin('copy')
      .use(copyWebpackPlugin)
      .tap(([args]) => {


        return [
          [
            {from: join(__dirname, '../public'),to},
            ...externalCSS.map((external) => ({
              from: require.resolve(external),
              to,
            })),
            ...externalJS.map((external) => ({
              from: require.resolve(external),
              to,
            })),
          ],
        ]
      })

    // memo.plugin('copy').tap(([args]) => [
    //   [
    //     ...args,
    //     ...externalCSS.map(external => ({
    //       from: require.resolve(external),
    //       to,
    //     })),
    //     ...externalJS.map(external => ({
    //       from: require.resolve(external),
    //       to,
    //     })),
    //   ],
    // ]);

    return memo
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
})
