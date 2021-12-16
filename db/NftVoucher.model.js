var mongoose = require('mongoose');
// import mongoose from "mongoose"

var Schema = mongoose.Schema;

var nftVoucherSchema = new Schema(
  {
    // tokenId: { type: Number, required: true, unique: true },
    tokenId: Number,
    uri: String,
    minPrice: Number,
    signature: String
  },
  {
    collection: 'lazymint-test'
  }
);

module.exports = mongoose.model('lazymint-voucher', nftVoucherSchema);