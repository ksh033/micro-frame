import React from 'react';
import { VdImgLinkState } from '../VdImgLink';

export const designWidth = 750;
export const baseWidth = 375;
export const viewWidth = 325;
export const deviceRatio = (viewWidth / baseWidth).toFixed(2);

export type TemplateMapItem = {
  rowSpan: number; // 基础行
  colSpan: number; // 基础列
  isCustom: boolean; // 是否动态计算高度
};

export type CompontentItem = VdImgLinkState & {
  x: number;
  y: number;
  width: number;
  height: number;
};
const baseTemplate = {
  rowSpan: 4,
  colSpan: 4,
  isCustom: false,
};

export const templateMap = {
  '0': {
    rowSpan: 2,
    colSpan: 1,
    isCustom: true,
  },
  '1': {
    rowSpan: 3,
    colSpan: 1,
    isCustom: true,
  },
  '2': {
    rowSpan: 4,
    colSpan: 1,
    isCustom: true,
  },
  '3': baseTemplate,
  '4': baseTemplate,
  '5': baseTemplate,
  '6': baseTemplate,
  '7': baseTemplate,
};
export type TemplateId = keyof typeof templateMap;

export const getDefaultTemplateCompontents = (
  template_id: TemplateId,
): CompontentItem[] => {
  let compontents: CompontentItem[] = [];
  const mapitem = templateMap[template_id];
  if (template_id === '0' || template_id === '1' || template_id === '2') {
    for (let i = 0; i < mapitem.rowSpan; i++) {
      compontents.push({
        x: i,
        y: 0,
        width: 1,
        height: 1,
      });
    }
  }
  if (template_id === '3') {
    const baseSpan = 2;
    for (let i = 0; i < mapitem.rowSpan / baseSpan; i++) {
      for (let j = 0; j < mapitem.rowSpan / baseSpan; j++) {
        compontents.push({
          x: i * baseSpan,
          y: j * baseSpan,
          width: 2,
          height: 2,
        });
      }
    }
  }
  if (template_id === '4') {
    compontents.push({
      x: 0,
      y: 0,
      width: 2,
      height: 4,
    });
    compontents.push({
      x: 2,
      y: 0,
      width: 2,
      height: 2,
    });
    compontents.push({
      x: 2,
      y: 2,
      width: 2,
      height: 2,
    });
  }
  if (template_id === '5') {
    compontents.push({
      x: 0,
      y: 0,
      width: 4,
      height: 2,
    });
    compontents.push({
      x: 0,
      y: 2,
      width: 2,
      height: 2,
    });
    compontents.push({
      x: 2,
      y: 2,
      width: 2,
      height: 2,
    });
  }
  if (template_id === '6') {
    compontents.push({
      x: 0,
      y: 0,
      width: 2,
      height: 4,
    });
    compontents.push({
      x: 2,
      y: 0,
      width: 2,
      height: 2,
    });
    compontents.push({
      x: 2,
      y: 2,
      width: 1,
      height: 2,
    });
    compontents.push({
      x: 3,
      y: 2,
      width: 1,
      height: 2,
    });
  }
  return compontents;
};

export const getInitArray = (width: number, height: number) => {
  return new Array(width).fill(0).map(() => {
    return new Array(height).fill(0);
  });
};
function G(e: number, t: number) {
  return e < t ? e : t;
}
function B(e: number, t: number) {
  return e > t ? e : t;
}

export function getListItemBymatrixData(matrixData: any[][]) {
  var t: number[][] = [];
  matrixData.forEach((e, rowIdx) => {
    e.forEach((key, colIdx) => {
      1 === key && t.push([+rowIdx, +colIdx]);
    });
  });
  console.log(t);

  let startRow = t[0][0];
  let startCol = t[0][1];
  let endRow = t[0][0];
  let endCol = t[0][1];

  t.forEach((e) => {
    startRow = G(startRow, e[0]);
    startCol = G(startCol, e[1]);
    endRow = B(endRow, e[0]);
    endCol = B(endCol, e[1]);
  });

  const pointStart = {
    row: startRow,
    col: startCol,
  };
  const pointEnd = {
    row: endRow,
    col: endCol,
  };

  const n = {
    width: Math.abs(pointStart.row - pointEnd.row) + 1,
    height: Math.abs(pointStart.col - pointEnd.col) + 1,
    origin: {
      row: pointStart.row < pointEnd.row ? pointStart.row : pointEnd.row,
      col: pointStart.col < pointEnd.col ? pointStart.col : pointEnd.col,
    },
  };

  return {
    image_id: '',
    image_url: '',
    image_thumb_url: '',
    image_width: '',
    image_height: '',
    link_id: '',
    link_type: '',
    link_title: '',
    link_url: '',
    width: n.width,
    height: n.height,
    x: n.origin.row,
    y: n.origin.col,
  };
}

export function formatMatrixData(val: any) {
  const sub_entry = val.sub_entry;
  const width = val.width;
  const height = val.height;
  const matrixData = getInitArray(width, height);
  if (sub_entry.length > 0) {
    sub_entry.forEach((it: any) => {
      const x = it.x;
      const y = it.y;
      const rowIdx = it.x + it.width;
      const colIdx = it.y + it.height;
      for (let i = x; i < rowIdx; i++) {
        for (var c = y; c < colIdx; c++) {
          matrixData[i][c] = 2;
        }
      }
    });
  }
  return matrixData;
}
