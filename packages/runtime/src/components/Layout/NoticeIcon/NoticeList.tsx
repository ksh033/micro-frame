import { Avatar, Button, List, Tag } from "antd";
import React from "react";
import classNames from "classnames";
import styles from "./NoticeList.less";

export type NoticeIconTabProps = {
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: any;
  onClick?: (item: any) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: any[];
  onViewMore?: (e: any) => void;
  onRefresh?: () => void;
  loading?: boolean;
};
const NoticeList: React.FC<NoticeIconTabProps> = ({
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
  loading = false,
  onRefresh,
}) => {
  if (!list || list.length === 0) {
    return (
      <div>
        <div className={styles.notFound}>
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            alt="not found"
          />
          <div>{emptyText}</div>
          <div>
            <Button
              onClick={onRefresh}
              type="link"
              key="refresh"
              loading={loading}
              style={{ width: "100%" }}
            >
              刷新
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <List<any>
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });

          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => {
                onClick?.(item);
              }}
            >
              <List.Item.Meta
                className={styles.meta}
                title={
                  <div className={styles.title}>
                    {item.todoTitle}
                    <div className={styles.extra}>
                      <Tag
                        color="red"
                        style={{
                          marginRight: 0,
                        }}
                      >
                        待办：{Number(item.todoNumber || 0)}
                      </Tag>
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className={styles.bottomBar}>
        <Button
          onClick={onRefresh}
          type="link"
          key="refresh"
          loading={loading}
          style={{ width: "100%" }}
        >
          刷新
        </Button>
        {/* {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default NoticeList;
