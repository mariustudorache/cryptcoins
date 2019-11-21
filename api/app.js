const express = require("express");
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');
const cron = require('node-cron');
const logger = require('../logs/logger');
//import swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require('dotenv/config');

//import routes
const cryproRoute = require('../routes/cryptos');
const getCurData = require('../routes/getCryptData');





const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Crypto API",
            description: "Crypto API",
            contact: {
                name: "Marius Tudorache"
            },
            servers: ["http://localhost:3000"]
        }
    },
    // ['.routes/*.js']
    apis: ["../routes/cryptos.js"]
};




app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/view/');
    //console.log(process.cwd() + '/view/');
});


io.on('connection', function (socket) {

    logger.info('usuario conectado');
});

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', cryproRoute);
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// envia los datos cada 60 segundos
cron.schedule("* * * * *", function () {
    console.log("---------------------");
    const cryptData = getCurData.getCurrencyData();
    cryptData.then(function (data) {
        io.emit('updateData', data);
    })

    // io.emit('updateData', data);
    logger.info('recibo informacion de los precios cada 60 segundos');
});


// envia email cada hora
cron.schedule("* 1 * * *", function () {
    console.log("---------------------");
    logger.info('envio email cada hora');
});

//connect to DB
mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        logger.info('db connectada');
    })


http.listen(PORT, function () {
    logger.info('escucha en el puerto: ' + PORT)
});
