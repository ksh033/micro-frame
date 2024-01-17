import { IApi } from "umi";
import getPkg from "./getPkg";
import { lodash, Mustache, winPath, glob, fsExtra } from "umi/plugin-utils";
import { basename, dirname, join, relative } from "path";
// import * as allIcons from '@ant-design/icons';
//import { readFileSync, copyFileSync, statSync } from "fs";
import { LayoutConfig } from "./types/interface";
import getLayoutContent from "./utils/getLayoutContent";
import getSlaveLayoutContent from "./utils/getSlaveLayoutContent";
import { existsSync, readdirSync } from "fs";

import { getModuleExports } from "./getModuleExports";

const DIR_NAME = "plugin-microlayout";

const { NODE_ENV } = process.env;

function toHump(name: string) {
  return name.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}
function withTmpPath(opts: { api: IApi; path: string; noPluginDir?: boolean }) {
  return winPath(
    join(
      opts.api.paths.absTmpPath,
      opts.api.plugin.key && !opts.noPluginDir
        ? `plugin-${opts.api.plugin.key}`
        : "",
      opts.path
    )
  );
}

export default (api: IApi) => {

  api.describe({
    key: "microlayout",
    config: {
      schema(joi) {
        return joi
          .alternatives()
          .try(joi.object(), joi.boolean().invalid(true));
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });
  const packageName = getPkg("").name;
  let generatedOnce = false;
  let layoutOpts: LayoutConfig = {};
  const initConfig = (config) => {
    layoutOpts = {
      // name,
      // theme: 'PRO',
      // locale: false,
      // showBreadcrumb: true,
      useRunTime: true,
      useAccess: true,
      localMenuData: true,
      localLayout: true,
      ...(config.microlayout || {}),
    };
    if (NODE_ENV === "production" || layoutOpts.localMenuData === false) {
      layoutOpts.menuData = undefined;
      layoutOpts.localMenuData = false;
    }
    if (NODE_ENV === "production" || layoutOpts.localLayout === false) {
      layoutOpts.localLayout = false;
    }
    //micro-basic
    if (NODE_ENV !== "production") {
      let base = "/";
      if (!layoutOpts.localMenuData) {
        if (packageName.indexOf("micro-") > -1) {
          base = "/" + packageName.replace("micro-", "");
        }
      }

      if (!layoutOpts.localLayout) {
        config.publicPath = base
        config.publicPath = `/${packageName}/`
      }
    }




  };
  initConfig(api.userConfig);
  // api.modifyConfig((memo, { paths }) => {

  //  if (!layoutOpts.localLayout){}
  //   // memo.alias = {
  //   //   ...memo.alias,
  //   //   '@': paths.absSrcPath
  //   // }
  //   return memo;
  // })
  api.onStart(() => {
    initConfig(api.config);
    // do something
  });
  function checkMembers(opts: {
    path: string;
    members: string[];
    exportMembers: string[];
  }) {
    const conflicts = lodash.intersection(opts.exportMembers, opts.members);
    if (conflicts.length) {
      throw new Error(
        `Conflict members: ${conflicts.join(", ")} in ${opts.path}`
      );
    }
  }
  //映射@@service
  api.modifyTSConfig((memo: any) => {

    memo.compilerOptions.paths['@@service'] = ["src/services/index.ts"];
    return memo;


  })
  api.modifyConfig((config) => {
    // @ts-ignore
    config.title = false;
    initConfig(config);
    return config;
  });
  async function getExportsAndCheck(opts: {
    path: string;
    exportMembers: string[];
  }) {
    const members = (await getModuleExports({ file: opts.path })) as string[];
    checkMembers({
      members,
      exportMembers: opts.exportMembers,
      path: opts.path,
    });
    opts.exportMembers.push(...members);
    return members;
  }
  api.onGenerateFiles(async () => {
    // if (generatedOnce) return;
    //generatedOnce = true;
    const pkg = getPkg("");
    const appCode = pkg.name.replace("micor-", "");

    const cwd = join(__dirname, "../src");
    const files = glob.sync("**/*", {
      cwd,
    });
    const base = join(api.paths.absTmpPath!, "plugin-microlayout");
    fsExtra.mkdirSync(base, { recursive: true });
    files.forEach((file) => {
      if (
        ["index.ts", "runtime.tsx.tpl", "getCwd.ts", "getPkg.ts"].includes(file)
      )
        return;
      const source = join(cwd, file);
      const target = join(base, file);
      if (fsExtra.statSync(source).isDirectory()) {
        fsExtra.mkdirSync(target, { recursive: true });
      } else {
        fsExtra.copyFileSync(source, target);
      }
    });

    var obj = {
      appCode: "",
    };

    api.writeTmpFile({
      path: "runtime.tsx",
      content: Mustache.render(
        fsExtra.readFileSync(join(__dirname, "runtime.tsx.tpl"), "utf-8"),
        layoutOpts
      ),
    });

    // allow custom theme
    let layoutComponent = {
      // 如果 ProLayout 没有安装会提供一个报错和一个空的 layout 组件
      PRO: "./layout/index.tsx",
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
    console.log(currentLayoutComponentPath);
    //   if (!layoutOpts.localLayout){
    api.writeTmpFile({
      path: "Layout.tsx",
      content: getLayoutContent(layoutOpts, "./layout/index.tsx"),
    });
    api.writeTmpFile({
      path: "SlaveLayout.tsx",
      content: getSlaveLayoutContent(layoutOpts, "./layout/SlaveLayout.tsx"),
    });

    let rendereReactPath = "";
    // const model = require("module");
    // const projectM = model.createRequire(api.paths.cwd);
    try {
      rendereReactPath = require.resolve("@umijs/renderer-react/package.json", { paths: [api.cwd] }) || require.resolve("@umijs/renderer-react/package.json")
      // const presetUmiPath = projectM.resolve("@umijs/preset-umi");
      // const presetUmi = model.createRequire(presetUmiPath);
      // rendereReactPath = presetUmi.resolve(
      //   "@umijs/renderer-react/package.json"
      // );
    } catch (ex) {
      //rendereReactPath = projectM.resolve("@umijs/renderer-react/package.json");
    }

    const rendererPath = winPath(
      await api.applyPlugins({
        key: "modifyRendererPath",
        initialValue: dirname(rendereReactPath),
      })
    );

    const exports: any[] = [];
    const exportMembers = ["default"];
    exports.push("// @umijs/renderer-*");
    exports.push(
      `export { ${(
        await getExportsAndCheck({
          path: join(rendererPath, "dist/index.js"),
          exportMembers,
        })
      ).join(", ")} } from '${rendererPath}';`
    );

    // @@/core/history.ts
    exports.push(`export { history, createHistory } from '@@/core/history';`);
    // plugins
    exports.push("// plugins");
    const allPlugins = readdirSync(api.paths.absTmpPath).filter(
      (file) =>
        file.startsWith("plugin-") &&
        file !== "plugin-microlayout" &&
        file !== "plugin-locale"
    );
    const plugins = allPlugins.filter((file: any) => {
      if (
        existsSync(join(api.paths.absTmpPath, file, "index.ts")) ||
        existsSync(join(api.paths.absTmpPath, file, "index.tsx"))
      ) {
        return true;
      }
      return false;
    });
    for (const plugin of plugins) {
      let file: string;
      if (existsSync(join(api.paths.absTmpPath, plugin, "index.ts"))) {
        file = join(api.paths.absTmpPath, plugin, "index.ts");
      }
      if (existsSync(join(api.paths.absTmpPath, plugin, "index.tsx"))) {
        file = join(api.paths.absTmpPath, plugin, "index.tsx");
      }
      const pluginExports = await getExportsAndCheck({
        path: file!,
        exportMembers,
      });

      if (pluginExports.length) {
        exports.push(
          `export { ${pluginExports.join(", ")} } from '${winPath(
            join(api.paths.absTmpPath, plugin)
          )}';`
        );
        if (plugin === "plugin-qiankun-slave") {
          exports.push(
            `export {setModelState } from '${winPath(
              join(api.paths.absTmpPath, plugin, "/qiankunModel")
            )}';`
          );
        }
      }
    }
    api.writeTmpFile({
      path: "umi.ts",
      content: exports.join("\n"),
    });
  });

  api.modifyAppData((memo) => {
    memo.globalLoading = withTmpPath({ api, path: './layout/Loading.tsx' })
    return memo;
  })

  api.modifyRoutes((memo) => {
    Object.keys(memo).forEach((id) => {
      const route = memo[id];

      const regex = /\[(.+?)\]/g;
      //const matchs = route.path.match(regex)
      if (regex.test(route.path)) {
        route.path = route.path.replaceAll("[", ":").replaceAll("]", "");
      }
    });
    if (!memo["404"]) {
      //@ts-ignore
      memo["404"] = {
        path: "*",
        id: "404"
      }

    }
    memo["404"].parentId = "layout"
    memo["404"].file = withTmpPath({ api, path: './layout/NoFoundPage.tsx' });
    return memo;
  });
  if (layoutOpts.useRunTime) {
    api.addRuntimePlugin(() => "../plugin-microlayout/runtime");
    api.addRuntimePluginKey(() => ["microlayout"]);
    if (layoutOpts.localLayout) {
      api.addLayouts(() => {
        return [
          {
            id: "layout",
            file: withTmpPath({ api, path: "Layout.tsx" }),
            test: (route: any) => {
              return route.layout !== false;
            },
          },
        ];
      });
    } else {
      const runtimePath = winPath(
        dirname(require.resolve('@micro-frame/sc-runtime')),
      );

      // console.log("runtimePath",runtimePath)
      // const layoutPath = join(runtimePath.replace("/lib",""), './es/components/Layout/SlaveLayout');
      // console.log("layoutPath",layoutPath)
      api.addLayouts(() => {

        return [
          {
            id: "layout",
            file: withTmpPath({ api, path: 'SlaveLayout.tsx' }),
            // file: `(async () => {
            //   const { SlaveLayout } = await import('@micro-frame/sc-runtime');
            //   const { connectMaster } = await import('@@/plugin-qiankun-slave');
            //  return connectMaster(SlaveLayout)
            // })()`,
            test: (route: any) => {
              return route.layout !== false;
            },
          },
        ];
      });

    }
  }
};
