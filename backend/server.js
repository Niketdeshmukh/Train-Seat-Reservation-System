const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const seatRoutes = require('./routes/seatRoutes');
const { initializeSeats } = require('./controllers/seatController');

const app = express();
app.use(cors({
  origin: '*', // Allow requests only from your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// Config dotenv and connect to MongoDB
dotenv.config();
connectDB();


initializeSeats({}, { status: () => ({ json: () => {} }) });
app.use(express.json());
app.use(cors());

app.use('/api/seats', seatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
