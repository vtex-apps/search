import React from "react";
import { usePixel } from "vtex.pixel-manager/PixelContext";

// tslint:disable-next-line:variable-name
export default function withUsePixel(ComponentWrapped: typeof React.Component) {
  return function Wrapped(props: any) {
    return <ComponentWrapped {...props} pixel={usePixel()} />;
  };
}
