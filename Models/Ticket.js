const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  qrimg: { type: String, required: true },
  transaction_id: { type: String, required: true, unique: true },
  scanlimit: { type: Number, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("Ticket", ticketSchema);

// Vodafone Table
// transaction_d
// phoneNumber
// Payed_Amount
