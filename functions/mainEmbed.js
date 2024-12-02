"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mainembed;
const discord_js_1 = require("discord.js");
function mainembed(des, footer, fields) {
    return new discord_js_1.EmbedBuilder()
        .setDescription(des)
        .setTimestamp()
        .setFooter({
        text: `MK Bot - ${footer ? footer : "System"}`,
        iconURL: "https://cdn.discordapp.com/avatars/1297580954403209267/86395b438d5d32792a0f1fecdeeed3c6.png?size=1024"
    })
        .setColor('Red')
        .setAuthor({
        name: `MK Bot - ${fields ? fields : "System"}`,
        iconURL: "https://cdn.discordapp.com/avatars/1297580954403209267/86395b438d5d32792a0f1fecdeeed3c6.png?size=1024"
    });
}
