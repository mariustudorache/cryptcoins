const express = require("express");
const app = express();
var http = require('http').createServer(app);
const mongoose = require('mongoose');
require('dotenv/config');

//import swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//import routes
const cryproRoute = require('../routes/cryptos');

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


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', cryproRoute);

//doc api route
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



//connect to DB
mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("DB CONNECTED ");
    })


http.listen(PORT, function () {
    console.log(PORT);
});
