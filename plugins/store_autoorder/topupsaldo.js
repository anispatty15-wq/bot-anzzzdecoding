import { getDatabase } from "../../src/lib/ourin-database.js";
import { PaymentGateway, startPgPolling } from "../../src/lib/ourin-pg.js";
import config from "../../config.js";

const pg = new PaymentGateway(config.paymentGateway || {});

const pluginConfig = {
    name: "topupsaldo",
    alias: ["isisaldo", "deposit"],
    category: "store_autoorder",
    description: "🛒 Isi saldo menggunakan Payment Gateway",
    usage: ".topupsaldo <nominal>",
    example: ".topupsaldo 5000",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
};

function formatPrice(n) {
    return "Rp " + n.toLocaleString("id-ID");
}

async function handler(m, { sock }) {
    const db = getDatabase();
    startPgPolling(sock, db, pg);

    if (m.isGroup && m.groupMetadata) {
        const groupData = db.getGroup(m.chat) || {};
        if (groupData.botMode !== "autoorder" || !groupData.storeConfig?.autoorder) {
            return m.reply(`❌ *Autoorder Tidak Aktif*\n\nFitur topup saldo hanya tersedia di grup dengan mode autoorder aktif.`);
        }
    }

    const args = m.text?.trim().split(/\s+/) || [];
    const amount = parseInt(args[0]);
    const minTopup = config.storeAutoorder?.minTopup || 5000;
    const feePct = config.storeAutoorder?.feeTopup || 0.003;

    if (isNaN(amount) || amount < minTopup) {
        return m.reply(
            `⚠️ *Nominal Topup Tidak Valid*\n\n` +
            `Minimal topup saldo adalah *${formatPrice(minTopup)}*.\n\n` +
            `Contoh:\n` +
            `> \`${m.prefix}topupsaldo 10000\``
        );
    }

    await m.react("🕕");
    
    const fee = Math.ceil(amount * feePct);
    const total = amount + fee;
    const topupId = `TOP-${Date.now()}`;

    const qr = await pg.createPay({
        amount: total,
        product_name: `Topup Saldo ${m.pushName}`,
        customer_name: m.pushName,
        order_id: topupId
    });

    if (!qr || !qr.ok || !qr.ref) {
        await m.react("❌");
        return m.reply(`❌ *Gagal Membuat Invoice*\n\nSistem Payment Gateway sedang bermasalah. Silakan coba lagi nanti.`);
    }

    const topups = db.setting('pgTopups') || {};
    topups[topupId] = {
        id: topupId,
        userJid: m.sender,
        chatJid: m.chat,
        amount,
        fee,
        total,
        st: "pending",
        createdAt: Date.now()
    };
    db.setting('pgTopups', topups);

    const payments = db.setting('pgPayments') || {};
    payments[qr.ref] = {
        topupId,
        userJid: m.sender,
        type: "topup",
        raw: qr,
        st: "pending"
    };
    db.setting('pgPayments', payments);

    let txt = `💰 *INVOICE TOP UP SALDO*\n\n`;
    txt += `🆔 Top Up ID: \`${topupId}\`\n`;
    txt += `💵 Saldo Masuk: *${formatPrice(amount)}*\n`;
    txt += `🧾 Admin Fee: *${formatPrice(fee)}*\n`;
    txt += `💳 Total Bayar: *${formatPrice(total)}*\n`;
    txt += `🔖 Ref No: \`${qr.ref}\`\n\n`;
    txt += `_Silakan bayar menggunakan QRIS atau Link di bawah ini._\n`;
    txt += `_Saldo akan otomatis masuk setelah pembayaran berhasil._ 🔄`;

    if (qr.qr) {
        await sock.sendMessage(m.chat, { image: { url: qr.qr }, caption: txt }, { quoted: m });
    } else if (qr.link) {
        txt += `\n\n🔗 Link Bayar: ${qr.link}`;
        await m.reply(txt);
    } else {
        await m.reply(txt);
    }
    await m.react("✅");
}

export { pluginConfig as config, handler };
