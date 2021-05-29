import React from "react";

export function usePrevious<T>(value: T): T | undefined {
  const valRef = React.useRef<T>();

  React.useEffect(() => {
    valRef.current = value;
  });

  return valRef.current;
}

export default usePrevious;
