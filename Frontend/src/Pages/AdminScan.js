import React, { useEffect, useState, useRef, useCallback } from "react";
import { QrReader } from "react-qr-reader";
import QRCode from "qrcode";
import { ViewFinder } from "./ViewFinder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import "./AdminScan.css";
import QRScan from "./QRScan";
import http from "Services/http-common";

var scanSound = new Audio(
  "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
);

function AdminScan() {
  const [firstTime, setFirstTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [qrdata, setQrdata] = useState("");

  // const [qrimg, setqrimg] = useState("");

  // Base64 string data
  // example img data: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAXNSR0IArs4c6QAABMFJREFUeF7tndGSKiEMBfX/P9pbdd9kquw6HlBke18hIZxOAjO6u/fH4/G4+XOMAneBHsPy/0YEehZPgR7GU6ACPU2Bw/bjGSrQwxQ4bDtWqEAPU+Cw7VihAj1MgcO2Y4UK9DAFDtuOFSrQwxQ4bDt1hd7v949KMn58S+vTfPo4mPzP3jzFQ+sJFD7fFyilUDlOFTe6p/lUEQItgZE5ARIopSgoPGZw6e6yGvlPxwn4OE7+KQFpfLb/6WeoQAnh87hAh0sMCUJnICUg+c/wXWfP9m+FhrdcSoAU8M8BpQqhM402TP7pEkWA2vXb/cUJ0n4v99sbFuhwJgv09S8OfDthrdBBAVtumBK7ZzC15PaMW+0/xNF/0Vqg2YcTbccgwMsfW76dwavXX+2fAF7ebP36pYg2vFrw1f5pf8cBJUFnP2dSyyQAZE/xkv+fb7kC/ePPoemnKbtf+my5gwIpMGqZ1BLJfvuWSxukcRKc7Kki2+fQdH2KR6ChoumZOzuhBDp8q7DOYPiW4uqWKFCBRj1o+mNLtPobk9MKopaZjr8RcmRSd6DZb4qi6N+YLNDXolmh0NLpEvVGTr40sUJDIG2FzwZIj03penWFpguunt+eiW2FrN4f+RfooJBAKWU+PG6F/npKlu9mZ59hH87fy3J1y6WKoDcjqwWgfKVbbGpPly7aL61H9gINXwVSggqUUq4cp4y3QsMzizK65IXmAkWJnie0ZygJTuGk61OCpS2T4m/jo/1f9jP7Xe6nN9gKRvarW3IKjOZ//VJECYAbKD9eE+jkM1SglLLZeF2hdCZROASUWh69GKAKpPhSe4qXzmjSA+Ntz1CBvr4krk646ZcigQr0SQFqMdTCVleALXfxq7S2I8xOAAJOCUkJTWfm11subYAEEuhrxB+/5Qr0GQjpYYWGCrSPEdRRjmu5JNjqM438UwtP46f1KAHCfLxMX95yU0FoPrWotiJIcPIv0EEBgXY1aoUO+lmhXULV1gSAFlht37Zoin/5c2gaQDt/NRCKj9YXKCkYtkhyR0Bae4GSggJ9qVB9KUozMOR1mU63YPJP9jRO/mmcHrvInsYFGv72GglK4wINn1NTQekMnd2BBCpQytGn8ektd3YGthW0+kyM1L7dbhRPq59AUyLlfIGWlxYSsOQTm1M8Vmj4lZfZl5yU6M8DTQVMN0z+yd8IhCokPdNpfVovTZjlZygJToKmAqb+aP44nsYj0MX/24wSjCpGoOG/dE4zOgWUzrdCocLoTGiBkj212BY47W/1+HFnqEDp0ICUSs8UylAC0o5boQJ9UqDMf8rnevznWy5dWlqFCODqDpXGL1BQTKAfvuVaoc8KWKFW6JAR5V8hoTOCzqjUnuant2jyR8+1dOsm/5cO1f6NhVZwCrj13wr67fVJH4GGLVagw6UozTC65NCtk+wpHltu+PKdBKXx2YLTem3LJv+zx6ffcmcHSJeGtiVSvAIlhcpxK/S1gFYoJNifq9Cy4DSfrEBdoZPj0V2pgEBLAXczF+huRMp4BFoKuJu5QHcjUsYj0FLA3cwFuhuRMh6BlgLuZi7Q3YiU8Qi0FHA3c4HuRqSMR6ClgLuZC3Q3ImU8Ai0F3M1coLsRKeP5B1JmPw76fvjqAAAAAElFTkSuQmCC

  // useEffect(() => {
  //   console.log("USEEFFECT");

  //   QRCode.toDataURL("I am a pony!", function (err, url) {
  //     console.log(url);
  //     setqrimg(url);
  //   });
  // }, []);

  useEffect(() => {
    console.log("[MOUNT] AdminScan");
    return () => console.log("[UN-MOUNT] AdminScan");
  });

  useEffect(() => {
    const removeClassFn = (event) => {
      console.log("[EVENT] animation end");
      document.body.classList.toggle("anim", false);
    };

    "webkitAnimationEnd oanimationend msAnimationEnd animationend"
      .split(" ")
      .forEach(function (e) {
        window.addEventListener(e, removeClassFn, false);
      });

    return () => {
      "webkitAnimationEnd oanimationend msAnimationEnd animationend"
        .split(" ")
        .forEach(function (e) {
          document.body.removeEventListener(e, removeClassFn);
        });
    };
  }, []);

  return (
    <div style={styles.container}>
      <label
        style={styles.title}
        className="d-flex justify-content-center text-light"
      >
        QR Scanner
      </label>

      {/* <img src={`${qrimg}`} alt="" /> */}

      <div
        className={
          "alert alert-" +
          (firstTime
            ? "primary"
            : loading
            ? "warning"
            : error
            ? "danger"
            : "success")
        }
        role="alert"
      >
        {firstTime
          ? "Welcome here you can scan the tickets."
          : loading
          ? "Loading.."
          : error
          ? error
          : "Recorded, press Next to scan more."}
      </div>

      <div className="d-flex mb-3">
        <QRScan
          className="col-lg-6 offset-lg-3 col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-10 offset-1"
          style={{ borderRadius: "7px", boxShadow: "0 0 50px 0px white" }}
          // style={styles.qrvideo}
          onResult={useCallback((result) => {
            console.log("[SCAN] ", result);
            const string = result.data;
            setFirstTime(false);
            setLoading(true);
            window.qrscanner.stop();
            const data = { transaction_id: "oihcrepw8392" };
            // const data = { transaction_id: "abcd" };
            http
              .post("/qrscan", data)
              .then((res) => {
                console.log("SUCCESS", res);
                seterror(null);
                // alert("OK");
              })
              .catch((error) => {
                console.log("FAIL", error);
                let msg =
                  "[ERROR]: " +
                  (error?.response?.data ? error.response.data : error.message);
                console.log("MSG Is", msg);
                seterror(msg);
                // alert(msg);
              })
              .finally(() => {
                setLoading(false);
              });
            navigator.vibrate(500);
            scanSound.play();
            document.body.classList.toggle("anim", true);
            // alert("OK");
            setQrdata(string);
          }, [])}
        />
        <FontAwesomeIcon
          style={{ fontSize: 15, marginLeft: 10 }}
          icon={faUpRightAndDownLeftFromCenter}
          onClick={() => {
            document.body.requestFullscreen();
          }}
        />
      </div>

      <div
        className="w-100"
        style={{
          position: "fixed",
          bottom: "0",
          height: "20%",
          background:
            "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          display: "flex",
        }}
      >
        {!firstTime && (
          <button
            // disabled={firstTime || loading}
            // style={{ position: "fixed", bottom: "0" }}
            style={{ alignSelf: "end", height: "5rem" }}
            className="btn btn-primary btn-lg col-12 col-lg-6 offset-lg-3"
            onClick={() => {
              window.qrscanner.start();
            }}
          >
            Next
          </button>
        )}
      </div>

      <h1 style={{ color: "pink" }}>{qrdata}</h1>
    </div>
  );
}

const styles = {
  container: { height: "100%", width: "100%", backgroundColor: "#D9F8F9" },
  title: {
    fontSize: 20,
    backgroundColor: "rgb(13 110 253)",
    alignItems: "baseline",
  },
  qrvideo: {
    width: "100%",
    margin: "auto",
  },
};

export default AdminScan;
