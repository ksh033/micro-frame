type initProps = {
  iframeEle: HTMLIFrameElement | null;
  dragEle?: HTMLElement | null;
  dropEle?: HTMLElement | null;
  dragItem?: HTMLCollectionOf<HTMLElement>;
  dropEleItems?: HTMLCollectionOf<HTMLElement>;
  callback?: (params: any) => void;
};

class Drag {
  iframeEle: HTMLIFrameElement | null = null;
  params: Omit<initProps, 'iframeEle'> = {};
  mouseOffsetBottom: number = 0;
  mouseOffsetRight: number = 0;
  index = 0; //插入元素的下标
  type = 'add'; //操作类型

  init = (params: initProps) => {
    // console.log(params.iframeEle?.getBoundingClientRect());
    this.iframeEle = params.iframeEle;
    this.params = params;

    if (params.dragItem) {
      this.initDrag(params.dragItem);
    }
  };

  getIframe() {
    return this.iframeEle;
  }

  //初始化设置拖动元素
  initDrag = (dragItem: HTMLCollectionOf<HTMLElement>) => {
    const { length } = dragItem;
    let i = 0;
    while (i < length) {
      this.setDrag(dragItem[i]);
      i += 1;
    }
  };

  //拖动元素注册事件
  setDrag = (el: HTMLElement) => {
    el.setAttribute('draggable', 'true');
    el.ondragstart = this.dragStartEvent;
    el.ondrag = this.dragEvent;
    el.ondragend = this.dragEndEvent;
  };

  //获取iframe的位置
  getIframeOffset = () => {
    const iframeEle = this.getIframe();
    return iframeEle
      ? this.getRealOffset(iframeEle)
      : { offsetLeft: 0, offsetTop: 0 };
  };

  //递归计算元素距离父元素的offset
  getRealOffset = (el: any) => {
    if (el.getBoundingClientRect) {
      const { left, top } = el.getBoundingClientRect();
      return { offsetLeft: left, offsetTop: top };
    }
    return { offsetLeft: 0, offsetTop: 0 };
  };

  //获取元素位置
  getElOffset = (el: any) => {
    // 根据定位决定要不要加
    const { offsetTop: iframeTop } = this.getIframeOffset();
    const { offsetTop: targetOffsetTop } = this.getRealOffset(el);
    const targetOffset = targetOffsetTop + iframeTop;

    // const targetOffset = targetOffsetTop;
    return {
      midLine: (el.clientHeight || 0) / 2 + targetOffset,
      topLine: targetOffset,
      bottomLine: (el.clientHeight || 0) + targetOffset,
    };
  };

  //释放区内部元素位置
  getDropOffset = () => {
    const result = [];
    const { dropEleItems } = this.params;
    if (dropEleItems) {
      const el = dropEleItems;

      let i = 0;
      while (i < el.length) {
        const midLine = this.getElOffset(el[i]);
        result.push(midLine);
        i += 1;
      }
    }
    return result;
  };

  //位置比较
  locationCompare = (ev: any) => {
    let inside = false;
    const { dropEle } = this.params;
    // 拖动元素的位置
    const sourceRight = ev.clientX + this.mouseOffsetRight;
    const sourceLeft = sourceRight - ev.currentTarget.clientWidth;

    // const { offsetLeft: iframeLeft } = this.getIframeOffset();
    const { offsetLeft: targetLeft } = this.getRealOffset(dropEle);

    /*释放区的位置*/
    // const targetOffsetLeft = iframeLeft + targetLeft;
    const targetOffsetLeft = targetLeft;
    const targetOffsetRight = targetOffsetLeft + dropEle?.clientWidth;

    if (sourceRight > targetOffsetLeft && sourceLeft < targetOffsetRight) {
      //拖动到释放区
      inside = true;
    } else {
      //释放区外面
      inside = false;
    }
    return inside;
  };

  //插入占位元素
  insertPlaceholderEle = (sourceMidLine: number) => {
    //console.log('sourceMidLine', sourceMidLine);
    const dropOffset = this.getDropOffset(); //释放区的位置属性
    const insertEl = this.createElePlaceholder();
    const { dropEleItems, dropEle } = this.params;
    //console.log('dropOffset', dropOffset);
    if (dropEleItems && dropEle) {
      const dropEleChild = dropEleItems;
      const dropOffsetLength = dropOffset.length;

      if (dropOffset && dropOffset.length) {
        dropOffset.map((item, i) => {
          const Ele = dropEleChild[i];

          //在元素前面插入占位元素
          if (sourceMidLine > item.topLine && sourceMidLine < item.midLine) {
            this.index = i;
            this.type = 'insert';
            Ele.before(insertEl);
          }
          //在元素后面插入占位元素
          if (sourceMidLine < item.bottomLine && sourceMidLine > item.midLine) {
            this.index = i + 1;
            this.type = 'insert';
            Ele.after(insertEl);
          }
          //追加一个占位元素
          if (sourceMidLine > dropOffset[dropOffset.length - 1].bottomLine) {
            this.type = 'add';
            this.index = dropOffsetLength;
            dropEle.append(insertEl);
          }
          return item;
        });
      }
      //插入第一个占位元素（当iframe内部没有组件）
      if (!dropEleChild.length) {
        this.type = 'add';
        this.index = 0;
        dropEle.append(insertEl);
      }
    }
  };

  //创建占位元素
  createElePlaceholder = (() => {
    let ele: HTMLDivElement | null = null;
    return () => {
      if (!ele) {
        ele = document.createElement('div');
        ele.setAttribute('id', 'drag-ele-placeholder');
        ele.innerHTML = `<div style="width: 100%; height:50px; position: relative; font-size: 14px;">
            <div style="width: 150px; height: 40px; text-align: center; position: absolute;
            left: 0; right: 0; top: 0; bottom:0; margin: auto; background: #878; line-height: 40px; font-size: 14px;">放置组件</div>
          </div>`;
      }
      return ele;
    };
  })();

  //移除占位元素
  removePlaceholderEle = () => {
    const iframe = this.getIframe();
    if (iframe) {
      const doc = iframe.contentDocument;
      const removeEle = doc?.getElementById('drag-ele-placeholder');
      const { dropEle } = this.params;
      if (removeEle) {
        dropEle?.removeChild(removeEle);
      }
    }
  };
  /** 事件处理 ***** */
  dragStartEvent = (ev: any) => {
    // @ts-ignore
    // document.getElementsByClassName('drop-content')[0].style.zIndex = '-1';
    //获得鼠标距离拖拽元素的下边的距离
    this.mouseOffsetBottom = ev.currentTarget.clientHeight - ev.offsetY;
    //获得鼠标距离拖拽元素的右边的距离
    this.mouseOffsetRight = ev.currentTarget.clientWidth - ev.offsetX;
  };

  dragEvent = (ev: any) => {
    //获取拖拽元素中线距离屏幕上方的距离
    const sourceMidLine =
      ev.clientY + this.mouseOffsetBottom - ev.currentTarget.clientHeight / 2;
    if (this.locationCompare(ev)) {
      this.insertPlaceholderEle(sourceMidLine);
      // console.log('释放区内部')
    } else {
      this.removePlaceholderEle();
      // console.log('释放区外面')
    }
  };

  dragEndEvent = (ev: any) => {
    ev.preventDefault();
    const dataset = ev.target.dataset;
    // @ts-ignore
    document.getElementsByClassName('drop-content')[0].style.zIndex = '0';
    const { callback } = this.params;
    this.locationCompare(ev) &&
      callback &&
      callback({
        type: this.type,
        index: this.index,
        cmpKey: dataset.key,
      });
  };
}

export default new Drag();
