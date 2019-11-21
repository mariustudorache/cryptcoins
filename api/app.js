const express = require("express");
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');
const logger = require('../logs/logger');
const cron = require('node-cron');
const emailSender = require('../emailsender/sendEmailData');
require('dotenv/config');

//import swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//import routes
const cryproRoute = require('../routes/cryptos');
const getCurData = require('../routes/getCryptData');

const PORT = process.env.PORT || 3000;


//swagger options
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
    apis: ["./routes/cryptos.js"]
};


io.on('connection', function (socket) {

    logger.info('usuario conectado');
});


// recibe los datos de api cada 60 segundos
cron.schedule("* * * * *", function () {
    console.log("---------------------");
    const cryptData = getCurData.getCurrencyData();
    cryptData.then(function (data) {
        io.emit('updateData', data);
    })
    logger.info('recibo informacion de los precios cada 60 segundos');
});


// envia email cada hora
cron.schedule("* 1 * * *", function () {
    //emailSender
    logger.info('email enviado');
});




app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', cryproRoute);

//doc api route
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



//connect to DB
mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        logger.info("DB CONNECTED ");
    })


http.listen(PORT, function () {
    logger.info("server listen in: " + PORT);
});
