const moongose = require("mongoose");

const profileSchema = new moongose.Schema({
    userId: { type: String, require: true, unique: true },
    serverId: { type: String, require: true },
    userPoints: { type: Number, default: 0 },
});

const model = moongose.model("AnisDB", profileSchema);

module.exports = model;