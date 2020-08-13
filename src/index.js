require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/echo (.+)/, function (msg, match) {
    const fromId = msg.from.id;
    const resp = match[1];
    bot.sendMessage(fromId, resp);
});

bot.on("message", function (msg) {
    const chatId = msg.chat.id;
    bot.sendPhoto(chatId, "public/us.png");
});
