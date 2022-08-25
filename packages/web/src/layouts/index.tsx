import React from 'react';
import { Layout, NoMenuLayout } from '@micro-frame/sc-runtime';

export default class extends React.PureComponent<any> {
  render() {
    console.log(this.props);
    const { location } = this.props;
    const { pathname } = location;

    if (pathname === '/preview') {
      return this.props.children;
    }

    if (pathname.indexOf('/system/current') > -1 || pathname === '/decorate') {
      return <NoMenuLayout {...this.props} isMaster={true} />;
    }
    // const { name, apps } = base;
    // const selectKey = '/' + location.pathname.split('/')[1];
    return <Layout {...this.props} isMaster={true} />;
  }
}
