import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/configdb.js';
import routes from './routes/index.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

routes(app);
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});