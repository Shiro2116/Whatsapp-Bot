/* eslint-disable max-len */
/* eslint-disable no-console */
const { create, decryptMedia } = require('@open-wa/wa-automate');
const { tz } = require('moment-timezone');
// const videoUrlLink = require('video-url-link');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const korona = require('./korona');
const quotes = require('./quotes');
const menu = require('./menu');
const { wallpaper } = require('./wallpaper');
const { getZodiak } = require('./zodiak');

const debug = async (text) => {
    console.log(`${tz('Asia/Jakarta').format('LTS')} 🤖 => ${text}`);
};

const messageHandler = async (message, client) => {
    // eslint-disable-next-line object-curly-newline
    const { from, sender, caption, type, quotedMsg, mimetype, body, isMedia, chat, isGroupMsg, chatId } = await message;

    const commandArgs = caption || body || '';
    const command = commandArgs.toLowerCase().split(' ')[0];
    const args1 = commandArgs.split(' ')[1];
    const args2 = commandArgs.split(' ')[2];

    const phoneNumber = parsePhoneNumberFromString(from, 'ID');
    const number = phoneNumber ? phoneNumber.number : '';
    const name = sender.pushname || chat.name || sender.verifiedName || '';

    const stickerCreatedMsg = `(${name} - ${number}) membuat stiker 🚀`;
    const inMsg = `(${name} - ${number}) mengirim pesan ${command} 📩`;
    const inMsgImgNoCapt = `(${name} - ${number}) mengirim gambar tanpa caption 📩`;
    const waitStickerMsg = '_Tunggu bentar stiker nye lagi dibuat,kalau sudah dapet pesan ini tinggal tunggu aja ya ⏳_';
    const thxMsg = '_Iya sama - sama 🤖_';
    // const waitVidMsg = '_Video lagi di upload tunggu aja 🎥_';
    const waitDataMsg = '_Tunggu sebentar data lagi di proses ⏳_';
    const wrongMsg = '_Kayaknya ada yang salah, coba nanti lagi 🚴🏻_';
    const noCaptMsg = '_Pakai caption ya jangan gambar doang atau kalau lupa tinggal bales aja digambarnya, ketik #menu 🤖_';
    const unkMsg = '_Yang bener dong coba ketik *#menu*, kalau ngasal nanti aku block lho 🤖_';
    const doneMsg = '_Tugas selesai 👌, buat liat semua menu bot ketik *#menu*, kalau mau share ke temen - temen kalian atau masukin ke grup juga boleh_';

    try {
        switch (command) {
            case '#sticker':
            case '#stiker':
            case 'stiker':
            case '#Stiker':
            case '#Sticker':
            case 'sticker':
            case 'Stiker':
            case 'Sticker':
                if (isMedia && type === 'image') {
                    debug(inMsg);
                    debug(stickerCreatedMsg);
                    client.sendText(from, waitStickerMsg);
                    const mediaData = await decryptMedia(message);
                    const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`;
                    client.sendImageAsSticker(from, imageBase64);
                    client.sendText(from, doneMsg);
                }
                if (quotedMsg && quotedMsg.type === 'image') {
                    debug(inMsg);
                    debug(stickerCreatedMsg);
                    client.sendText(from, waitStickerMsg);
                    const mediaData = await decryptMedia(quotedMsg);
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`;
                    client.sendImageAsSticker(from, imageBase64);
                    client.sendText(from, doneMsg);
                }
                break;
            case '#menu':
            case 'menu':
            case 'Menu':
                debug(inMsg);
                client.sendText(from, menu);
                break;
            case '#korona':
            case 'corona':
                debug(inMsg);
                client.sendText(from, waitDataMsg);
                client.sendText(from, await korona());
                client.sendText(from, doneMsg);
                break;
            case '#quotes':
            case 'quotes':
            case 'Quotes':
                debug(inMsg);
                client.sendText(from, waitDataMsg);
                client.sendText(from, quotes());
                client.sendText(from, doneMsg);
                break;
            case '#kontak':
                client.sendText(from, '*Kontak Owner* \n *Whatsapp: wa.me/6285156022061* \n *Instagram: @hendy29_*')
                break
            case '#donasi':
                client.sendText(from, '*Donasi Membatu saya untuk membangun bot ini \n\n Dana/ovo/linkaja/gopay\n\n Nomor : 082166937293*')
                break
            case '#rules':
            case 'Rules':
                client.sendText(from, ` 	
            -=[ RULES Hzro BOT ]=-

            • *Jangan spam bot ..* 
            • *Jangan rusuh kalo bot gaaktif*
            • *Jangan telfon / vc bot nya ..*
                 ( _auto block_ )
            • *Jangan req yang aneh aneh ..*
              _seperti mendownload video ber jam jam_
              
            • *Sesuai kan perintah dengan formatnya..*
            
            _salah format dan bot error = block_
            
            Konsekuensi :
            
             Melanggar rules bot akan keluar 
            atau member yang nge rusuh harus di kick 
            
            
            Rules ini untuk kenyamanan semua yang memakai
            bot ini
            
 
*Created by Suhendi*` )
                break
            // case '#ig':
            //   debug(inMsg);
            //   client.sendText(from, waitDataMsg);
            //   await videoUrlLink.instagram.getInfo(args, async (error, info) => {
            //     if (error) {
            //       client.sendText(from, wrongMsg);
            //       console.log(error.message);
            //     } else {
            //       const url = info.list[0].video ? info.list[0].video : info.list[0].image;
            //       client.sendText(from, waitVidMsg);
            //       await client.sendFileFromUrl(from, url);
            //       client.sendText(from, doneMsg);
            //     }
            //   });
            //   break;
            case '#wp':
            case 'wallpaper':
            case 'Wallpaper':
                debug(inMsg);
                client.sendText(from, waitDataMsg);
                wallpaper
                    .then((result) => {
                        client.sendFileFromUrl(from, result);
                        client.sendText(from, doneMsg);
                    })
                    .catch((error) => {
                        client.sendText(from, wrongMsg);
                        console.log(error.message);
                    });
                break;
            case '#zodiak':
            case 'zodiak':
            case 'Zodiak':
                debug(inMsg);
                client.sendText(from, waitDataMsg);
                getZodiak(args1, args2)
                    .then((result) => {
                        client.sendText(from, result);
                        client.sendText(from, doneMsg);
                    })
                    .catch((error) => {
                        client.sendText(from, wrongMsg);
                        console.log(error.message);
                    });
                break;
            default:
                if (!isGroupMsg) {
                    const thanks = ['terimakasi', 'makasi', 'thx', 'thank', 'trim', 'tq', 'thank you'];
                    const isThanks = !!new RegExp(thanks.join('|')).test(commandArgs.toLowerCase());
                    if (type === 'image' && !caption) {
                        debug(inMsgImgNoCapt);
                        client.sendText(from, noCaptMsg);
                    } else if (isThanks) {
                        debug(inMsg);
                        client.sendText(from, thxMsg);
                    } else {
                        debug(inMsg);
                        client.sendText(from, unkMsg);
                    }
                }
                break;
        }
    } catch (error) {
        client.sendText(from, wrongMsg);
        console.log(error.message);
    } finally {
        // mark unread
        client.markAsUnread(chatId);
    }
};

const start = async (client) => {
    debug('The bot has started');
    client.onStateChanged((state) => {
        debug(`state changed - ${state.toLowerCase()} 🚑`);
        if (state === 'CONFLICT') client.forceRefocus();
    });
    // handle unread message after downtime
    const unreadMessages = await client.getAllUnreadMessages();
    unreadMessages.forEach((element) => {
        messageHandler(element, client);
    });
    // handle live message
    client.onMessage(async (message) => {
        messageHandler(message, client);
    });
};

const options = {
    headless: false,
    cacheEnabled: false,
    // customUserAgent: 'Mozilla/5.0 (Windows NT 6.2; rv:20.0) Gecko/20121202 Firefox/20.0',
};
if (process.platform === 'darwin') options.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (process.platform === 'linux') options.executablePath = '/usr/bin/google-chrome-stable';
if (process.platform === 'win32' || process.platform === 'win64') options.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

create(options)
    .then(async (client) => start(client))
    .catch((error) => console.log(error));
