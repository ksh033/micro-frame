/* eslint-disable import/no-unresolved */
import { MenuDataItem } from "@scboson/sc-layout";
import React from "react";

export const getRouterData = (routerConfig: any[],basename) => {
  let routerData = {};
  routerConfig.forEach((item) => {
    const { exact, path } = item;
    const router = {
      exact,
      path,
    };
    if (item.routes) {
      routerData = { ...routerData, ...getRouterData(item.routes,basename) };
    }
    
    routerData[`${basename}/${path}`] = router;
  });
  return routerData;
};
function getMenuMap(menu: any[], routes: any,basename): any[] {
  const routersMap = {};
  const menuMap = {};

 //const _routerMap = getRouterData(routes,basename);
//console.log("_routerMap",_routerMap)
  const getAllRoute = (_menu: any) => {
    _menu.forEach((item: any) => {
      const syscode=`${item["syscode"]}`;
      const funcodes=`${item["funcodes"]}`;
      if (funcodes){
        
      }
      if (item["key"]) {
        const mapkey = `${item["key"]}`;
        if (!menuMap[syscode]){
          menuMap[syscode]={}
        }
        menuMap[syscode][mapkey.toLowerCase()]=item
      //  menuMap.get(syscode).set(mapkey.toLowerCase(),item)
        //menuMap.set(syscode+'_'+mapkey.toLowerCase(), item);
      }

      if (item["path"]) {
        if (!routersMap[syscode]){
          routersMap[syscode]={}
        }
        const mapkey = item["path"];
     
     
        if (funcodes){

          const list=funcodes.split("|")

          if (list.includes("ADD")|| list.includes("EDIT")|| list.includes("READ")|| list.includes("DISPOSE")|| list.includes("AUDIT")|| list.includes("RECHECK")){
            const dy = `${mapkey}/:editpage`;
            routersMap[syscode][dy.toLowerCase()]=item

          }

        }
        if (syscode==="bisys"){
         // console.log("path",item["path"])
         // console.log("getMenuMap",routersMap[syscode])
        }
        routersMap[syscode][mapkey.toLowerCase()]=item
      
      }
      if (item.children && item.children.length > 0) {
        getAllRoute(item.children);
      }
    });
  };
  getAllRoute(menu);
  return [routersMap, menuMap];
}

function getBreadcrumb(code: any, menuMap: Map<string, any>) {
  let routes: any = [];
  const menuItem = menuMap.get(`${code}`);
  if (menuItem) {
    if (`${menuItem.pkey}` !== "0") {
      routes = [...getBreadcrumb(`${menuItem.pkey}`, menuMap), menuItem];
    } else {
      routes = [menuItem];
    }
  }
  return routes;
}
const menuMap = {};
const formatMenu = (
  menus: any[],
  parnetKeys: string[],
  syscode: string,
  localData
) => {
  // const {routersMap, menuMap }=getMenuMap(menus,[]);

  return menus.map<any>((item: any) => {
    const {
      iconUrl,
      id,
      parentId,
      pageUrl,
      //  permCode,
      isApp,
      systemCode,
      functionName,
      //functionType,
      dataType,
      children,
    } = item;

    const funcodes: any[] = [];
    let currentSysCode=systemCode||syscode
    let newChildren: MenuDataItem[] = [];
    if (children && children.length > 0) {
      const pKeys = [...parnetKeys, id];
    
        newChildren = formatMenu(children, pKeys,currentSysCode , localData);
   
   

      children.forEach((citem: any) => {
        if (citem.functionType) {
          funcodes.push(citem.functionType);
        }
      });
    }
    if (parnetKeys.length > 0 && pageUrl) {
      const paths = pageUrl.split("/");
      parnetKeys.forEach((key, i) => {
        if (!menuMap[key]) {
          if (localData === false) {
            menuMap[key] = paths[i + 2];
          } else {
            menuMap[key] = paths[i + 1];
          }
        }
      });
    }
    let hiddenChild = true;
    newChildren.forEach((nitem: any) => {
      if (!nitem.hidden) {
        hiddenChild = false;
      }
    });

    // const defaultPath = defPaths[menuCode];
    let rpath: string = "";
    //if (appCode && appCode !== '') {
    //rpath = '/' + appCode + pageUrl || menuMap[id]
    // } else {
    rpath = pageUrl || ""; //|| menuMap[id]
    // }
    if (localData === false && rpath) {
      const tem = rpath.split("/");
      if (tem.length >= 2) {
        tem.splice(1, 1);
        rpath = tem.join("/");
      }
    }
if (rpath.lastIndexOf("/")===rpath.length-1){
  rpath=rpath.substring(0,rpath.length-1)
}
   
    // newChildren=newChildren.filter((i)=>(i))
    return {
      name: functionName,
      // defaultPath,
      key: `${id}`,
      pkey: parentId,
      path: rpath,
      funcodes: funcodes.join("|"),
      icon: iconUrl,
      parentKeys: parnetKeys,
      pageUrl,
      // id,
      syscode: currentSysCode,
      children: newChildren,
      isApp:isApp,
      routes: newChildren,
      hideChildrenInMenu: hiddenChild,
      hideInMenu: dataType === "FUNC",
    };
  });
};
export default {
  getMenuMap,
  getBreadcrumb,
  formatMenu,
};
