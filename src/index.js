import TelegramBot from "node-telegram-bot-api";
import { FLAGS } from "./constants";
import { shuffle } from "./utils";

// @FlagsCountryBot
const Telegram = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

Telegram.onText(/\/start/, sendNewQuestion);

Telegram.on("callback_query", function (query) {
    const chatId = query.message.chat.id;

    switch (query.data) {
        case "Yes":
            Telegram.sendMessage(chatId, "✅ Верный ответ!");
            break;
        case "No":
            Telegram.sendMessage(chatId, "❌ Неверный ответ!");
            break;
        default:
            break;
    }

    removeKeyboard(query);
    sendNewQuestion(query.message);
});

const getRandomCountry = () => {
    const randIndex = Math.floor(Math.random() * FLAGS.length);
    return FLAGS[randIndex];
};

function sendNewQuestion(msg) {
    const chatId = msg.chat.id;
    const currentCountry = getRandomCountry();
    const options = {
        reply_markup: {
            inline_keyboard: shuffle([
                [{ text: currentCountry.name, callback_data: "Yes" }],
                [{ text: getRandomCountry().name, callback_data: "No" }],
                [{ text: getRandomCountry().name, callback_data: "No" }],
                [{ text: getRandomCountry().name, callback_data: "No" }]
            ])
        }
    };

    Telegram.sendPhoto(chatId, `public/${currentCountry.code}.png`, options);
}

const removeKeyboard = query => {
    Telegram.editMessageReplyMarkup(
        {
            inline_keyboard: []
        },
        {
            chat_id: query.from.id,
            message_id: query.message.message_id
        }
    );
};
