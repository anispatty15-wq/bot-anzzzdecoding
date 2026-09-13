const pluginConfig = {
  name: "keluargroup",
  alias: ["listgroup", "leavegroup", "gccontrol"],
  category: "owner",
  description: "Melihat daftar grup dan mengatur bot keluar dari grup",
  usage: ".keluargroup",
  example: ".keluargroup",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

function commandId(prefix, action, groupId = "") {
  return `${prefix}keluargroup ${action}${groupId ? ` ${groupId}` : ""}`;
}

async function getGroups(sock) {
  global.isFetchingGroups = true;
  try {
    return await sock.groupFetchAllParticipating();
  } finally {
    global.isFetchingGroups = false;
  }
}

async function showGroupMenu(m, sock) {
  const groups = await getGroups(sock);
  const groupList = Object.entries(groups);
  const prefix = m.prefix || ".";

  if (groupList.length === 0) {
    return m.reply("⚠️ Bot tidak sedang berada di grup manapun.");
  }

  const rows = groupList.slice(0, 100).map(([id, metadata]) => ({
    title: (metadata.subject || "Grup tanpa nama").slice(0, 24),
    description: `${metadata.participants?.length || 0} anggota`,
    id: commandId(prefix, "leave", id),
  }));

  await sock.sendMessage(m.chat, {
    text:
      `📋 *DAFTAR GRUP BOT*\n\n` +
      `Total grup: *${groupList.length}*\n` +
      `Pilih grup untuk mengeluarkan bot dari grup tersebut.`,
    footer: "ANZZZ DECODING",
    interactiveButtons: [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Pilih Grup",
          sections: [{ title: "Grup yang diikuti bot", rows }],
        }),
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Keluar Semua Grup",
          id: commandId(prefix, "all"),
        }),
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Tutup",
          id: commandId(prefix, "close"),
        }),
      },
    ],
  });
}

async function leaveOneGroup(m, sock, groupId) {
  if (!groupId || !groupId.endsWith("@g.us")) {
    return m.reply("❌ ID grup tidak valid.");
  }

  let groupName = groupId;
  try {
    const metadata = await sock.groupMetadata(groupId);
    groupName = metadata.subject || groupId;
  } catch {}

  try {
    await sock.groupLeave(groupId);
    return m.reply(`✅ Bot berhasil keluar dari grup *${groupName}*.`);
  } catch (error) {
    console.error("[KeluarGroup] Error:", error.message);
    return m.reply(`❌ Gagal keluar dari grup *${groupName}*.\n> ${error.message}`);
  }
}

async function leaveAllGroups(m, sock) {
  const groups = await getGroups(sock);
  const groupIds = Object.keys(groups);
  let success = 0;
  let failed = 0;

  for (const groupId of groupIds) {
    try {
      await sock.groupLeave(groupId);
      success++;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch {
      failed++;
    }
  }

  return m.reply(
    `✅ *SELESAI KELUAR DARI SEMUA GRUP*\n\n` +
      `Berhasil: *${success}*\n` +
      `Gagal: *${failed}*`,
  );
}

async function showLeaveAllConfirmation(m, sock) {
  const prefix = m.prefix || ".";
  const groups = await getGroups(sock);
  const total = Object.keys(groups).length;

  if (total === 0) {
    return m.reply("⚠️ Bot tidak sedang berada di grup manapun.");
  }

  return sock.sendMessage(m.chat, {
    text:
      `⚠️ *KONFIRMASI KELUAR SEMUA GRUP*\n\n` +
      `Bot akan keluar dari *${total} grup*. Tindakan ini tidak dapat dibatalkan otomatis.`,
    interactiveButtons: [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Ya, Keluar Semua",
          id: commandId(prefix, "all_confirm"),
        }),
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Batal",
          id: commandId(prefix, "close"),
        }),
      },
    ],
  });
}

async function handler(m, { sock }) {
  const args = m.args || [];
  const action = (args[0] || "menu").toLowerCase();

  if (action === "close" || action === "tutup") {
    return m.reply("✅ Menu keluar grup ditutup.");
  }

  if (action === "leave" || action === "keluar") {
    return leaveOneGroup(m, sock, args[1]);
  }

  if (action === "all") {
    return showLeaveAllConfirmation(m, sock);
  }

  if (action === "all_confirm") {
    await m.react("🕕");
    return leaveAllGroups(m, sock);
  }

  try {
    await m.react("🕕");
    return await showGroupMenu(m, sock);
  } catch (error) {
    console.error("[KeluarGroup] Error:", error.message);
    return m.reply(`❌ Gagal mengambil daftar grup.\n> ${error.message}`);
  }
}

export { pluginConfig as config, handler };
