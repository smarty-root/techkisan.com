const  mongoose=require('mongoose');

const taxQuotationSchema = new mongoose.Schema({
    quotationNumber: { type: String, required: true, unique: true },
    partyName: { type: String,default:""},
    DateOfIssue:{type:String,default:""},
    quotationPDF: { type:String,default:"" }, // Store PDF as Buffer
})

module.exports = mongoose.model("TaxQuotation", taxQuotationSchema);