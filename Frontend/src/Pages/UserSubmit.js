// import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useState, useRef } from "react";
import { Typography, AppBar, Toolbar, TextField, Box } from "@material-ui/core";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import http from "Services/http-common";
import Spinner from "react-bootstrap/Spinner";

// TODO: Better ticket icon placement

function UserSubmit() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const savedEmail = useRef("");
  if (error) {
    // alert(error);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const transaction_id = e.target.transaction_id.value;
    const email = e.target.email.value;
    const data = {
      transaction_id,
      email,
    };

    // TODO: Send to server

    savedEmail.current = email;
    console.log("Submitting", data);

    setLoading(true);
    http
      .post("/verifyPurchase", data)
      .then((res) => {
        console.log("SUCCESS", res);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.log("FAILED", err);
        setError(err?.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div
      style={{
        backgroundImage: "url(/festival_ai.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      {/* <img style={{ position: "absolute", top: 0 }} src="/logo192.png" alt="" /> */}
      {/* <br /> <br /> <br /> <br /> <br /> */}
      <div
        className="mb-5 col-xs-10 offset-xs-1 col-md-6 offset-md-3"
        style={{
          // borderRadius: "2rem",
          // backgroundColor: "rgb(39,10,10,0.85)",
          background: "rgb(65 8 8 / 69%)",
          boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
          borderRadius: "2rem",
          border: "1px solid rgba( 255, 255, 255, 0.18 )",
          backdropFilter: "blur( 12px )",

          position: "relative",

          top: "50%",
          transform: "translate(0%, -60%)",
        }}
      >
        <div
          style={{ marginLeft: "2rem", marginRight: "2rem", color: "white" }}
        >
          {showSuccess ? (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="mt-5">
                <FontAwesomeIcon
                  style={{ fontSize: 100 }}
                  icon={faCircleCheck}
                />
              </div>
              <label style={{ fontSize: 45 }} className="my-2">
                Thank you
              </label>

              <label style={{ fontSize: 20 }} className="mt-5 mb-5">
                Your ticket will be sent to '{savedEmail.current}' shortly.
              </label>
            </div>
          ) : (
            <Form id="form1" onSubmit={handleSubmit}>
              <br />
              <br />

              {/* <h2>
                  {"  "} Claim your ticket {"  "}
                  <FontAwesomeIcon icon={faTicket} />
                </h2> */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2>Claim your ticket</h2>
                <FontAwesomeIcon
                  style={{
                    marginLeft: "auto",
                    fontSize: "40px",
                    color: "rgb(255 255 255 / 90%)",
                  }}
                  icon={faTicket}
                />
              </div>

              <div>
                <Row className="col-xs-10 offset-xs-1 mt-3">
                  <Col>
                    <Form.Group as={Col} controlId="transaction_id">
                      <Form.Label>Transaction Number</Form.Label>
                      <Form.Control
                        type="string"
                        name="transaction_id"
                        placeholder="Enter the transaction number from the receipt"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Form.Group as={Col} controlId="email" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                    />
                  </Form.Group>
                </Row>
              </div>

              <div className="d-flex align-items-baseline">
                {error && (
                  <label
                    style={{ color: "red", fontSize: 18, marginRight: 30 }}
                  >
                    Error: {error}
                  </label>
                )}

                <Button
                  className="mt-4"
                  disabled={loading}
                  style={{
                    // display: "block",
                    marginLeft: "auto",
                    // marginRight: "0px",
                  }}
                  variant="light"
                  type="submit"
                >
                  Submit
                  {loading && (
                    <>
                      {"ing.. "}
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Button>
              </div>

              <br />
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSubmit;
