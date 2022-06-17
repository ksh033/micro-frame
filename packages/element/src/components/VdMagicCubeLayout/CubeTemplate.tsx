import { useSetState, useUpdateEffect } from 'ahooks';
import { Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import VdFormItem from '../VdFormItem';
import classnames from 'classnames';
import {
  baseWidth,
  CompontentItem,
  designWidth,
  deviceRatio,
  formatMatrixData,
  getInitArray,
  getListItemBymatrixData,
} from './template';
import VdIcon from '../VdIcon';
import { MethodLength } from './index';

export type CustomTemplateProps = {
  list: CompontentItem[];
  setList: (val: CompontentItem[]) => void;
  density: number;
  setDensity: (val: number) => void;
  formItemName?: React.ReactNode;
  value: any;
  templateId: number;
  subEntryIndex: number;
  setSubEntryIndex: (idx: number) => void;
};

export type PointEv = {
  row?: number;
  col?: number;
};

export type ConfigState = {
  record: boolean;
  pointStart: PointEv;
  pointEnd: PointEv;
};

const CustomTemplate: React.FC<CustomTemplateProps> = (props) => {
  const {
    formItemName,
    density,
    setDensity,
    list = [],
    setList,
    value,
    templateId,
    subEntryIndex,
    setSubEntryIndex,
  } = props;

  const colWidth = (Number(deviceRatio) * (baseWidth / density)).toFixed(0);
  const designItemWidth = designWidth / density;

  const handleChange = (value: number) => {
    setDensity(value);
  };

  const configRef = useRef<ConfigState>({
    record: !1,
    pointStart: {},
    pointEnd: {},
  });

  const [state, setState] = useSetState({
    matrixData: getInitArray(density, density),
  });

  useEffect(() => {
    if (list.length > 0) {
      setState({
        matrixData: formatMatrixData(value),
      });
    } else {
      setState({
        matrixData: getInitArray(density, density),
      });
    }
  }, [JSON.stringify(value)]);

  const options = [
    { label: '4X4', value: 4 },
    { label: '5X5', value: 5 },
    { label: '6X6', value: 6 },
    { label: '7X7', value: 7 },
  ];

  const clearMatrix = (matrixData: any[][]) => {
    return matrixData.map((e) => {
      return e.map((key) => {
        return key === 1 ? 0 : key;
      });
    });
  };

  const handleChangeCube = (newList: CompontentItem[]) => {
    setSubEntryIndex(newList.length - 1);
    setList(newList);
  };

  const renderActiveCube = (type: string, clickEv: PointEv) => {
    let matrixData = JSON.parse(JSON.stringify(state.matrixData));
    const pointStart = configRef.current.pointStart;
    const minRowIdx: number = Math.min(
      Number(pointStart.row),
      Number(clickEv.row),
    );
    const maxRowIdx: number = Math.max(
      Number(pointStart.row),
      Number(clickEv.row),
    );
    const minColIdx: number = Math.min(
      Number(pointStart.col),
      Number(clickEv.col),
    );
    const maxColIdx: number = Math.max(
      Number(pointStart.col),
      Number(clickEv.col),
    );
    if (type === 'hover') {
      matrixData = clearMatrix(matrixData);
    }
    for (let u = minRowIdx; u <= maxRowIdx; u++)
      for (let s = minColIdx; s <= maxColIdx; s++) {
        if (2 === matrixData[u][s]) {
          return;
        }
        matrixData[u][s] =
          'hover' === type
            ? 0 === matrixData[u][s]
              ? 1
              : matrixData[u][s]
            : 1 === matrixData[u][s]
            ? 2
            : 1;
      }
    setState({
      matrixData: matrixData,
    });
  };

  const handleSureClick = () => {
    const item = getListItemBymatrixData(state.matrixData);
    const newList = JSON.parse(JSON.stringify(list));
    newList.push(item);
    handleChangeCube(newList);
  };

  const handleClick = (rowidx: number, colidx: number) => {
    const config = configRef.current;
    if (config.record) {
      configRef.current = Object.assign({}, config, {
        pointStart: {
          row: rowidx,
          col: colidx,
        },
        record: !1,
      });
      handleSureClick();
      return;
    }
    configRef.current = Object.assign({}, config, {
      pointStart: {
        row: rowidx,
        col: colidx,
      },
      record: !0,
    });
    renderActiveCube('choose', {
      row: rowidx,
      col: colidx,
    });
  };

  const handleMouseOver = (rowidx: number, colidx: number) => {
    const config = configRef.current;
    if (config.record) {
      renderActiveCube('hover', {
        row: rowidx,
        col: colidx,
      });
    }

    configRef.current = Object.assign({}, configRef.current, {
      pointEnd: {
        row: rowidx,
        col: colidx,
      },
    });
  };
  const handleChangeSubEntryIndex = (index: number) => {
    setSubEntryIndex(index);
  };

  const getCubeSelectedText = (item: CompontentItem) => {
    if (templateId < 3) {
      return `宽度${Math.round(designItemWidth * item.width)}像素`;
    } else {
      return (
        <React.Fragment>
          <span>{`${Math.round(designItemWidth * item.width)}x${Math.round(
            designItemWidth * item.height,
          )}像素`}</span>
          <div>或同等比例</div>
        </React.Fragment>
      );
    }
  };

  const clearHoverMatrix = () => {
    let matrixData = JSON.parse(JSON.stringify(state.matrixData));

    matrixData = matrixData.map((e: any[]) => {
      return e.map((key) => {
        return key === 1 ? 0 : key;
      });
    });
    configRef.current = Object.assign({}, configRef.current, {
      record: !1,
    });
    setState({
      matrixData: matrixData,
    });
  };

  const handleDeleteSubEntry = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    const sub_entry = list;
    sub_entry.splice(Number(subEntryIndex), 1);

    setList(sub_entry);
    const newIndex = Number(subEntryIndex) >= 1 ? Number(subEntryIndex) - 1 : 0;
    setSubEntryIndex(newIndex);
  };
  const u = (325 - (templateId + 3)) / (templateId + 2);
  const customHeight = list.length > 0 && list[0].image_id && templateId <= 2;
  const imageHegiht =
    list.length > 0 &&
    list[0].image_id &&
    list[0].image_width &&
    list[0].image_height
      ? Math.floor((u / list[0]?.image_width) * list[0]?.image_height) + 'px'
      : Math.floor(u) + 'px';

  const getCubeSelectedStyle = (item: CompontentItem) => {
    return {
      width: Number(colWidth) * item.width + 'px',
      height: customHeight
        ? imageHegiht
        : Number(colWidth) * item.height + 'px',
      top: item.y * Number(colWidth) + 'px',
      left: item.x * Number(colWidth) + 'px',
    };
  };

  return (
    <div className="vd-magicCube-layout">
      {templateId === MethodLength ? (
        <div className="vd-cube-density">
          <div className="vd-cube-density-header">魔方密度</div>
          <div className="vd-cube-density-content">
            <Select
              style={{ width: '100%' }}
              onChange={handleChange}
              options={options}
              value={density}
            ></Select>
          </div>
        </div>
      ) : null}

      <VdFormItem
        formItem={{
          label: formItemName,
        }}
        block
      >
        <div className="vd-magicCube-layout">
          <div className="vd-magicCube-layout-help-desc">
            {templateId === MethodLength
              ? '移动鼠标选定布局区域大小'
              : '选定布局区域，在下方添加图片'.concat(
                  templateId < 3 ? '，建议添加比例一致的图片' : '',
                )}
          </div>
          <div className="vd-magicCube-group-content">
            <div className="vd-decorate-cube" onMouseLeave={clearHoverMatrix}>
              {state.matrixData.map((it, rowidx) => {
                return (
                  <ul className="cube-row" key={`ul-${rowidx}`}>
                    {it.map((colKey, colidx) => {
                      return (
                        <li
                          key={`ul-li-${colidx}`}
                          onClick={
                            colKey !== 2
                              ? (e) => {
                                  handleClick(rowidx, colidx);
                                }
                              : () => {}
                          }
                          onMouseEnter={() => {
                            handleMouseOver(rowidx, colidx);
                          }}
                          className={classnames({
                            'cube-item': true,
                            'item-selected': colKey === 2,
                            'item-selecting': colKey === 1,
                          })}
                          style={{
                            width: colWidth + 'px',
                            height: customHeight
                              ? imageHegiht
                              : colWidth + 'px',
                          }}
                        >
                          <span
                            className="plus-icon"
                            style={{
                              lineHeight: customHeight
                                ? imageHegiht
                                : colWidth + 'px',
                            }}
                          >
                            +
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                );
              })}

              {list.map((item, index) => {
                const width = Number(colWidth) * item.width;
                const height = Number(colWidth) * item.height;
                return (
                  <div
                    className={[
                      'cube-selected',
                      index === subEntryIndex ? 'cube-selected-click' : '',
                    ].join(' ')}
                    style={getCubeSelectedStyle(item)}
                    key={`cube-${index}`}
                    onClick={() => handleChangeSubEntryIndex(index)}
                  >
                    {item.image_id != null && item.image_id !== '' ? (
                      <img
                        alt="cubeImage"
                        src={item.image_url}
                        width={width + 'px'}
                        height={customHeight ? imageHegiht : height + 'px'}
                      ></img>
                    ) : (
                      <div
                        className="cube-selected-text"
                        key={`cube-text-${index}`}
                      >
                        {getCubeSelectedText(item)}
                      </div>
                    )}

                    {templateId === MethodLength && (
                      <VdIcon
                        type="vd-closecircle"
                        className="card-item-delete"
                        onClick={(e) => {
                          handleDeleteSubEntry(e);
                        }}
                      ></VdIcon>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </VdFormItem>
    </div>
  );
};

export default CustomTemplate;
