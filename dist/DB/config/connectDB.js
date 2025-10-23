"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DBConnection = async () => {
    return await mongoose_1.default
        .connect(process.env.LOCAL_DATA_BASE_URL)
        .then(() => {
        console.log("Database connected successfully");
    })
        .catch((err) => {
        console.log("DB Error => ", err);
    });
};
exports.DBConnection = DBConnection;
