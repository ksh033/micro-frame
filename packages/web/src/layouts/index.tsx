import React from 'react';
import {Layout} from '@micro-frame/sc-runtime';


export default class extends React.PureComponent<any> {
  render() {
    const { location, children, base } = this.props;
    // const { name, apps } = base;
    // const selectKey = '/' + location.pathname.split('/')[1];
    return (
      <Layout location={location}>
        {children}
      </Layout>
    );
  }
}
