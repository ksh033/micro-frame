var customeStyle =
  "data:text/css;base64,Lnd4X3FyY29kZSBpZnJhbWUgeyB3aWR0aDogMTYwcHg7IGhlaWdodDogMTYwcHg7IG1hcmdpbjogMDsgcGFkZGluZzogMDsgfQoubG9naW5QYW5lbCB7IG1hcmdpbjowOyBwYWRkaW5nOiAwOyB9Ci5sb2dpblBhbmVsIC50aXRsZSB7IGRpc3BsYXk6IG5vbmU7IH0KLmltcG93ZXJCb3ggLnFyY29kZSB7IHdpZHRoOiAyODBweDsgaGVpZ2h0OiAyODBweDsgbWFyZ2luOiAwIH0=";

const config = {
  self_redirect: false,
  appid: "wx9de3e8bbd3096a74", //微信开放平台网站应用appid
  scope: "snsapi_login",
  // redirect_uri: encodeURI(window.location.origin + '/login'), //设置扫码成功后回调页面
  state: "" + new Date().getTime(),
  href: customeStyle,
};

const createWxLoginQr = (id: string, url?: string) => {
  // @ts-ignore
  const login = window.WxLogin || WxLogin;
  // const defaultUrl = 'https://test.yumcat.cn/sysweb'
  const defaultUrl = window.location.origin;
  const rUrl = typeof url === "string" ? defaultUrl + url : defaultUrl;
  const redirect_uri = encodeURI(rUrl);
  new login({
    ...config,
    id: id,
    redirect_uri,
  });
};

export default createWxLoginQr;
