import React from "react";
// @ts-ignore
import { useModel } from "umi";
type AuthorityType = {
  buttons?: any[];
  funcode?: any;
  callback?: any;
  children?: any;
};

type AuthorityResp<T> = React.ComponentClass<T> | React.FunctionComponent<T>;

export const getFunCodeAuth = () => {
  let masterState: any = {};

  try {
    masterState = useModel("@@qiankunStateFromMaster") || {
      globalState: {},
    };
  } catch (ex) {
    masterState = {
      globalState: {},
    };
  }
  const { globalState = {} } = masterState;
  const { currentMenu,localMenuData } = globalState;
  if (localMenuData) {
    return null;
  }
  if (currentMenu) {
    let { funcodes = "" } = currentMenu;
    funcodes = funcodes.split("|");

    return funcodes;
  }
  return [];
};

const Authority = function <T extends AuthorityType>(
  WrappedComponent:
    | React.ComponentType<T>
    | React.FunctionComponent<T>
    | React.ComponentClass<T>
    | string
    | any,
  displayName?: string
): AuthorityResp<T & AuthorityType> {
  const component = (props: T, ...rest: any[]) => {
    let masterState: any = {};

    try {
      masterState = useModel("@@qiankunStateFromMaster") || {
        globalState: {},
      };
    } catch (ex) {
      masterState = {
        globalState: {},
      };
    }
    const { globalState = {} } = masterState;

    const { buttons, children, funcode, ...restProps } = props;
    //const masterProps = (useModel || noop)('@@qiankunStateFromMaster') || {};
    const { currentMenu, localMenuData } = globalState;
    if (!localMenuData) {
      if (currentMenu) {
        let { funcodes = "" } = currentMenu;
        funcodes = funcodes.toUpperCase().split("|");
        if (funcode) {
          // funcodes.splice(funcodes.indexOf("ENABLE"),1)
          if (funcodes.includes(funcode)) {
            return React.createElement(WrappedComponent, restProps, children);
          }
          if (displayName && displayName === "Enabled") {
            restProps["disabled"] = true;
            return React.createElement(WrappedComponent, restProps, children);
          }
          return null;
        }

        if (buttons && buttons.length > 0) {
          const newButtons: any[] = [];
          buttons.forEach((item: any) => {
            if (item.funcode) {
              
              if (funcodes.includes(item.funcode.toUpperCase())) {
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
    }
    return <WrappedComponent {...props} />;
  };
  if (displayName) component.displayName = displayName;

  return component;
};
export default Authority;

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
