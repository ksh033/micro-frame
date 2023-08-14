import React from 'react';
import { Layout } from '@micro-frame/sc-runtime';
import { useLocation, Outlet } from 'umi'
// export default class extends React.PureComponent<any> {
//   render() {
//     console.log(this.props);
//     //const { location } = this.props;

// const location=useLocation()
// const { pathname } = location;
//     if (pathname === '/preview') {
//       return this.props.children;
//     }

//     if (pathname.indexOf('/system/current') > -1 || pathname === '/decorate') {
//       return <NoMenuLayout {...this.props} isMaster={true} />;
//     }
//     // const { name, apps } = base;
//     // const selectKey = '/' + location.pathname.split('/')[1];
//     return <Layout {...this.props} isMaster={true} />;
//   }
// }



export default (props: any) => {
     const location = useLocation()


     return <Layout isMaster={true}  >
          <Outlet context={location}></Outlet>

     </Layout>;

}

