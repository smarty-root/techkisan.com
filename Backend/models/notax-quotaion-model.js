const mongoose=require('mongoose');

const notaxQuotationSchema=new mongoose.Schema({
    quotationNumber: { type: String, required: true, unique: true },
    partyName: { type: String,default:""},
    DateOfIssue:{type:String,default:""},
    quotationPDF: { type:String,default:"" }, 
})

module.exports=mongoose.model("NoTaxQuotation",notaxQuotationSchema);
