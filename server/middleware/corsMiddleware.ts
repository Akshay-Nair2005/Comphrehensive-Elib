import express from "express";

export const applyMiddlewares = (app: express.Application): void => {
    // Enable CORS
    const cors = require("cors");
    app.use(cors());
    app.use(express.json());
    const bodyParser = require("body-parser")
    app.use(bodyParser.json())

};
