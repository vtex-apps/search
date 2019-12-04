import { useRuntime } from "vtex.render-runtime";
import React from "react";

export function withRuntime(ComponentWrapped: typeof React.Component) {
  return function Wrapped(props: any) {
    return <ComponentWrapped {...props} runtime={useRuntime()} />;
  };
}
