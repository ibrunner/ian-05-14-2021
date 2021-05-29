import React from "react";

function useIsVisible() {
  const [visible, setVisible] = React.useState<Boolean>(true);
  React.useEffect(() => {
    const toggleOnVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.info("visibile");
        setVisible(true);
      } else {
        console.info("not visible");
        setVisible(false);
      }
    };

    document.addEventListener("visibilitychange", toggleOnVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        toggleOnVisibilityChange
      );
    };
  }, [setVisible]);

  return visible;
}

export default useIsVisible;
