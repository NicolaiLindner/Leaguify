const express = require("express");
const app = express();

const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.static(__dirname + "/public"));

app.listen(3000, () => {
  console.log('Running on http://${HOST}:${PORT}');
});
