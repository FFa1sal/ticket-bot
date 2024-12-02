"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const discord_js_1 = __importStar(require("discord.js"));
const mongoose_1 = __importDefault(require("mongoose"));
const mainEmbed_1 = __importDefault(require("./functions/mainEmbed"));
const ticket_1 = __importDefault(require("./Schemas/ticket"));
const logs_chat_1 = __importDefault(require("logs.chat"));
dotenv_1.default.config();
const AdminUsers = ["709981152093667359","923618954499489872","1106701699260882984"];
const adminRoles = ["1297630830440742965","1297633370712310021","1292447883622223900","1301449481044230207"];
const parent1 = "1300233561957466204";
const parent2 = "1292447883865493573";
const parent3 = "1302254784455376907";
const parent4 = "1301495029327597588";
const prefix = "!";
const roles = {
    high: "1297630830440742965",
    support: "1297633370712310021",
    event: "1292447883622223900",
    shop: "1301449481044230207", 
};
// Discord Client
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.default.GatewayIntentBits.Guilds,
        discord_js_1.default.GatewayIntentBits.GuildMembers,
        discord_js_1.default.GatewayIntentBits.GuildMessages,
        discord_js_1.default.GatewayIntentBits.MessageContent,
    ],
});
client.on("messageCreate", async (m) => {
    if (m.author.bot)
        return;
    if (m.content === prefix + "ticket") {
        if (!AdminUsers.includes(m.author.id))
            return;
        const embMain = (0, mainEmbed_1.default)(`
            مرحبًا بك في نظام التذاكر 🎟

حيث هنا يمكنك فتح تذكرة 


تذكرة High <:emoji_221:1310657382744985770> 
تذكرة الدعم الفني <:emoji_221:1310657382744985770> 
تذكرة Event <:Partner_Yellow:1306646561979367505> 

الرجاء عند فتح التذكر الالتزام بالقوانين`);
        const OpenTicketButton = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setLabel("فتح تذكرة")
            .setEmoji('<:mk_boss:1297572166816104559>')
            .setCustomId(`ticket`)
            .setStyle(discord_js_1.ButtonStyle.Secondary));
        await m.delete();
        m.channel.send({
            embeds: [embMain],
            components: [OpenTicketButton],
        });
    }
});
//Ready && MongoDB Connect
if (typeof process.env.mongourl === "string") {
    mongoose_1.default
        .connect(process.env.mongourl)
        .then(() => {
        console.log("[MongoDB] Connect");
    })
        .catch((err) => {
        console.log("[MongoDB] Error Connect");
    });
}
client.on("ready", () => {
    client.user?.setActivity("Open Ticket!");
    client.user?.setStatus("dnd");
    console.log(`${client.user?.username} on ready!`);
});
//Functions
//interactionCreate
client.on("interactionCreate", async (i) => {
    if (i.user.bot)
        return;
    if (!i.isButton())
        return;
    if (i.customId === `ticket`) {
        const embed = (0, mainEmbed_1.default)(`*** قبل فتح التذكرة يرجى مراجعة القوانين
-
* ممنوع فتح تكت للأستهبال يعرضك للعقوبه المباشره !
* احترام اداري المتواجد في التكت !
* يجيب عليك انتظار الاداري ( ممنوع منشن دبل ) يعني مسموح ولاكن ليس بكثره !
* الجديه ب التكت !
* عدم التكرار بأي شكل من الاشكال
* ممنوع منشن مونكي او احد اعضاء عصابته المافيا 
* ممنوع منشن رتبة 
* ممنوع المزح بالتكت***
هل انت متأكد من فتح تذكره؟`);
        const yes = new discord_js_1.ButtonBuilder()
            .setLabel("نعم")
            .setCustomId(`yes_${i.user.id}`)
            .setStyle(discord_js_1.ButtonStyle.Success);
        const no = new discord_js_1.ButtonBuilder()
            .setLabel("لا")
            .setCustomId(`no_${i.user.id}`)
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const rows = new discord_js_1.ActionRowBuilder().addComponents(yes, no);
        const ticketmessage = await i.reply({
            embeds: [embed],
            components: [rows],
            ephemeral: true,
        });
    }
    if (i.customId === `no_${i.user.id}`) {
        await i.update({
            content: "تم بنجاح إلغاء فتح تذكره",
            embeds: [],
            components: []
        });
    }
    if (i.customId === `yes_${i.user.id}`) {
        const select = new discord_js_1.ActionRowBuilder().addComponents(
            new discord_js_1.StringSelectMenuBuilder()
                .setCustomId(`selectticket_${i.user.id}`)
                .setPlaceholder("Make a selection!")
                .addOptions(
                    new discord_js_1.StringSelectMenuOptionBuilder()
                        .setLabel("High")
                        .setValue("high"),
                    new discord_js_1.StringSelectMenuOptionBuilder()
                        .setLabel("الدعم الفني")
                        .setValue("support"),
                    new discord_js_1.StringSelectMenuOptionBuilder()
                        .setLabel("Event")
                        .setValue("event"),
                    new discord_js_1.StringSelectMenuOptionBuilder()
                        .setLabel("Shop")
                        .setValue("shop")
                )
        );
        await i.reply({
            components: [select],
            ephemeral: true,
        });
    }    
    if (i.customId.startsWith(`close`)) {
        const [, open, roleId] = i.customId.split("_");
        //roles if permissions
        if (i.member && i.inCachedGuild()) {
            if (!i.member.roles.cache.some((r) => r.id === roleId)) {
                return await i.reply({
                    embeds: [await (0, mainEmbed_1.default)(`لاتملك الصلاحيه!`, "System", "System")],
                    ephemeral: true,
                });
            }
            await i.reply({
                content: `سيتم اغلاق التذكره في خلال ثوان `,
                ephemeral: false,
            });
            setTimeout(async function () {
                const find = await ticket_1.default.findOne({
                    guildId: i.guild.id,
                    userId: open,
                });
                let messages = await i.channel?.messages.fetch();
                let createdChat = await logs_chat_1.default.create(messages);
                const logchannel = "1292447883865493575";
                if (messages && find) {
                    let embed = new discord_js_1.default.EmbedBuilder()
                        .setTitle(`Chat Created with ${messages.size} messages`)
                        .setColor("#5b6dcf")
                        .setFields({
                        name: "Ticket Open",
                        value: `<@${open}>`,
                    }, {
                        name: "Ticket Claim",
                        value: `${find.claimer ? `<@${find.claimer}>` : "No Ticket Claim"}`,
                    }, {
                        name: "Ticket Close",
                        value: `<@${i.user.id}>`,
                    }, {
                        name: "Open In ( ممكن فرق بسيط )",
                        value: `<t:${Math.floor(find.openin.getTime() / 1000)}:R>`,
                    }, {
                        name: "Close In ( ممكن فرق بسيط )",
                        value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
                    })
                        .setThumbnail(i.guild.iconURL())
                        .setDescription(`[View Chat Online](${createdChat.url})`);
                    const channel = await client.channels.cache.get(logchannel);
                    if (channel instanceof discord_js_1.TextChannel) {
                        channel.send({ embeds: [embed] });
                    }
                    await ticket_1.default.deleteOne({
                        guildId: i.guild.id,
                        userId: open,
                        category: find.category,
                        channelId: find.channelId,
                        claimer: find.claimer,
                    });
                    await i.channel?.delete();
                }
            }, 5000);
        }
    }
    if (i.customId.startsWith(`claim`)) {
        const [, claimer, roleId] = i.customId.split("_");
        //roles if permissions
        if (i.member && i.inCachedGuild()) {
            const isAdmin = i.member.roles.cache.some((r) => r.id === roleId);
            if (!isAdmin) {
                return await i.reply({
                    embeds: [await (0, mainEmbed_1.default)(`لاتملك الصلاحية!`, "System", "System")],
                    ephemeral: true,
                });
            }
        }
        const find = await ticket_1.default.findOne({
            guildId: i.guild?.id,
            userId: i.user.id,
        });
        if (find) {
            if (find.claimer !== null) {
                await i.reply({
                    content: `❌ بلفعل التذكرة مستلمة من قبل شخص آخر!`,
                    ephemeral: true, 
                });
                return;
            }
        
            const claimer = i.user.id; 
            await i.reply({
                content: [
                    `**__#- ~~Management server Monkey~~ <:mk_boss:1297572166816104559> __**`,
                    `\`-\` **__ اهـــلاََ ، مـــعــــك ﹝ <@${i.user.id}> ﹞ مــــن سيــــرفـــر مــــونــــكي ・كـــــيف اقــــدر اخــــدمـــــك (🤍<:mk_boss:1297572166816104559>) __**`,
                    `\`-\` **__ Welcome with you the administrator from the Monkey server how can I serve you (<:mk_boss:1297572166816104559>🤍)__**`
                ].join('\n\n'),
                ephemeral: false, 
            });
            find.claimer = claimer; 
            await find.save(); 
        }        
    }
});
client.on("interactionCreate", async (i) => {
    if (i.user.bot)
        return;
    if (!i.isStringSelectMenu())
        return;
    if (i.customId === `selectticket_${i.user.id}`) {
        const value = i.values[0];
        if (value === "high") {
            if (i.guild) {
                const find = await ticket_1.default.findOne({
                    guildId: i.guild.id,
                    userId: i.user.id,
                    category: value,
                });
                if (find) {
                    const embed = (0, mainEmbed_1.default)(`لديك بلفعل تذكره <#${find.channelId}>`);
                    await i.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }
                const channel = await i.guild.channels.create({
                    name: `ticket-${i.user.username}`,
                    type: discord_js_1.default.ChannelType.GuildText,
                    parent: parent1,
                    permissionOverwrites: [
                        {
                            id: i.user.id,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: roles.high,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: i.guild.roles.everyone,
                            deny: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                    ],
                });
                new ticket_1.default({
                    guildId: i.guild.id,
                    userId: i.user.id,
                    channelId: channel.id,
                    category: value,
                    openin: Date.now(),
                }).save();
                await i.reply({
                    content: `تم بنجاح فتح تذكرتك <#${channel.id}>`,
                    ephemeral: true,
                });
                const embed = (0, mainEmbed_1.default)(`
        ＲＵＬＥＳ ＴＩＣＫＥＴ<:emoji_214:1310657108643020891> 
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
**• سوف يتم رد عليك في اقرب وقت <:mk_boss:1297572166816104559> ⇲
• يرجى عدم المنشن <:emoji_220:1310656630760800337>  ⇲
• يرجى عدم الاستهزاء في تكت <:emoji_221:1310657382744985770> ⇲
**`);
                const rows = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setLabel("استلام")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setEmoji('<:mk_boss:1297572166816104559>')
                    .setCustomId(`claim_${i.user?.id}_${roles.high}`), new discord_js_1.ButtonBuilder()
                    .setLabel("اغلاق")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setEmoji('<:mk_boss:1297572166816104559>')
                    .setCustomId(`close_${i.user?.id}_${roles.high}`));
                await channel.send({
                    content: `<@${i.user.id}> | <@&${roles.high}>`,
                    embeds: [embed],
                    components: [rows],
                });
            }
        }
        if (value === "support") {
            if (i.guild) {
                const find = await ticket_1.default.findOne({
                    guildId: i.guild.id,
                    userId: i.user.id,
                    category: value,
                });
                if (find) {
                    const embed = (0, mainEmbed_1.default)(`لديك بلفعل تذكره <#${find.channelId}>`);
                    await i.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }
                const channel = await i.guild.channels.create({
                    name: `ticket-${i.user.username}`,
                    type: discord_js_1.default.ChannelType.GuildText,
                    parent: parent2,
                    permissionOverwrites: [
                        {
                            id: i.user.id,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: roles.support,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: i.guild.roles.everyone,
                            deny: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                    ],
                });
                new ticket_1.default({
                    guildId: i.guild.id,
                    userId: i.user.id,
                    channelId: channel.id,
                    category: value,
                    openin: Date.now(),
                }).save();
                await i.reply({
                    content: `تم بنجاح فتح تذكرتك <#${channel.id}>`,
                    ephemeral: true,
                });
                const embed = (0, mainEmbed_1.default)(`
    ＲＵＬＥＳ ＴＩＣＫＥＴ<:emoji_214:1310657108643020891> 
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
**• سوف يتم رد عليك في اقرب وقت <:mk_boss:1297572166816104559> ⇲
• يرجى عدم المنشن <:emoji_220:1310656630760800337>  ⇲
• يرجى عدم الاستهزاء في تكت <:emoji_221:1310657382744985770> ⇲
**`);
                const rows = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setLabel("استلام")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setEmoji('<:mk_boss:1297572166816104559>')
                    .setCustomId(`claim_${i.user?.id}_${roles.support}`), new discord_js_1.ButtonBuilder()
                    .setLabel("اغلاق")
                    .setEmoji('<:mk_boss:1297572166816104559>')
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setCustomId(`close_${i.user?.id}_${roles.support}`));
                await channel.send({
                    content: `<@${i.user.id}> | <@&${roles.support}>`,
                    embeds: [embed],
                    components: [rows],
                });
            }
        }      
        if (value === "event") {
            if (i.guild) {
                const find = await ticket_1.default.findOne({
                    guildId: i.guild.id,
                    userId: i.user.id,
                    category: value,
                });
                if (find) {
                    const embed = (0, mainEmbed_1.default)(`لديك بلفعل تذكره <#${find.channelId}>`);
                    await i.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }
                const channel = await i.guild.channels.create({
                    name: `ticket-${i.user.username}`,
                    type: discord_js_1.default.ChannelType.GuildText,
                    parent: parent3,
                    permissionOverwrites: [
                        {
                            id: i.user.id,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: roles.event,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: i.guild.roles.everyone,
                            deny: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                    ],
                });
                new ticket_1.default({
                    guildId: i.guild.id,
                    userId: i.user.id,
                    channelId: channel.id,
                    category: value,
                    openin: Date.now(),
                }).save();
                await i.reply({
                    content: `تم بنجاح فتح تذكرتك <#${channel.id}>`,
                    ephemeral: true,
                });
                const embed = (0, mainEmbed_1.default)(`
    ＲＵＬＥＳ ＴＩＣＫＥＴ<:emoji_214:1310657108643020891> 
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
**• سوف يتم رد عليك في اقرب وقت <:mk_boss:1297572166816104559> ⇲
• يرجى عدم المنشن <:emoji_220:1310656630760800337>  ⇲
• يرجى عدم الاستهزاء في تكت <:emoji_221:1310657382744985770> ⇲
**`);
                const rows = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setLabel("استلام")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setEmoji('<:mk_boss:1297572166816104559>')
                    .setCustomId(`claim_${i.user?.id}_${roles.event}`), new discord_js_1.ButtonBuilder()
                    .setLabel("اغلاق")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setCustomId(`close_${i.user?.id}_${roles.event}`)
                    .setEmoji('<:mk_boss:1297572166816104559>'));
                await channel.send({
                    content: `<@${i.user.id}> | <@&${roles.event}>`,
                    embeds: [embed],
                    components: [rows],
                });
            }
        }
        if (value === "shop") {
            if (i.guild) {
                const find = await ticket_1.default.findOne({
                    guildId: i.guild.id,
                    userId: i.user.id,
                    category: value,
                });
                if (find) {
                    const embed = (0, mainEmbed_1.default)(`لديك بلفعل تذكرة <#${find.channelId}>`);
                    await i.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }
                const channel = await i.guild.channels.create({
                    name: `ticket-${i.user.username}`,
                    type: discord_js_1.default.ChannelType.GuildText,
                    parent: parent4,
                    permissionOverwrites: [
                        {
                            id: i.user.id,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: roles.shop, 
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: i.guild.roles.everyone,
                            deny: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                    ],
                });
                new ticket_1.default({
                    guildId: i.guild.id,
                    userId: i.user.id,
                    channelId: channel.id,
                    category: value,
                    openin: Date.now(),
                }).save();
                await i.reply({
                    content: `تم بنجاح فتح تذكرتك <#${channel.id}>`,
                    ephemeral: true,
                });
                const embed = (0, mainEmbed_1.default)(`
    ＲＵＬＥＳ ＴＩＣＫＥＴ<:emoji_214:1310657108643020891> 
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
**• سوف يتم رد عليك في اقرب وقت <:mk_boss:1297572166816104559> ⇲
• يرجى عدم المنشن <:emoji_220:1310656630760800337>  ⇲
• يرجى عدم الاستهزاء في تكت <:emoji_221:1310657382744985770> ⇲
**`);
                const rows = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setLabel("استلام")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setEmoji('<:mk_boss:1297572166816104559>')
                    .setCustomId(`claim_${i.user?.id}_${roles.shop}`), 
                    new discord_js_1.ButtonBuilder()
                    .setLabel("إغلاق")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setCustomId(`close_${i.user?.id}_${roles.shop}`)
                    .setEmoji('<:mk_boss:1297572166816104559>'));
                await channel.send({
                    content: `<@${i.user.id}> | <@&${roles.shop}>`,
                    embeds: [embed],
                    components: [rows],
                });
            }
        }  
    }
});
//Login
client.login("MTMxMTgyODcxMDkzMjA5MDkwMA.G7NwMh.eBhFgc3fjlmMJEPTvHDU-aG1Q1ABMwTRft3Zp8");
//Error Handle
process.on("unhandledRejection", (error) => {
    return console.log(error);
});
process.on("uncaughtException", (error) => {
    return console.log(error);
});
process.on("uncaughtExceptionMonitor", (error) => {
    return console.log(error);
});
