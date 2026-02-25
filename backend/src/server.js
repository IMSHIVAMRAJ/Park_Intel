require ("dotenv").config();
console.log(process.env.DB_PASS);

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`🚗 Park-Intel Server Running on Port ${PORT}`);
});