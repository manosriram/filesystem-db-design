const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Folder = require("./Folder");

let FileSchema = new Schema({
    name: String,
    path: String,
    type: String,
    created_at: Date,
    parent_dir: String,
    size: Number
});

FileSchema.pre("save", async function(next) {
    const { parent_dir } = this;
    // Find Parent Folder
    let folder = await Folder.findOne({ _id: parent_dir });
    // Update Parent Folder's size
    folder.size += this.size;
    // Save folder given, current file's size as argument.
    await folder.save({ file_size: this.size });
});

module.exports = FileSchema = mongoose.model("File", FileSchema);
