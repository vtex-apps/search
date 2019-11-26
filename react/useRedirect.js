import { useEffect, useState } from "react";
import { useRuntime } from "vtex.render-runtime";

const useRedirect = () => {
  const [redirect, setRedirect] = useState(null);
  const { navigate } = useRuntime();

  useEffect(() => {
    if (redirect) {
      const originRedirect = redirect.replace(/(http(s)?:)?\/\//, "");
      const origin = document.location.origin.replace(/(http(s)?:)?\/\//, "");

      if (originRedirect.startsWith(origin)) {
        navigate({
          to: originRedirect.replace(origin, ""),
        });
      } else {
        navigate({
          to: originRedirect,
          fallbackToWindowLocation: true,
        });
      }
    }
  }, [redirect]);

  return { setRedirect };
};

export default useRedirect;
