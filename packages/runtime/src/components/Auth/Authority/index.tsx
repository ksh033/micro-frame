import React, { useContext } from "react";
import { RouteContext } from "@scboson/sc-layout";
// @ts-ignore
import { useModel } from 'umi';



const Authority = <T extends { buttons?: any[];
  funcode?: any;
  callback?:any;
  children?:any;

}>(WrappedComponent: React.ComponentType<T>|React.FunctionComponent<T>|React.ComponentClass<T>|string|any) => {
  return (props: T, ...rest: any[]) => {
    const { globalState } = useModel('@@qiankunStateFromMaster')||{};

    const { buttons, children, funcode, ...restProps } = props;
    //const masterProps = (useModel || noop)('@@qiankunStateFromMaster') || {};
    const { currentMenu } = globalState;
          if (currentMenu) {
        let { funcodes = "" } = currentMenu;
        funcodes = funcodes.split("|");
        if (funcode) {
          if (funcodes.includes(funcode)) {
            return React.createElement(WrappedComponent, restProps, children);
          }
        }
      
        if (buttons && buttons.length > 0) {
          const newButtons: any[] = [];
          buttons.forEach((item: any) => {
            if (item.funcode) {
              if (funcodes.includes(item.funcode)) {
                newButtons.push(item);
              }
            } else {
              newButtons.push(item);
            }
          });
  
          const newprops = { restProps, buttons: newButtons };

          return <WrappedComponent {...newprops}></WrappedComponent>;

        }
      }

    return <WrappedComponent {...props} {...rest} />;
  };
};
export default Authority

// export default function withAuthority<P>(
//   WrappedComponent:
//     | React.FunctionComponent
//     | React.ComponentClass
//     | string
//     | any
// ):
//   | React.ComponentClass<WithAuthorityProps & P>
//   | React.FunctionComponent<WithAuthorityProps & P> {


   
//     return class HOC extends React.Component<WithAuthorityProps & P> {
//     static contextType = RouteContext;
//     hidden;
   
//     componentDidMount(){
//       const { callback } = this.props;
//       if (this.hidden===true)
//       callback&&callback(this.hidden)
//     }
//     render() {
//       const that = this;
//       const { buttons, children, funcode, ...restProps } = this.props;

//       let value = this.context;

//       const { currentMenu } = value;
//       if (currentMenu) {
//         let { funcodes = "" } = currentMenu;
//         funcodes = funcodes.split("|");

//         if (funcode) {
//           if (funcodes.includes(funcode)) {
//             return React.createElement(WrappedComponent, restProps, children);
//           }
//           //@ts-ignore
//           // this.inputRef.current=false
//          that.hidden = true;

//           return null;
//         }

//         // const props = { restProps, buttons: newButtons };
//         if (buttons && buttons.length > 0) {
//           const newButtons: any[] = [];
//           buttons.forEach((item: any) => {
//             if (item.funcode) {
//               if (funcodes.includes(item.funcode)) {
//                 newButtons.push(item);
//               }
//             } else {
//               newButtons.push(item);
//             }
//           });
//           // restProps.buttons = newButtons;
//           const props = { restProps, buttons: newButtons };

//           return <WrappedComponent {...props}></WrappedComponent>;
//         }
//       }

//       return React.createElement(WrappedComponent, restProps, children);
//     }
//   };
// }
