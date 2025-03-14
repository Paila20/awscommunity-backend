const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  logo: { type: String, required: true },
  banner: { type: String, required: true },
  description: { type: String, required: true },
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
