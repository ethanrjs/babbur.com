// express app
// GET /bibblur returns contents of ./Bibblur.txt

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.get('/bibblur', function (req, res) {
    const filePath = 'Skrungler.txt';

    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.status(500).send('Something broke!');
            return;
        }

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
        readStream.pipe(res);

        readStream.on('error', error => {
            res.status(500).send('Something broke!');
        });
    });
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});
