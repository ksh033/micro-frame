/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yangyuhang
 * @Date: 2023-10-17 09:52:17
 * @LastEditors: yangyuhang
 * @LastEditTime: 2023-10-17 09:52:33
 */
import { readdirSync } from 'fs';
import { join } from 'path';
const { REACT_APP_ENV, NODE_ENV } = process.env;

// utils must build before core
// runtime must build before renderer-react
// components dependencies order: form -> table -> list
const headPkgs: string[] = [];
const tailPkgs = readdirSync(join(__dirname, 'packages')).filter(
  (pkg) => pkg.charAt(0) !== '.' && !headPkgs.includes(pkg)
);
export default {
  cjs: { type: 'babel', lazy: true },
  esm: {
    type: 'babel',
    importLibToEs: true,
  },
  pkgs: ['slave', 'runtime', 'plugin-microlayout'],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      REACT_APP_ENV !== ''
        ? {
          libraryName: '@scboson/sc-element',
          libraryDirectory: 'es',
          style: true,
        }
        : [
          { libraryName: 'antd', libraryDirectory: 'es', style: true },
          {
            libraryName: '@scboson/sc-element',
            libraryDirectory: 'es',
            style: true,
          },
        ],
      'antd',
    ],
    [require('./scripts/replaceLib')],
  ],
};
