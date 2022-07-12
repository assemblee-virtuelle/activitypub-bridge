const path = require('path');
const urlJoin = require('url-join');
const MailerService = require('moleculer-mail');
const CONFIG = require("../config/config");

module.exports = {
  name: 'mailer',
  mixins: [MailerService],
  settings: {
    from: `${CONFIG.FROM_NAME} <${CONFIG.FROM_EMAIL}>`,
    transport: {
      host: CONFIG.SMTP_HOST,
      port: CONFIG.SMTP_PORT,
      secure: CONFIG.SMTP_SECURE,
      auth: {
        user: CONFIG.SMTP_USER,
        pass: CONFIG.SMTP_PASS,
      },
    },
    templateFolder: path.join(__dirname, "../templates")
  },
  actions: {
    async sendConfirmation(ctx) {
      const { email, bridgeId } = ctx.params;

      await this.actions.send(
        {
          to: email,
          replyTo: this.settings.from,
          template: 'confirmation',
          data: {
            baseUrl: CONFIG.HOME_URL,
            url: urlJoin(CONFIG.HOME_URL, bridgeId)
          }
        },
        {
          parentCtx: ctx
        }
      );
    }
  }
}