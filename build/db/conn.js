"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectToDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToDB(address) {
    try {
        console.log(`Attempting to connect to mongodb://${address}/titanrooms`);
        await mongoose_1.default.connect(`mongodb://${address}/titanrooms`);
        console.log(`connected to MongoDB at ${address}`);
    }
    catch (error) {
        console.log(`Attempted to connect to mongodb://${address}/titanrooms\n`);
        console.error('Error connecting to MongoDB:', error);
    }
}
