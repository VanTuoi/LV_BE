// Third library
import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
require("dotenv").config();

// In the project
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/index";
import connection from "./config/connectDB"
import configCors from './config/cors'

// Default port
const PORT = process.env.PORT || 8080;
const app = express();

// config middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())

// config
configCors(app);
configViewEngine(app);

// Router
initWebRoutes(app);

// Test connect BD
connection();

app.listen(PORT, () => {
    console.log('Services Store run in port ' + PORT)
})