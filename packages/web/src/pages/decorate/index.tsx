import React, { useEffect } from 'react';
// @ts-ignore
import Editor from '@scvisual/editor-core';
// import { PageContainer } from '@micro-frame/sc-runtime';
// import { history } from 'umi';
// export default function IndexPage() {
//   document.domain = '192.168.2.193';
//   useEffect(() => {
//     console.log(window.location);
//   }, []);
//   return <Editor iframeUrl="http://192.168.31.17:10086/#/pages/index/index" />
// }

const Decorate: React.FC<any> = () => {
  const { origin } = window.location;
  useEffect(() => {
    console.log(window.location);
  }, []);

  return <Editor iframeUrl={`${origin}/preview`} />;
};

export default Decorate;
