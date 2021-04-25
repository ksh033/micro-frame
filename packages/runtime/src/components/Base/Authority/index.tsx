import React from 'react';

export interface WithAuthorityProps {
  buttons?: any[];
  funcode?: any;
}

export default function withAuthority<P>(
  WrappedComponent: React.FunctionComponent | React.ComponentClass | string | any,
): React.ComponentClass<WithAuthorityProps & P> | React.FunctionComponent<WithAuthorityProps & P> {
  return class HOC extends React.Component<WithAuthorityProps & P> {
    getFunCodes = () => {
      /* const { location: { pathname } } = this.context;
      const authorityMap = getAuthorityMap();
      let funCodes= authorityMap[pathname] ? authorityMap[pathname] : []; */
      const funCodes: any = []; // getAuthorityArray();
      return funCodes;
    };

    render() {
      const funcodes: any[] = [];
      // console.log(funcodes);
      const { buttons, children, funcode, ...restProps } = this.props;

      if (funcode) {
        if (funcodes.includes(funcode)) {
          return React.createElement(WrappedComponent, restProps, children);
        } 
          return null;
        
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
          // restProps.buttons = newButtons;
          const props={restProps,buttons:newButtons}
          return <WrappedComponent {...props}></WrappedComponent>;
        } 
          return React.createElement(WrappedComponent, restProps, children);
        
      
      
    }
  };
}
