"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaData = new mongoose_1.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    category: { type: String, required: true },
    channelId: { type: String, required: true },
    claimer: { type: String, default: null },
    openin: { type: Date, required: true }
});
exports.default = (0, mongoose_1.model)('imonkey-ticket', schemaData);
