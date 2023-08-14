// https://umijs.org/config/
//import { layout } from '@/app';
import { defineConfig } from "@umijs/max";
import path from 'path';
//import copyWebpackPlugin from 'copy-webpack-plugin';
import proxy from "./proxy";

const { theme } = require('antd/lib');
const { convertLegacyToken } = require('@ant-design/compatible/lib');

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v4Token = convertLegacyToken(mapToken);

//const packageName = require('../package.json').name;

// import defaultSettings from './defaultSettings';
// import proxy from './proxy';
// import routes from './routes';

const { REACT_APP_ENV, NODE_ENV } = process.env;
console.log()
export const EVN_CONFIG: any = {
  dev: {
    imgUrl: "http://test.yumcat.cn/images",
    apiUrl: "/webapi-dev",
    masterUrl: "http://172.18.165.32:9007/",
  },
  pro: {
    imgUrl: "https://images.yumcat.cn",
    apiUrl: "/webapi",
    masterUrl: "https://sys.yumcat.cn/",
  },
  test: {
    imgUrl: "http://test.yumcat.com/images",
    apiUrl: "/webapi-test",
    masterUrl: "http://172.18.164.55/",
  },
  pre: {
    imgUrl: "http://test.yumcat.com/images",
    apiUrl: "/webapi-test",
    masterUrl: "http://172.18.164.107/",
  },
};
// const externalCSS: any[] = [
//   //"antd/dist/antd.min.css",
//   // "@ant-design/pro-layout/dist/layout.min.css",
// ];

const addScripts = () => {
  const consolescript: any[] = [];

  consolescript.push(
    " if(/Android|Windows Phone|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {"
  );
  consolescript.push('var fileObj=document.createElement("script");');
  consolescript.push('fileObj.type = "text/javascript";');
  consolescript.push(
    'fileObj.src ="https://s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js";'
  );
  consolescript.push("document.body.appendChild(fileObj);");
  consolescript.push("}");
  const s1 = consolescript.join("\r\n");

  return [s1];
};
const scripts = REACT_APP_ENV !== "pro" ? addScripts() : [];

// const externalJS = [
//   `react/umd/react.${NODE_ENV === 'production' ? 'production.min' : 'development'
//   }.js`,
//   `react-dom/umd/react-dom.${NODE_ENV === 'production' ? 'production.min' : 'development'
//   }.js`,
//   'moment/min/moment.min.js',
//   `lodash/lodash${NODE_ENV === 'production' ? '.min' : ''}.js`,
//   // `antd/dist/antd${NODE_ENV === "production" ? ".min" : ""}.js`,
//   `@ant-design/icons/dist/index.umd${NODE_ENV === 'production' ? '.min' : ''
//   }.js`,
// ];
//const publicPath = NODE_ENV === 'development' ? 'http://localhost:9000/' : './';
const outputPath = NODE_ENV === "development" ? "./public" : "./dist";

export default defineConfig({
  // publicPath: '/sysweb/',
  hash: true,
  antd: {
    
    import: false,
  },
  extraBabelIncludes:["D:\\work\\bosssoft\\bg\\bgtech-fe\\sc-boson\\packages\\layout"],

  model:{},
  scripts,
  fastRefresh: true,
  mfsu: false,
  svgo:false,
svgr:undefined,
  favicons: ["/favicon.png"],
  define: {
    SC_GLOBAL_API_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].apiUrl,
    SC_GLOBAL_IMG_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].imgUrl,
    SC_MASTER_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].masterUrl,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    default: "zh-CN",
  },
  // dynamicImport: {
  // loading: '@ant-design/pro-layout/es/PageLoading',
  // },
  devtool: REACT_APP_ENV === "pro" ? undefined : "source-map",
  // cssModulesTypescriptLoader: {},
  targets: {
    ie: 11,
  },
  // esbuild: {},
  

  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: "/",
  },
  qiankun: {
    master: { apps: [] },
  },
  // base: '/sysweb',
  alias: {
    "@@service": "@/services",
  },

  lessLoader: {
    modifyVars: v4Token
  },
  // cssLoader: {
  //   // 这里的 modules 可以接受 getLocalIdent
  //   modules: {
  //     localIdentName: "[local]___[hash:base64:5]",
  //   },
  // },
  // normalCSSLoaderModules: {

  //   auto: undefined
  // },
  // cssLoaderModules: {
  //   mode: "local",
  //   localIdentContext: path.resolve(__dirname, "src"),

  //   localIdentName: "[local]--[hash:base64:5]",



  // },

  outputPath: outputPath,
  //@ts-ignore
  chainWebpack(memo, args) {

    console.log(memo.module)
    return memo;
  },
  // devServer: {
  //   // dev write assets into public
  //   // writeToDisk: (filePath: string) =>
  //   //   [...externalJS, ...externalCSS].some(
  //   //     (external) => parse(external).base === parse(filePath).base
  //   //   ),
  // },
  // links: [
  //   ...externalCSS.map((external) => ({
  //     rel: 'stylesheet',
  //     href: `${publicPath}${parse(external).base}`,
  //   })),
  // ],
  // scripts: [
  //   // polyfill
  //   ...externalJS.map((external) => ({
  //     src: `${publicPath}${parse(external).base}`,
  //     crossOrigin: 'anonymous',
  //   })),
  // ],
  // extraBabelPlugins: ["babel-plugin-lodash"],

  //chainWebpack(memo, { env, webpack, createCSSRule }) {
  // memo.merge({
  //   externals: [
  //     {
  //       react: 'React',
  //       'react-dom': 'ReactDOM',
  //       lodash: '_',
  //       moment: 'moment',
  //       '@ant-design/icons': 'icons',

  //     },
  //   ],
  // })
  // const output = memo.toConfig().output
  // let absOutputPath = output?.path

  // const to =
  //   NODE_ENV === 'development' ? join(__dirname, '../public') : absOutputPath
  // // memo.plugins.get("copy")
  // //memo.plugins.

  // memo
  //   .plugin('copy')
  //   .use(copyWebpackPlugin)
  //   .tap(([args]) => {

  //     return [
  //       [
  //         {from: join(__dirname, '../public'),to},
  //         ...externalCSS.map((external) => ({
  //           from: require.resolve(external),
  //           to,
  //         })),
  //         ...externalJS.map((external) => ({
  //           from: require.resolve(external),
  //           to,
  //         })),
  //       ],
  //     ]
  //   })

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

  // return memo;
  // },
  proxy: proxy[REACT_APP_ENV || "dev"],
});
