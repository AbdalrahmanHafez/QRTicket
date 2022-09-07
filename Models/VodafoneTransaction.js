const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vodafoneTransactionSchema = new Schema({
  transaction_id: { type: String, required: true },
  payedAmount: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model(
  "VodafoneTransactions",
  vodafoneTransactionSchema
);

// Vodafone Table
// transaction_d
// phoneNumber
// Payed_Amount
