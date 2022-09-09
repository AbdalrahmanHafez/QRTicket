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
  await fs.writeFileSync(path.join(__dirname, "./tmp/hello.txt"), "CONTENT1");
  // await QRCode.toFile(`./public/images/${transaction_id}.png`, transaction_id);
  // console.log(path.join(__dirname, `./tmp/${transaction_id}.png`));
  // await QRCode.toFile(
  //   path.join(__dirname, `./tmp/${transaction_id}.png`),
  //   transaction_id
  // );

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
  // "data:image/png;base64,iVBORw0KG...",

  // TODO: correct URL
  const email_data = {
    qrimg: `${process.env.VERCEL_URL}/api/getimage/${transaction_id}`,
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

app.get("/getimage/:name", async function (req, res) {
  const { name } = req.params;
  if (!name) return res.status(400).send("Invalid input (name)");

  console.log("name is ", name);

  const ticket = await Ticket.findOne({ transaction_id: name }, "qrimg");
  if (!ticket) return res.status(404).send("Image not found");
  // console.log(ticket);

  // const file = path.join(process.cwd(), "public", "images", "example.png");
  // const stringified = fs.readFileSync(file);

  const base64encoded = ticket.qrimg.split("base64,")[1];
  // console.log(base64encoded);

  // "data:image/png;base64,iVBORw0KGgoAAAANSUhE...";
  // const stringified = "iVBORw0KGgoAAAANSUhEUgA...";

  const bytes = new Buffer(base64encoded, "base64");

  res.setHeader("Content-Type", "image/png");
  return res.end(bytes);
});

// const port = process.env.PORT || 8080;
// app.listen(port, () => console.log(`server at localhost:${port}`));

module.exports = app;
