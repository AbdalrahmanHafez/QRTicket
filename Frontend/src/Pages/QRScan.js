import React, { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";

function QRScan({ onResult, ...rest }) {
  const qrScanner = useRef(null);
  const video = useRef(null);

  useEffect(() => {
    console.log("[MOUNT] QRScan");

    if (qrScanner.current !== null) return;

    qrScanner.current = new QrScanner(
      video.current,
      (result) => onResult(result),
      {
        onDecodeError: (error) => {
          if (!error.includes("No QR code found"))
            console.log("[ERROR] onDecode", error);
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    window.qrscanner = qrScanner.current;

    qrScanner.current.start();

    return () => {
      console.log("[UN-MOUNT] QRScan");
      qrScanner.current.destroy();
      qrScanner.current = null;
    };
  }, []);

  return <video ref={video} {...rest} />;
}

export default QRScan;
