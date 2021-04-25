// https://umijs.org/config/
//import { layout } from '@/app';
import { defineConfig } from 'umi';
import { join, parse } from 'path';
import copyWebpackPlugin from 'copy-webpack-plugin';
import proxy from './proxy';
const packageName = require('../package.json').name;

// import defaultSettings from './defaultSettings';
// import proxy from './proxy';
// import routes from './routes';

 const { REACT_APP_ENV, NODE_ENV } = process.env;
 console.log(REACT_APP_ENV)
const externalCSS = ['xterm/css/xterm.css','antd/dist/antd.css'];
const externalJS = [
  `react/umd/react.${NODE_ENV === 'production' ? 'production.min' : 'development'}.js`,
  `react-dom/umd/react-dom.${NODE_ENV === 'production' ? 'production.min' : 'development'}.js`,
  'moment/min/moment.min.js',
  'antd/dist/antd.min.js'
];
const publicPath = NODE_ENV === 'development' ? 'http://localhost:9000/' : '/';
const outputPath = NODE_ENV === 'development' ? './public' : './dist';
console.log("sdfsdf")
export default defineConfig({
  hash: true,
  // antd: {},

  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: false,
  // dynamicImport: {
  // loading: '@ant-design/pro-layout/es/PageLoading',
  // },

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
  qiankun:{
    master:{}
  },
  outputPath,
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
   // antd: 'window.antd',
    //xterm: 'window.Terminal',
    moment: 'moment',
  },
  devServer: {
    // dev write assets into public
    writeToDisk: (filePath: string) =>
      [...externalJS, ...externalCSS].some(
        external => parse(external).base === parse(filePath).base,
      ),
  },
  links: [
    ...externalCSS.map(external => ({
      rel: 'stylesheet',
      href: `${publicPath}${parse(external).base}`,
    })),
  ],
  antd: {},
  scripts: [
    // polyfill
    ...externalJS.map(external => ({
      src: `${publicPath}${parse(external).base}`,
      crossOrigin: 'anonymous',
    })),
  ],

  chainWebpack(memo, { env, webpack, createCSSRule }) {
    // config.plugin('webpack-less-theme').use(
    //   new LessThemePlugin({
    //     theme: join(__dirname, './src/styles/parameters.less'),
    //   }),
    // );
    
    const output = memo.toConfig().output;
    let absOutputPath=output?.path;

    const to = NODE_ENV === 'development' ? join(__dirname, '../public') : absOutputPath;
   // memo.plugins.get("copy")
    //memo.plugins.
  
    memo.plugin('copy').use(copyWebpackPlugin).tap(([args])=>[
      [
        ...externalCSS.map(external => ({
          from: require.resolve(external),
          to,
        })),
        ...externalJS.map(external => ({
          from: require.resolve(external),
          to,
        })),
      ],
    ])

    
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

    return memo;
  },
  proxy:proxy[REACT_APP_ENV||"dev"]
});
