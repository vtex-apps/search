import { useEffect, useState } from "react";

const useRedirect = () => {
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    if (redirect) {
      const originRedirect = redirect.replace(/(http(s)?:)?\/\//, "");
      const origin = window.location.origin.replace(/(http(s)?:)?\/\//, "");

      if (originRedirect.startsWith(origin)) {
        window.location.replace(originRedirect.replace(origin, ""));
      } else {
        window.location.replace(redirect);
      }
    }
  }, [redirect]);

  return { setRedirect };
};

export default useRedirect;
