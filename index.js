const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const Folder = require("./Folder");
const File = require("./File");

mongoose.set("useFindAndModify", false);
mongoose
    .connect("mongodb://localhost:27017/ik", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected !"))
    .catch((err) => console.log(err));

const folders = [
    {
        size: 0,
        created_at: Date.now(),
        name: "folder4",
        parent_dir: "60f672c38fa77fb971094e96",
    },
];

const files = [
    {
        size: 0,
        created_at: Date.now(),
        name: "file1",
        parent_dir: "60f672c38fa77fb971094e96",
    },
    {
        size: 0,
        created_at: Date.now(),
        name: "file2",
        parent_dir: "60f672c38fa77fb971094e97",
    },
    {
        size: 0,
        created_at: Date.now(),
        name: "file3",
        parent_dir: "60f672c38fa77fb971094e98",
    },
];

app.get("/folder-stat", async (req, res) => {
    const folders = await Folder.find();
    return res.json(folders);
});

app.get("/file-stat", async (req, res) => {
    const files = await File.find().sort({ created_at: 1 });
    return res.json(files);
});

app.get("/search", async (req, res) => {
    // Every filename which contains file1 in it and is of type jpg
    const filesFound = await File.find({
        name: new RegExp("file"),
        type: new RegExp("jpg"),
    });
    return res.json(filesFound);
});

app.get("/", async (req, res) => {
    // await Folder.updateMany(
    // {},
    // {
    // $set: { path: "/" },
    // }
    // );

    
    // const fileName = "filex.jpg";
    // const fileType = fileName.split(".")[1];

    // const newFile = new File({
        // size: 100,
        // created_at: Date.now(),
        // name: fileName,
        // type: fileType,
        // parent_dir: "60f7c213f0d2d5eb1bd1a18c",
        // url: "https://s3-ap-southeast-2.amazonaws.com/test-bucket/filex.jpg"
    // });
    // await newFile.save();



    // Find the folder to be deleted.
    const folder = await Folder.findOne({ name: "folder3" });
    // Call save() to trigger pre-hook
    await folder.save({ deleted_folder_size: folder.size });
    // Delete all files in the folder.
    await File.deleteMany({ parent_dir: folder._id });
    // Delete all folders in the folder.
    await Folder.deleteMany({ parent_dir: folder._id });
    // Delete the folder
    await Folder.deleteOne({ name: "folder3" });



    // const folderName = "folder2";
    // const renameTo = "folderx";
    // let folder = await Folder.findOne({ name: folderName });
    // folder.name = renameTo;

    // await folder.save({folderName: folderName, newName: renameTo });


    // // Parent Directory's ID (null for root)
    // const parentDirectory = "60f7c1f8a16d23eb035c4ad5";
    // // Find parent directory
    // const parentFolder = await Folder.findOne({ _id: parentDirectory });
    // const folderName = "folder4";
    // // Create new folder with path = parentFolderPath + folderName + "/"
    // const newFolder = new Folder({
        // name: folderName,
        // created_at: Date.now(),
        // size: 0,
        // parent_dir: parentDirectory,
        // path: parentDirectory ? parentFolder.path + folderName + "/" : "/",
    // });

    // // Save folder
    // await newFolder.save();

    // await Folder.deleteMany({});
    // await Folder.updateMany({}, { $set: { "size": 0 } });
    // await Folder.insertMany(folders);

    res.end("done");
});

app.listen(PORT, "0.0.0.0", () => console.log(`Server at ${PORT}`));
module.exports = app;
