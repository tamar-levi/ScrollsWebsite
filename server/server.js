const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./db');
const userRouter = require('./routes/users');
const productRouter = require('./routes/products');
const emailRouter = require('./routes/email');
const paymentRouter = require('./routes/paymentRoutes');
const compression = require('compression');
require('./gmail-listener');

const corsOptions = {
  origin: process.env.REACT_URL,
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(compression());
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://googleapis.com https://apis.google.com; script-src-elem 'self' https://apis.google.com; object-src 'none';");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

connectDB();

app.use('/usersApi', userRouter); 
app.use('/productsApi', productRouter); 
app.use('/emailApi', emailRouter);
app.use('/paymentApi', paymentRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
