// 供应商状态
export const SupplierStatus = {
  ENABLE: {
    value: "1",
    name: "无效",
  },
  DISABLE: {
    value: "0",
    name: "有效",
  },
};
// 商品状态
export const GoodStatus = {
  SUPPLY: {
    value: "2",
    name: "已供应",
  },
  NOSUPPLY: {
    value: "1",
    name: "未供应",
  },
};
// 备货状态，调整单状态
export const StockStatus = {
  TOEXAMINE: {
    value: "1",
    name: "待发货",
  },
  EXAMINE: {
    value: "2",
    name: "已部分发货",
  },
  NOEXAMINE: {
    value: "3",
    name: "已发货",
  },
  TOCHECK: {
    value: "4",
    name: "已完成",
  },
};
// 订单状态
export const DeliverOrderStatus = {
  FINISH: {
    value: "1",
    name: "已发货",
  },
  RECEIVE: {
    value: "2",
    name: "已收货",
  },
};
// 流转方式
export const ModeType = {
  CONFIRM: {
    value: "1",
    name: "提交确认",
  },
  INSERT: {
    value: "2",
    name: "提交录入",
  },
};
// 发起方来源
export const BornType = {
  PURCHASE: {
    value: "1",
    name: "运营采购",
  },
  SUPPLIER: {
    value: "2",
    name: "供应商",
  },
};
// 属性类型
export const SpecType = {
  SPU: {
    value: "0",
    name: "SPU属性",
  },
  SKU: {
    value: "1",
    name: "SKU属性",
  },
  KEY: {
    value: "2",
    name: "关键属性",
  },
  NONKEY: {
    value: "3",
    name: "非关键属性",
  },
};
// 选择类型
export const SpecSelectType = {
  ONLY: {
    value: "0",
    name: "唯一",
  },
  SINGLE: {
    value: "1",
    name: "单选",
  },
  MULTIPLE: {
    value: "2",
    name: "多选",
  },
};

// 输入方式
export const InputType = {
  SELECT: {
    value: "0",
    name: "从列表选择",
  },
  INPUT: {
    value: "1",
    name: "手工输入",
  },
};

// 产品介绍类型
export const IntroType = {
  MASTER: {
    value: "0",
    name: "主图",
  },
  SLIDESHOW: {
    value: "1",
    name: "轮播图",
  },
  DETAIL: {
    value: "2",
    name: "产品详情",
  },
  VIDEO: {
    value: "3",
    name: "视频",
  },
  ARTICLES: {
    value: "4",
    name: "文章",
  },
};

// 开通状态
export const OpenState = {
  CHECK: {
    value: "1",
    name: "审核中",
  },
  OPEN: {
    value: "2",
    name: "已开通",
  },
  CLOSE: {
    value: "3",
    name: "失败",
  },
};
// 待操作主体类型
export const PendingSubject = {
  THREE: {
    value: "1",
    name: "第三方",
  },
  SUPPIER: {
    value: "2",
    name: "供应商",
  },
  ZORE: {
    value: "3",
    name: "平台",
  },
};
// 申请状态（节点名称）
export const NodeName = {
  CHECKING: {
    value: "CHECKING",
    name: "资料校验中",
  },
  ACCOUNT_NEED_VERIFY: {
    value: "ACCOUNT_NEED_VERIFY",
    name: "待账户验证",
  },
  AUDITING: {
    value: "AUDITING",
    name: "审核中",
  },
  REJECTED: {
    value: "REJECTED",
    name: "已驳回",
  },
  NEED_SIGN: {
    value: "NEED_SIGN",
    name: "待签约",
  },
  FINISH: {
    value: "FINISH",
    name: "完成",
  },
  FROZEN: {
    value: "FROZEN",
    name: "已冻结",
  },
};

// 供应商账户类型
export const SupplierUserType = {
  ADMIN: {
    value: "1",
    name: "管理员",
  },
  PROTECT: {
    value: "2",
    name: "加工中心",
  },
  USER: {
    value: "3",
    name: "普通用户",
  },
};

// 优惠券状态
export const CouponStatus = {
  EFFECTIVE: {
    value: "1",
    name: "有效",
  },
  HASFAILURE: {
    value: "2",
    name: "已失效",
  },
  ENDED: {
    value: "3",
    name: "已结束",
  },
};

// 退款状态
export const RefundStatus = {
  WAIT: {
    value: "0",
    name: "待退款",
  },
  LOADING: {
    value: "1",
    name: "退款中",
  },
  FAIL: {
    value: "2",
    name: "退款失败",
  },
  SUCCESS: {
    value: "3",
    name: "退款成功",
  },
};
// 退款状态
export const AftersaleStatus = {
  WAIT: {
    value: "0",
    name: "待处理",
  },
  LOADING: {
    value: "1",
    name: "处理中",
  },
  SUCCESS: {
    value: "2",
    name: "已处理",
  },
  REFUSE: {
    value: "3",
    name: "已拒绝",
  },
};
// 规则类型relateRuleType
export const RelateRuleType = {
  WAIT: {
    value: "0",
    name: "预售商品",
  },
  GOODS: {
    value: "1",
    name: "标准商品",
  },
  PRODUCT: {
    value: "2",
    name: "标准产品",
  },
  ITEMS: {
    value: "3",
    name: "标准品目",
  },
};
// 订单状态
export const OrderStatus = {
  WAIT: {
    value: "0",
    name: "待支付",
  },
  STOCK: {
    value: "1",
    name: "备货中",
  },
  DELIVERY: {
    value: "2",
    name: "配送中",
  },
  FINISH: {
    value: "3",
    name: "已送达",
  },
  CLOSE: {
    value: "4",
    name: "已关闭",
  },
  CANCEL: {
    value: "5",
    name: "已取消",
  },
};
// 订单处理状态
export const TransitOrderStatus = {
  WAIT: {
    value: "1",
    name: "待上架",
  },
  STOCK: {
    value: "2",
    name: "待派单",
  },
  DELIVERY: {
    value: "3",
    name: "待接单",
  },
  FINISH: {
    value: "4",
    name: "已接单",
  },
  CLOSE: {
    value: "5",
    name: "已取件",
  },
  REVEIVE: {
    value: "6",
    name: "已收货",
  },
  CANCEL: {
    value: "9",
    name: "派单失败",
  },
  PERSON: {
    value: "21",
    name: "待自提",
  },
  Ex: {
    value: "89",
    name: "异常",
  },
  CALLOFF: {
    value: "99",
    name: "已取消",
  },
};
// 异常订单状态 ErrorHandleResult
export const ErrorHandleResult = {
  WAIT: {
    value: "1",
    name: "待处理",
  },
  FINISH: {
    value: "2",
    name: "已处理",
  },
};
// 货位状态
export const TransitLocationStatus = {
  WAIT: {
    value: "1",
    name: "空闲",
  },
  FINISH: {
    value: "2",
    name: "占用",
  },
};
