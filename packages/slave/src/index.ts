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
    imgUrl: "http://test.bogengkeji.com/images",
    apiUrl: "/webapi-dev",
  },
  pro: {
    imgUrl: "https://images.bogengkeji.com/",
    apiUrl: "/webapi",
  },
  test: {
    imgUrl: "http://test.bogengkeji.com/images",
    apiUrl: "/webapi-test",
  },
};
//micro-basic
let base = "/";
if (packageName.indexOf("micro-") > -1) {
  base = "/" + packageName.replace("micro-","") + "/";
}

export default defineConfig({
  hash: true,
  antd: {},
  devtool:REACT_APP_ENV=="test"?false:'cheap-module-source-map',
  define: {
    SC_GLOBAL_API_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].apiUrl,
    SC_GLOBAL_IMG_URL: EVN_CONFIG[REACT_APP_ENV || "dev"].imgUrl,
  },
  base: NODE_ENV === "development" ? base : '/',
  publicPath: NODE_ENV === "development" ? base :"/" ,
  locale: false,
  alias: {
    "@@service": "@/services",
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
  externals:
    NODE_ENV === "production"
      ? {
          react: "Window.React",
          "react-dom": "Window.ReactDOM",
          //antd: "antd",
         // moment: "moment",
        }
      : false,
  microlayout: NODE_ENV === "production" ? false : {},
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
  plugins: ["@micro-frame/plugin-microlayout"],
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
