require('dotenv').config()
const path = require("path");
const { Telegraf } = require("telegraf");
const {getGigaResponse} = require("./getGigaResponse");
const {TelegramClient} = require("telegram");
process.env.NODE_EXTRA_CA_CERTS= path.resolve(__dirname, 'certificates')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
const client = new TelegramClient(process.env.TELEGRAM_SESSION, process.env.TELEGRAM_API_ID, process.env.TELEGRAM_API_HASH, {});

bot.start((ctx) => ctx.reply('Привет :)'))

bot.command('sum', async (ctx) => {
    const [, ...request] = ctx.update.message.text.split(' ');

    try {
        const response = await getGigaResponse(request.join(' '));
        ctx.reply(response)
    } catch(e) {
        console.log(e);
        ctx.reply('Sth goes wrong :*(')
    }
})

;(async () => {
    await client.connect();

    bot.command('/ch', async (ctx) => {

    })

    bot.launch();
})();