// https://umijs.org/config/
//import { layout } from '@/app';
import { defineConfig } from "@umijs/max";
import type { IConfig } from '@umijs/preset-umi'
import getPkg from "./getPkg";
import getCwd from "./getCwd";
//import { BabelRegister, compatESModuleRequire } from "@umijs/utils";
import { join } from "path";
import { existsSync } from "fs";
import { theme } from 'antd'

const { defaultAlgorithm, defaultSeed } = theme;
import { convertLegacyToken } from '@ant-design/compatible';
console.log("babel-plugin-import", require.resolve("babel-plugin-import"))
const mapToken = defaultAlgorithm(defaultSeed);
const v4Token = convertLegacyToken(mapToken);


// import proxy from './proxy'
import slash from "slash2";
const packageName = getPkg("").name;

// const { REACT_APP_ENV } = process.env;
const { REACT_APP_ENV, NODE_ENV } = process.env;
let proxy = null;
try {
  const path = join(getCwd(), "config/proxy.ts");

  if (existsSync(path)) {
    //const reg = new BabelRegister();
    // reg.setOnlyMap({ key: "proxy", value: [path] });
    // reg.register();
  }
  proxy = require(path)?.default;
  //console.log(proxy)
  if (proxy)
    console.log(
      "\x1B[34m开启代理:" +
      JSON.stringify(proxy[REACT_APP_ENV || "dev"]) +
      "\x1B[0m"
    );
} catch (ex) {
  console.warn(
    "\x1B[33m" + join(getCwd(), "config/proxy.ts") + "不存在\x1B[0m"
  );
}
export const EVN_CONFIG = {
  dev: {
    imgUrl: "https://test.yumcat.cn/images",
    apiUrl: "/webapi-dev",
  },
  pro: {
    imgUrl: "https://images.yumcat.cn",
    apiUrl: "/webapi",
  },
  test: {
    imgUrl: "https://test.yumcat.cn/images",
    apiUrl: "/webapi-test",
  },
};
//micro-basic
let base = "/";
if (packageName.indexOf("micro-") > -1) {
  base = "/" + packageName.replace("micro-", "");
}

const publicPath = NODE_ENV === "production" ? `/${packageName}/` : `/${base}/`;

console.log("plugin-import", require.resolve("babel-plugin-import"))

export default defineConfig({
  hash: true,
  antd: {
    theme:{
      token:{}
    
    }
  },
  locale: {
    default: "zh-CN",
    antd: true,
  },
  svgr:undefined,
  devtool: REACT_APP_ENV == "pro" ? undefined : "source-map",
  define: {
    SC_GLOBAL_API_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].apiUrl,
    SC_GLOBAL_IMG_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].imgUrl,
  },
  base: base,
  publicPath,
  alias: {
    "@@service": "@/services",
  },
  // dynamicImport: {
  //   loading: "@micro-frame/sc-runtime/es/components/Loading",
  // },
  extraBabelPlugins: [
    [
      require.resolve("babel-plugin-import"),
      {
        libraryName: "@scboson/sc-element",
        libraryDirectory: "es",
        style: true,
      },
    ],
  ],
  qiankun: {
    slave: { enable: true },
  },
  targets: {
    ie: 11,
  },

  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration' ,'isSameOrBefore',
    'isSameOrAfter',
    'advancedFormat',
    'customParseFormat',
    'weekday',
    'weekYear',
    'weekOfYear',
   // "locale",
    'isMoment',
    'localeData',
    'localizedFormat','utc'],
  },
  ignoreMomentLocale: true,
  microlayout: {
    localMenuData: true,
    localLayout: true,
  },
  lessLoader: {
    modifyVars: v4Token
  },
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//],
  },
  //window.routerBase =window.__POWERED_BY_QIANKUN__? "/mallsys":"/micro-mallsys/";
  headScripts: [
    {
      content: `window.routerBase = window.__POWERED_BY_QIANKUN__?"${base}":"/${packageName}"`,
    },
  ],
  codeSplitting:{
    jsStrategy:'bigVendors'
  },

  mfsu: false,
  fastRefresh:true,
  model: {},
  plugins: [
    "@micro-frame/plugin-microlayout",
  ],
  cssLoader: {
    // 这里的 modules 可以接受 getLocalIdent
    modules: {
      getLocalIdent: (
        context: {
          resourcePath: string;
        },
        _: string,
        localName: string
      ) => {
        //  console.log(context.resourcePath)
        if (
          context.resourcePath.includes("node_modules") ||
          context.resourcePath.includes("ant.design.pro.less") ||
          // umi 的 global.less 约定不使用 css-module
          context.resourcePath.includes("global.less")
        ) {
          return localName;
        }
        // 将 uuid 的类名转化为 antd-pro-文件路径的样式。
        // 类似.antd-pro-components-global-footer-index-links
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace(".less", "");
          //console.log(antdProPath)
          // console.log(localName)
          const arr = slash(antdProPath)
            .split("/")
            .map((a: any) => a.replace(/([A-Z])/g, "-$1"))
            .map((a: any) => a.toLowerCase());
          return `${packageName}${arr.join("-")}-${localName}`.replace(
            /--/g,
            "-"
          );
        }
        return localName;
      },
    },
  },
  theme: {
    "@root-entry-name": "default",
  },
  proxy: proxy !== null ? proxy[REACT_APP_ENV || "dev"] : {},
});
