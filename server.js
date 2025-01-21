require('dotenv').config()

const express = require("express")
const cors = require("cors")

const app = express()
const connectDB  = require('./database/db');
const authRoutes = require("./routes/auth-routes")
const homeRoutes = require("./routes/home-routes")
const adminRoutes = require("./routes/admin-routes");
const uploadImageRoutes = require('./routes/image-routes')

connectDB();

const PORT = process.env.PORT || 3000;
app.use(express.json());


app.use("/api/auth" , authRoutes)
app.use("/api/home" , homeRoutes)
app.use("/api/admin" , adminRoutes)
app.use("/api/image" , uploadImageRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running on potr ${PORT}`);
    
})

