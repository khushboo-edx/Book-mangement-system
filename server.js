const express = require('express');
const app = express();
const port = 8000;

app.use('/', require('./routes'));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});