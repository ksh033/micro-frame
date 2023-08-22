//@ts-ignore
import { history as h } from "@@/core/history";


import { stringify } from "query-string";


// Patch `to` to support basename
// Refs:
// https://github.com/remix-run/history/blob/3e9dab4/packages/history/index.ts#L484
// https://github.com/remix-run/history/blob/dev/docs/api-reference.md#to
function patchTo(to: any) {
    if (typeof to === 'string') {
        return `${to}`;
    } else if (typeof to === 'object') {

        const { query, search, ...restProps } = to

        const params = query || search
        let paramsStr = ""
        if (typeof params !== "string") {
            paramsStr = stringify(params)
        } else {
            paramsStr = params
        }

        return {
            ...restProps,
            search: paramsStr

        };
    } else {
        throw new Error(`Unexpected to: ${to}`);
    }
}

let history:typeof h={
    ...h,
    push(to, state) {
        h.push(patchTo(to), state);
      },
      replace(to, state) {
        h.replace(patchTo(to), state);
      },
}

export { history }