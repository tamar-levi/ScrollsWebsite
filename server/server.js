const express = require('express');
const cors = require('cors'); 
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',  
  methods: ['GET', 'POST'],  
};

app.use(cors(corsOptions)); 
app.use(express.json());  

app.post('/api/users', (req, res) => {
  const { username, email } = req.body;
  console.log(`User created: ${username}, ${email}`);
  
  res.status(201).json({
    message: 'User created successfully',
    user: { username, email }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
