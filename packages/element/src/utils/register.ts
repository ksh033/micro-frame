export const cmps: Record<string, any> = {};

export type CmpType = keyof typeof cmps;

export const regEditCmp = (cmpTye: string, cmp: any) => {
  if (cmps[cmpTye]) {
    //  console.log("组件已存在")
    return;
  }
  cmps[cmpTye] = cmp;
};
export const regeditCmp = regEditCmp;
