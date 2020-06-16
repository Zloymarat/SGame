const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/info', (req, res) => {
    res.send(JSON.stringify({"name":"Pablo", "score":80}))
});

app.listen(8000, () => {
    console.log("server is listening on port 8000");
});