const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FolderSchema = new Schema({
    name: String,
    path: String,
    created_at: Date,
    parent_dir: String,
    size: {
        type: Number,
        default: 0
    }
});

FolderSchema.pre("save", async function (next) {
    const { parent_dir } = this;
    // Find Parent Folder
    let folder = await FolderSchema.findOne({ _id: parent_dir });
    if (!folder) next();

    // Get options from save() call
    const options = this.$__.saveOptions;
    if (options.file_size) {
        // Update folder's file size
        folder.size += options.file_size;
        // Save folder doc
        await folder.save({ file_size: options.file_size });
        console.log(`Recursively updating folder ${this.name}`);


    } if (options.newName) {
        const { newName, folderName } = options;
        // Reflect change in folder children's paths
        FolderSchema.find({ path: new RegExp(folderName) }).then(doc => {
            doc.forEach(folder => {
                folder.path = folder.path.replace(folderName, newName);
                folder.save();
            });
        });



        // Pre-hook to update folder size
    } if (options.deleted_folder_size) {
        // Decrement Folder size
        folder.size -= options.deleted_folder_size;
        // Save folder doc
        await folder.save({ deleted_folder_size: options.deleted_folder_size });
    }



});






module.exports = FolderSchema = mongoose.model("Folder", FolderSchema);
