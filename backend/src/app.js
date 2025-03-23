const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})