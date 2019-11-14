import React from "react";
import { useRuntime } from "vtex.render-runtime";

export default function withAccount(WrappedComponent) {
  return props => {
    const { account } = useRuntime();

    return <WrappedComponent {...props} account={account} />;
  };
}
