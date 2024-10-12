"use client";

import { useEffect } from "react";

function BootstrapClient() {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    //eslint-disable-next-line
  }, []);

  return null;
}

export default BootstrapClient;
