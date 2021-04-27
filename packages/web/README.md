# @@scboson/sc-web

> @@scboson/sc-web.

1. tsconfig.json 底下paths 添加 "@@service": ["src/services/index.ts"],

``` bash
{
  compilerOptions: {
    paths: {
      "@@service": ["src/services/index.ts"],
    }
  }
}
```

2. umi 配置项中 alias 低下添加services的地址

``` bash
 alias : {
    '@@service': '@/services',
  },
```

  

## Install

Using npm:

``` bash
$ npm install --save @@scboson/sc-web
```

or using yarn:

``` bash
$ yarn add @@scboson/sc-web
```
