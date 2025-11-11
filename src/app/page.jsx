"use client";
import React, { useEffect } from "react";
import Typed from "typed.js";
import useWindowSize from "@rooks/use-window-size";

export default function Home() {
  const { outerWidth } = useWindowSize();
  const el = React.useRef(null);

  useEffect(() => {
    document.title = "AWC Sports App:Homepage";
    const typed = new Typed(el.current, {
      strings: ["Welcome To Amta West Circle's Sports Committee's Website."],
      typeSpeed: 50,
      loop: true,
      loopCount: Infinity,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container my-2">
      <div className="my-3" style={{ height: "70px" }}>
        {outerWidth < 780 ? (
          <span
            className="text-primary text-center fs-6 mb-3 web-message"
            ref={el}
            suppressHydrationWarning={true}
          />
        ) : (
          <span
            className="text-primary text-center fs-3 mb-3 web-message"
            ref={el}
            suppressHydrationWarning={true}
          />
        )}
      </div>
    </div>
  );
}
