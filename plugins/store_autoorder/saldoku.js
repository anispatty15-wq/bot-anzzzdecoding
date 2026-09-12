import { getDatabase } from "../../src/lib/ourin-database.js";

const pluginConfig = {
    name: "saldoku",
    alias: ["ceksaldo", "saldo"],
    category: "store_autoorder",
    description: "💰 Cek sisa saldo akun",
    usage: ".saldoku",
    example: ".saldoku",
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
    const user = db.getUser(m.sender) || db.setUser(m.sender);
    
    const saldo = user.saldo || 0;
    
    let txt = `💳 *INFORMASI SALDO*\n\n`;
    txt += `👤 Nama: *${m.pushName || "User"}*\n`;
    txt += `📱 Nomor: \`${m.sender.split("@")[0]}\`\n`;
    txt += `💰 Sisa Saldo: *${formatPrice(saldo)}*\n\n`;
    txt += `> _Gunakan perintah \`${m.prefix}topupsaldo <nominal>\` untuk mengisi saldo_ 🔄\n`;
    txt += `> _Saldo dapat digunakan untuk pembelian autoorder._ 🛍️`;
    
    await m.reply(txt);
    await m.react("✅");
}

export { pluginConfig as config, handler };
