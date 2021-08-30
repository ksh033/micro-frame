// https://umijs.org/config/
//import { layout } from '@/app';
import { defineConfig } from "umi";
import getPkg from "umi/lib/utils/getPkg";
import getCwd from "umi/lib/utils/getCwd";
import { BabelRegister, compatESModuleRequire } from "@umijs/utils";
import { join } from "path";
import { existsSync } from "fs";

// import proxy from './proxy'
import slash from "slash2";
const packageName = getPkg("").name;

// const { REACT_APP_ENV } = process.env;
const { REACT_APP_ENV, NODE_ENV } = process.env;
let proxy = null;
try {
  const path = join(getCwd(), "config/proxy.ts");
  if (existsSync(path)) {
    const reg = new BabelRegister();
    reg.setOnlyMap({ key: "proxy", value: [path] });
    reg.register();
  }
  proxy = compatESModuleRequire(require(path));
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
    imgUrl: "https://test.bogengkeji.com/images",
    apiUrl: "/webapi-dev",
  },
  pro: {
    imgUrl: "https://images.bogengkeji.com",
    apiUrl: "/webapi",
  },
  test: {
    imgUrl: "https://test.bogengkeji.com/images",
    apiUrl: "/webapi-test",
  },
};
//micro-basic
let base = "/";
if (packageName.indexOf("micro-") > -1) {
  base = "/" + packageName.replace("micro-", "");
}
const publicPath=  NODE_ENV === "production"?packageName + "/":base+"/"

export default defineConfig({
  hash: true,
  antd: {},
  locale: {
    default: "zh-CN",
    antd: true,
  },
  devtool: REACT_APP_ENV == "pro" ? false : "source-map",
  define: {
    SC_GLOBAL_API_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].apiUrl,
    SC_GLOBAL_IMG_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].imgUrl,
  },
  base: base,
  publicPath,
  alias: {
    "@@service": "@/services",
  },
  dynamicImport:{

    loading:"@micro-frame/sc-runtime/es/components/Loading"
   },
  qiankun: {
    slave: {},
  },
  targets: {
    ie: 11,
  },
  esbuild: {},
  ignoreMomentLocale: true,
  mock: {},
  // externals:
  //   NODE_ENV === "production"
  //     ? {
  //         react: "React",
  //         "react-dom": "ReactDOM",
  //         lodash: "_",
  //         moment: "moment",
  //         "@ant-design/icons": "icons",
  //       }
  //     : false,
  microlayout: {
    localMenu: true,
    localLayout: true,
  },
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
  chunks:["antd","antdesign","framework","umi"],
  chainWebpack: (chainConfig) => {


    //处理静态文件
    chainConfig.module.rule('images').use("url-loader").tap((options)=>{
      options.fallback.options.publicPath=publicPath;
      return options

    })
    chainConfig.module.rule('fonts').use("file-loader").tap((options)=>{
      options.publicPath=publicPath;
      return options
    })
    chainConfig.module.rule('svg').use("file-loader").tap((options)=>{
      options.publicPath=publicPath;
      return options

    })
    chainConfig.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: "async",
          minSize: 30000,
          minChunks: 1,
          maxInitialRequests: 4, // 默认
          automaticNameDelimiter: ".",
          cacheGroups: {
            vendors: {
              // 基本框架
              name: "framework",
              test: /[\\/]node_modules[\\/](@micro-frame|@scboson)[\\/]/,
              chunks: "all",
              priority: 11,
            },

            antdesign: {
              name: "antdesign",
              chunks: "all",
              test: /[\\/]node_modules[\\/](@ant-design)[\\/]/,
              priority: 10,
            },
            antd: {
              name: "antd",
              chunks: "all",
              test: /[\\/]node_modules[\\/](antd)[\\/]/,
              priority: 9,
            },
          
          },
        },
      },
    });
    chainConfig
      .plugin("replace")
      .use(require("webpack").ContextReplacementPlugin)
      .tap(() => {
        return [/moment[/\\]locale$/, /zh-cn/];
      });
  },
  plugins: [
    "@micro-frame/plugin-microlayout",
    "@umijs/plugin-esbuild",
    "@umijs/plugin-model",
    "@umijs/plugin-antd",
    "@umijs/plugin-qiankun",
    "@umijs/plugin-locale",
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
  proxy: proxy !== null ? proxy[REACT_APP_ENV || "dev"] : {},
});
