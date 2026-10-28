const {google}=require("googleapis");
const path =require("path")
require("dotenv").config();
const { Readable } = require("stream");
const bufferToStream = (buffer) => {
    return new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      }
    });
  };

const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(__dirname, "..", process.env.GOOGLE_SERVICE_KEY_PATH_SOLARTAX),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

const drive=google.drive({
    version:"v3",
    auth
})

const uploadToDriveSolar=async(buffer,fileName)=>{
    try{
    const fileMetaData={
        name:fileName,
        parents:[process.env.GOOGLE_FOLDER_ID_SOLARTAX]
    }
    //cinverting file data to pdf
    const media={
        mimeType:"application/pdf",
        body:bufferToStream(buffer),
    }
    //uploading google file 
    const uploadtedFile=await drive.files.create({
        resource:fileMetaData,
        media:media,
        fields:"id , webViewLink"
    })
    await drive.permissions.create({
        fileId:uploadtedFile.data.id,
        requestBody:{
            role:"reader",
            type:"anyone"
        }


    })
    return uploadtedFile.data.webViewLink;
}catch(error){
    console.error("Error uploading to Google Drive:", error.message)
    throw error;

}
}

module.exports=uploadToDriveSolar;


