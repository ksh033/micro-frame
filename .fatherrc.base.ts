import { defineConfig } from "father";

export default defineConfig({
  // 以下为 esm 配置项启用时的默认值，有自定义需求时才需配置
  esm: {
    input: "src", // 默认编译目录
    output: "es",
    extraBabelPlugins: [[require.resolve("./scripts/replaceLib"), {}],  [
      require.resolve("babel-plugin-import"),
      {
        libraryName: "@scboson/sc-element",
        libraryDirectory: "es",
        style: true,
      },
    ]],
    platform: "browser", // 默认构建为 Browser 环境的产物
    transformer: "babel", // 默认使用 babel 以提供更好的兼容性
  },
  // 以下为 cjs 配置项启用时的默认值，有自定义需求时才需配置
  cjs: {
    extraBabelPlugins: [[require.resolve("./scripts/replaceEs"), {}],  [
      require.resolve("babel-plugin-import"),
      {
        libraryName: "@scboson/sc-element",
        libraryDirectory: "es",
        style: true,
      },
    ]],
    input: "src", // 默认编译目录
    output: "lib",
    platform: "browser", // 默认构建为 Node.js 环境的产物
    transformer: "babel", // 默认使用 esbuild 以获得更快的构建速度
  },
  alias: {
    "@@service": "@@service",
    "@@/core/history": "@@/core/history"
  }
});
