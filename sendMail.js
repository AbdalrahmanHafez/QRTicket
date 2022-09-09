const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

function generateTemplate(email_data) {
  const source = fs.readFileSync(
    path.join(process.cwd(), "./mail_template/index.html"),
    "utf-8"
  );
  // console.log("source", source);
  const template = Handlebars.compile(source);

  // const data = {
  //   qrimg:
  //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAXNSR0IArs4c6QAABMFJREFUeF7tndGSKiEMBfX/P9pbdd9kquw6HlBke18hIZxOAjO6u/fH4/G4+XOMAneBHsPy/0YEehZPgR7GU6ACPU2Bw/bjGSrQwxQ4bDtWqEAPU+Cw7VihAj1MgcO2Y4UK9DAFDtuOFSrQwxQ4bDt1hd7v949KMn58S+vTfPo4mPzP3jzFQ+sJFD7fFyilUDlOFTe6p/lUEQItgZE5ARIopSgoPGZw6e6yGvlPxwn4OE7+KQFpfLb/6WeoQAnh87hAh0sMCUJnICUg+c/wXWfP9m+FhrdcSoAU8M8BpQqhM402TP7pEkWA2vXb/cUJ0n4v99sbFuhwJgv09S8OfDthrdBBAVtumBK7ZzC15PaMW+0/xNF/0Vqg2YcTbccgwMsfW76dwavXX+2fAF7ebP36pYg2vFrw1f5pf8cBJUFnP2dSyyQAZE/xkv+fb7kC/ePPoemnKbtf+my5gwIpMGqZ1BLJfvuWSxukcRKc7Kki2+fQdH2KR6ChoumZOzuhBDp8q7DOYPiW4uqWKFCBRj1o+mNLtPobk9MKopaZjr8RcmRSd6DZb4qi6N+YLNDXolmh0NLpEvVGTr40sUJDIG2FzwZIj03penWFpguunt+eiW2FrN4f+RfooJBAKWU+PG6F/npKlu9mZ59hH87fy3J1y6WKoDcjqwWgfKVbbGpPly7aL61H9gINXwVSggqUUq4cp4y3QsMzizK65IXmAkWJnie0ZygJTuGk61OCpS2T4m/jo/1f9jP7Xe6nN9gKRvarW3IKjOZ//VJECYAbKD9eE+jkM1SglLLZeF2hdCZROASUWh69GKAKpPhSe4qXzmjSA+Ntz1CBvr4krk646ZcigQr0SQFqMdTCVleALXfxq7S2I8xOAAJOCUkJTWfm11subYAEEuhrxB+/5Qr0GQjpYYWGCrSPEdRRjmu5JNjqM438UwtP46f1KAHCfLxMX95yU0FoPrWotiJIcPIv0EEBgXY1aoUO+lmhXULV1gSAFlht37Zoin/5c2gaQDt/NRCKj9YXKCkYtkhyR0Bae4GSggJ9qVB9KUozMOR1mU63YPJP9jRO/mmcHrvInsYFGv72GglK4wINn1NTQekMnd2BBCpQytGn8ektd3YGthW0+kyM1L7dbhRPq59AUyLlfIGWlxYSsOQTm1M8Vmj4lZfZl5yU6M8DTQVMN0z+yd8IhCokPdNpfVovTZjlZygJToKmAqb+aP44nsYj0MX/24wSjCpGoOG/dE4zOgWUzrdCocLoTGiBkj212BY47W/1+HFnqEDp0ICUSs8UylAC0o5boQJ9UqDMf8rnevznWy5dWlqFCODqDpXGL1BQTKAfvuVaoc8KWKFW6JAR5V8hoTOCzqjUnuant2jyR8+1dOsm/5cO1f6NhVZwCrj13wr67fVJH4GGLVagw6UozTC65NCtk+wpHltu+PKdBKXx2YLTem3LJv+zx6ffcmcHSJeGtiVSvAIlhcpxK/S1gFYoJNifq9Cy4DSfrEBdoZPj0V2pgEBLAXczF+huRMp4BFoKuJu5QHcjUsYj0FLA3cwFuhuRMh6BlgLuZi7Q3YiU8Qi0FHA3c4HuRqSMR6ClgLuZC3Q3ImU8Ai0F3M1coLsRKeP5B1JmPw76fvjqAAAAAElFTkSuQmCC",
  //   date: "25/9/2022",
  //   location: "someware",
  //   ticketsCount: 4,
  //   price: 25,
  //   transaction_id: "9huwephcr9eh8",
  // };

  const result = template(email_data);

  // fs.writeFileSync("./email_output.html", result);
  return result;
}

async function sendMail(reciverEmail, email_data) {
  // simulate failer while sending the email
  // throw new Error("hello");

  const senderEmail = process.env.email;
  console.log("[INFO] Sending an email to ", reciverEmail);
  //   const reciverEmail = "alaay0880@gmail.com";

  //   GMAIL PROVIDER
  //   const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: process.env.email,
  //       pass: process.env.emailpass,
  //     },
  //     logger: true,
  //   });

  // OUTLOOK PROVIDER
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // Office 365 server
    port: 587, // secure SMTP
    secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
    auth: {
      user: process.env.email,
      pass: process.env.emailpass,
    },
    tls: { ciphers: "SSLv3" },
  });

  const info = await transporter.sendMail({
    from: `"QRTickting" <${senderEmail}>`,
    to: reciverEmail,
    subject: "Event Ticket from QRTickting",
    //   text: "Hello world?",
    html: generateTemplate(email_data),
    headers: { "x-myheader": "test header" },
  });

  console.log("Message sent: %s", info.response);
}

module.exports = sendMail;
