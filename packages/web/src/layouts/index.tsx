import React from 'react';
import {Layout} from '@micro-frame/sc-runtime';


export default class extends React.PureComponent<any> {
  render() {
  
    // const { name, apps } = base;
    // const selectKey = '/' + location.pathname.split('/')[1];
    return (
      <Layout {...this.props} isMasert={true}>
      </Layout>
    );
  }
}
