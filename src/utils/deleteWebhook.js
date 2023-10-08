export const deleteWebHook = async (bot) => {
  bot.telegram
    .deleteWebhook()
    .then(() => {
      console.log('Webhook deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting webhook:', error);
    });
};
