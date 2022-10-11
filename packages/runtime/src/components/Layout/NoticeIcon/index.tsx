import { useEffect, useState } from 'react';
import { Tag, message } from 'antd';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import { uesRequest } from '../../../utils/api';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const NoticeIconView: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);

  const todoList = uesRequest('user', 'todoList');

  const getTodoList = (isRefresh: boolean) => {
    todoList.run().then((res) => {
      if (Array.isArray(res)) {
        setNotices(res);
        if (isRefresh) {
          message.success('刷新成功');
        }
      }
    });
  };

  const goUrl = (item) => {
    if (item.todoListUrl) {
      window.location.href = item.todoListUrl;
    }
  };

  const changeReadState = (id: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.id === id) {
          notice.read = true;
        }
        return notice;
      })
    );
  };

  const clearReadState = (title: string, key: string) => {
    setNotices(
      notices.map((item) => {
        const notice = { ...item };
        if (notice.type === key) {
          notice.read = true;
        }
        return notice;
      })
    );
    message.success(`${'清空了'} ${title}`);
  };

  useEffect(() => {
    getTodoList(false);
  }, []);

  return (
    <NoticeIcon
      className={styles.action}
      count={notices.length}
      onItemClick={(item) => {
        goUrl(item);
      }}
      onClear={(title: string, key: string) => clearReadState(title, key)}
      loading={false}
      clearText="清空"
      viewMoreText="查看更多"
      onViewMore={() => message.info('Click on view more')}
      clearClose
    >
      <NoticeIcon.Tab
        key="event"
        tabKey="event"
        title="待办"
        emptyText="你已完成所有待办"
        count={notices.length}
        list={notices}
        onRefresh={() => {
          getTodoList(true);
        }}
        showViewMore
        loading={todoList.loading}
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
