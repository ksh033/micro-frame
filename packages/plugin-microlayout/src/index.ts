import { IApi, utils } from "umi";
import getPkg from "umi/lib/utils/getPkg";
import { join } from "path";
// import * as allIcons from '@ant-design/icons';
import { readFileSync, copyFileSync, statSync } from "fs";
import { LayoutConfig } from "./types/interface";
import getLayoutContent from "./utils/getLayoutContent";
const DIR_NAME = "plugin-microlayout";

const { NODE_ENV } = process.env;

function toHump(name: string) {
  return name.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

export default (api: IApi) => {
  api.describe({
    key: "microlayout",
    config: {
      schema(joi) {
        return joi.object();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });
  api.addRuntimePlugin(() => "../plugin-microlayout/runtime");

  api.addDepInfo(() => {
    const pkg = require("../package.json");
    return [
      {
        name: "@micro-frame/sc-runtime",
        range: pkg.dependencies["@micro-frame/sc-runtime"],
      },
    ];
  });

  let generatedOnce = false;
  api.onGenerateFiles(() => {
    if (generatedOnce) return;
    generatedOnce = true;
    const pkg = getPkg("");
    const appCode = pkg.name.replace("micor-", "");

    const cwd = join(__dirname, "../src");
    const files = utils.glob.sync("**/*", {
      cwd,
    });
    const base = join(api.paths.absTmpPath!, "plugin-microlayout", "layout");
    utils.mkdirp.sync(base);
    files.forEach((file) => {
      if (["index.ts", "runtime.tsx.tpl"].includes(file)) return;
      const source = join(cwd, file);
      const target = join(base, file);
      if (statSync(source).isDirectory()) {
        utils.mkdirp.sync(target);
      } else {
        copyFileSync(source, target);
      }
    });

    var obj = {
      appCode: "",
    };
    api.writeTmpFile({
      path: "plugin-microlayout/runtime.tsx",
      content: utils.Mustache.render(
        readFileSync(join(__dirname, "runtime.tsx.tpl"), "utf-8"),
        obj
      ),
    });
  });

  api.modifyDefaultConfig((config) => {
    // @ts-ignore
    config.title = false;
    return config;
  });

  let layoutOpts: LayoutConfig = {};

  api.onGenerateFiles(() => {
    // apply default options
    const { name } = api.pkg;
    layoutOpts = {
      // name,
      // theme: 'PRO',
      // locale: false,
      // showBreadcrumb: true,
      ...(api.config.microlayout || {}),
    };

    // allow custom theme
    let layoutComponent = {
      // 如果 ProLayout 没有安装会提供一个报错和一个空的 layout 组件
      PRO: "./layout/layout/index.tsx",
    };
    if (layoutOpts.layoutComponent) {
      layoutComponent = Object.assign(
        layoutOpts.layoutComponent,
        layoutComponent
      );
    }

    const theme = (layoutOpts.theme && layoutOpts.theme.toUpperCase()) || "PRO";
    const currentLayoutComponentPath =
      layoutComponent[theme] || layoutComponent["PRO"];

    api.writeTmpFile({
      path: join(DIR_NAME, "Layout.tsx"),
      content: getLayoutContent(layoutOpts, currentLayoutComponentPath),
    });
  });
  console.log("NODE_ENV:" + NODE_ENV);
  if (NODE_ENV === "development") {
    api.modifyRoutes((routes) => {
      return [
        {
          path: "/",
          component: utils.winPath(
            join(api.paths.absTmpPath || "", DIR_NAME, "Layout.tsx")
          ),
          routes,
        },
      ];
    });
  }

  //api.addRuntimePlugin(() => ['@@/plugin-layout/runtime.tsx']);
};
