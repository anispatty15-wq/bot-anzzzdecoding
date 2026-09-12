import { startConnection } from './src/connection.js';
import {
  messageHandler,
  groupHandler,
  messageUpdateHandler,
  groupSettingsHandler,
} from './src/handler.js';
import config from './config.js';

console.log(`▶ Memulai ${config.bot?.name || 'mahiru Bot'} v${config.bot?.version || '3.x'}...`);

process.on('uncaughtException', (error) => {
  console.error('[Main] uncaughtException:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Main] unhandledRejection:', reason);
});

try {
  await startConnection({
    onMessage: async (msg, sock) => {
      try {
        await messageHandler(msg, sock);
      } catch (error) {
        console.error('[Main] messageHandler error:', error);
      }
    },
    onGroupUpdate: async (update, sock) => {
      try {
        await groupHandler(update, sock);
      } catch (error) {
        console.error('[Main] groupHandler error:', error);
      }
    },
    onMessageUpdate: async (updates, sock) => {
      try {
        await messageUpdateHandler(updates, sock);
      } catch (error) {
        console.error('[Main] messageUpdateHandler error:', error);
      }
    },
    onGroupSettingsUpdate: async (update, sock) => {
      try {
        await groupSettingsHandler(update, sock);
      } catch (error) {
        console.error('[Main] groupSettingsHandler error:', error);
      }
    },
  });

  console.log('✅ Bot berhasil dimulai.');
} catch (error) {
  console.error('[Main] Gagal memulai bot:', error);
  process.exit(1);
}
