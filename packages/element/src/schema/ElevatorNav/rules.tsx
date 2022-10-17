const textRule: any = {
  type: 'object',
  validator(_: any, value: any, callback: (arg0?: string | undefined) => void) {
    console.log(value);
    if (value != null && Array.isArray(value) && value.length > 0) {
      let nolink = false;
      let noTitle = false;
      value.forEach((it: any) => {
        if (it['position_component'] == null && nolink === false) {
          nolink = true;
        }
        if ((it['title'] == null || it['title'] == '') && noTitle === false) {
          noTitle = true;
        }
      });
      if (nolink) {
        callback('请选择定位组件');
      }
      if (noTitle) {
        callback('标签不能为空');
      }
    }
    callback();
  },
};

const textImageRule: any = {
  type: 'object',
  validator(_: any, value: any, callback: (arg0?: string | undefined) => void) {
    if (value != null && Array.isArray(value) && value.length > 0) {
      let noImage = false;
      let nolink = false;
      value.forEach((it: any) => {
        if (it['image_url'] == null && noImage === false) {
          noImage = true;
        }
        if (it['position_component'] == null && nolink === false) {
          nolink = true;
        }
      });
      if (noImage) {
        callback('请选择图片');
      }
      if (nolink) {
        callback('请选择定位组件');
      }
    }
    callback();
  },
};

const imageRule: any = {
  type: 'object',
  validator(_: any, value: any, callback: (arg0?: string | undefined) => void) {
    if (value != null && Array.isArray(value) && value.length > 0) {
      console.log(12);
      let noImage = false;
      let noLink = false;
      let noCmp = false;
      value.forEach((it: any) => {
        if (it['image_url'] == null && noImage === false) {
          noImage = true;
        }
        if (Boolean(it['use_link'])) {
          if (it['link_url'] == null && noLink === false) {
            noLink = true;
          }
        } else {
          if (it['position_component'] == null && noCmp === false) {
            noCmp = true;
          }
        }
      });
      if (noImage) {
        callback('请选择图片');
      }
      if (noLink) {
        callback('请选择链接');
      }
      if (noCmp) {
        callback('请选择定位组件');
      }
    }
    callback();
  },
};

export { textRule, textImageRule, imageRule };
