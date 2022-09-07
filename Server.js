require("dotenv").config();

const express = require("express");
var path = require("path");
var fs = require("fs"); //file system
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require("cors");
const { isEmpty, validateEmail } = require("./utils.js");
var QRCode = require("qrcode");

// Express App Setup
const app = express();
app.use(
  cors({
    origin: process.env.VERCEL_URL || "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

const bcrypt = require("bcryptjs");
const db = require("./Services/Database.js");
const Ticket = require("./Models/Ticket.js");
const Vodafone = require("./Models/VodafoneTransaction.js");
const sendMail = require("./sendMail.js");

app.get("/", async function (req, res) {
  res.send({ message: "hello" });
});

app.get("/test", async function (req, res) {
  // 3913d5755937594155d763558b75a10f-us12
  // sendMail("alaay0880@gmail.com");
  sendMail("dahomy999@outlook.sa");

  res.send({ status: "ok" });
});

app.post("/qrscan", async function (req, res) {
  //TODO: Require Authentication
  const { transaction_id } = req.body;

  if (isEmpty(transaction_id))
    return res.status(400).send("Invalid transaction_id");

  const ticket = await Ticket.findOne({
    transaction_id,
  });

  if (!ticket) return res.status(400).send("Ticket not found");

  if (ticket.scanlimit < 1) return res.status(400).send("Ticket exhausted");

  // await ticket.updateOne({transaction_id}, {scanlimit: ticket.scanlimit - 1});
  ticket.scanlimit = ticket.scanlimit - 1;
  await ticket.save();

  return res.send("OK");
});

app.post("/verifyPurchase", async function (req, res) {
  // console.log("hitting verify purchase");
  // console.log(req.body);
  const TICKET_PRICE = 180;

  const { transaction_id, email } = req.body;

  if (isEmpty(transaction_id) || isEmpty(email))
    return res
      .status(422)
      .send("Transaction Id and the email must not be empty");

  // verify Email
  if (!validateEmail(email))
    return res
      .status(400)
      .send("Invalid Email, should be on the form example@hostname.com");

  // verify with vodafone,
  const transaction = await Vodafone.findOne({
    transaction_id: transaction_id,
  });

  if (!transaction) return res.status(400).send("Payment not found");

  // Calculate scanlimit
  if (transaction.payedAmount < TICKET_PRICE) {
    console.log(
      `[WARN] ${transaction.phoneNumber} paid less than the ticket price(${TICKET_PRICE}), transaction_id=${transaction.transaction_id}`
    );
    return res.status(400).send("Unsufficent Payed Amount");
  }

  const scanlimit = Math.floor(transaction.payedAmount / TICKET_PRICE);
  // generate QR
  const qrimg = await QRCode.toDataURL(transaction_id);
  await QRCode.toFile(`./public/images/${transaction_id}.png`, transaction_id);

  // insert QR to DB
  const dbsession = await db.startSession();

  try {
    dbsession.startTransaction();
    await Ticket.create(
      [
        {
          transaction_id,
          scanlimit,
          email,
          qrimg,
        },
      ],
      { session: dbsession }
    );
  } catch (error) {
    await dbsession.abortTransaction();
    return res.status(400).send("Invalid Transaction number, already used");
  }

  // send EMAIL
  // qrimg:
  // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAXNSR0IArs4c6QAABMFJREFUeF7tndGSKiEMBfX/P9pbdd9kquw6HlBke18hIZxOAjO6u/fH4/G4+XOMAneBHsPy/0YEehZPgR7GU6ACPU2Bw/bjGSrQwxQ4bDtWqEAPU+Cw7VihAj1MgcO2Y4UK9DAFDtuOFSrQwxQ4bDt1hd7v949KMn58S+vTfPo4mPzP3jzFQ+sJFD7fFyilUDlOFTe6p/lUEQItgZE5ARIopSgoPGZw6e6yGvlPxwn4OE7+KQFpfLb/6WeoQAnh87hAh0sMCUJnICUg+c/wXWfP9m+FhrdcSoAU8M8BpQqhM402TP7pEkWA2vXb/cUJ0n4v99sbFuhwJgv09S8OfDthrdBBAVtumBK7ZzC15PaMW+0/xNF/0Vqg2YcTbccgwMsfW76dwavXX+2fAF7ebP36pYg2vFrw1f5pf8cBJUFnP2dSyyQAZE/xkv+fb7kC/ePPoemnKbtf+my5gwIpMGqZ1BLJfvuWSxukcRKc7Kki2+fQdH2KR6ChoumZOzuhBDp8q7DOYPiW4uqWKFCBRj1o+mNLtPobk9MKopaZjr8RcmRSd6DZb4qi6N+YLNDXolmh0NLpEvVGTr40sUJDIG2FzwZIj03penWFpguunt+eiW2FrN4f+RfooJBAKWU+PG6F/npKlu9mZ59hH87fy3J1y6WKoDcjqwWgfKVbbGpPly7aL61H9gINXwVSggqUUq4cp4y3QsMzizK65IXmAkWJnie0ZygJTuGk61OCpS2T4m/jo/1f9jP7Xe6nN9gKRvarW3IKjOZ//VJECYAbKD9eE+jkM1SglLLZeF2hdCZROASUWh69GKAKpPhSe4qXzmjSA+Ntz1CBvr4krk646ZcigQr0SQFqMdTCVleALXfxq7S2I8xOAAJOCUkJTWfm11subYAEEuhrxB+/5Qr0GQjpYYWGCrSPEdRRjmu5JNjqM438UwtP46f1KAHCfLxMX95yU0FoPrWotiJIcPIv0EEBgXY1aoUO+lmhXULV1gSAFlht37Zoin/5c2gaQDt/NRCKj9YXKCkYtkhyR0Bae4GSggJ9qVB9KUozMOR1mU63YPJP9jRO/mmcHrvInsYFGv72GglK4wINn1NTQekMnd2BBCpQytGn8ektd3YGthW0+kyM1L7dbhRPq59AUyLlfIGWlxYSsOQTm1M8Vmj4lZfZl5yU6M8DTQVMN0z+yd8IhCokPdNpfVovTZjlZygJToKmAqb+aP44nsYj0MX/24wSjCpGoOG/dE4zOgWUzrdCocLoTGiBkj212BY47W/1+HFnqEDp0ICUSs8UylAC0o5boQJ9UqDMf8rnevznWy5dWlqFCODqDpXGL1BQTKAfvuVaoc8KWKFW6JAR5V8hoTOCzqjUnuant2jyR8+1dOsm/5cO1f6NhVZwCrj13wr67fVJH4GGLVagw6UozTC65NCtk+wpHltu+PKdBKXx2YLTem3LJv+zx6ffcmcHSJeGtiVSvAIlhcpxK/S1gFYoJNifq9Cy4DSfrEBdoZPj0V2pgEBLAXczF+huRMp4BFoKuJu5QHcjUsYj0FLA3cwFuhuRMh6BlgLuZi7Q3YiU8Qi0FHA3c4HuRqSMR6ClgLuZC3Q3ImU8Ai0F3M1coLsRKeP5B1JmPw76fvjqAAAAAElFTkSuQmCC",
  // TODO: dynamic on the fly generation of the image??
  // TODO: correct URL
  const email_data = {
    qrimg: `https://9db8-156-213-150-147.eu.ngrok.io/images/${transaction_id}.png`,
    date: "25/9/2022",
    location: "someware",
    ticketsCount: 4,
    price: 25,
    transaction_id: "9huwephcr9eh8",
  };

  try {
    await sendMail("dahomy999@outlook.sa", email_data);
    // await sendMail("alaay0880@gmail.com", email_data);
  } catch (error) {
    console.log(
      `[ERROR] Unable to send email to ${email} while verifiying transaction (${transaction_id})`
    );

    await dbsession.abortTransaction();

    return res.status(400).send("Could not send the email");
  }

  await dbsession.commitTransaction();

  res.send({ message: "OK" });
});

// const port = process.env.PORT || 8080;
// app.listen(port, () => console.log(`server at localhost:${port}`));

module.exports = app;
