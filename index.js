require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const router = require('./app/router');
const multer = require('multer');

const port = process.env.PORT || 3000;
const server = express();
const bodyParser = multer();

server.use(express.static(__dirname + '/public'));

server.use(cors({
    origin: '*',
}));

// get access to req.body
server.use(express.urlencoded({
    extended: true,
}));

// multipart/form-data
server.use(bodyParser.none());

// Escape html from the req.body for security
server.use((req, res, next) => {
    if (req.body) {
        for (const property in req.body) {
            req.body[property] = sanitizeHtml(req.body[property]);
        }
    }
    next();
});

server.use(router);

server.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});