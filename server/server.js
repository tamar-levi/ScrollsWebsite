const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./db');
const userRouter = require('./routes/users');
const productRouter = require('./routes/products');

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));
app.use(express.json()); 
connectDB();

app.use('/usersApi', userRouter); 
app.use('/productsApi', productRouter); 

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
