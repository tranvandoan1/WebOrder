import { useEffect, useState } from "react";

export function Size() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener("resize", function () {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    });
  }, []);

  return size;
}
