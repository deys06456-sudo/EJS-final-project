const mongoose=require('mongoose');
const DBConnection=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connect");
    } catch (error) {
        console.log (error);
    }
}

module.exports = DBConnection