"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./modules/routes"));
const connectDB_1 = require("./DB/config/connectDB");
const cors_1 = __importDefault(require("cors"));
const graphql_http_1 = require("graphql-http");
const main_graphql_1 = require("./modules/graphql/main.graphql");
const app = (0, express_1.default)();
const bootstrap = async () => {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use('/api/v1', routes_1.default);
    const port = process.env.PORT || 5000;
    app.all('/graphQl', (0, graphql_http_1.createHandler)({
        schema: main_graphql_1.schema, context: (req) => ({
            user: req.raw.headers.authorization
        })
    }));
    await (0, connectDB_1.DBconnection)();
    app.use((err, req, res, next) => {
        console.log({ err });
        res.status(err.statusCode || 500).json({
            message: err.message,
            stack: err.stack,
            status: err.statusCode || 500
        });
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
exports.default = bootstrap;
