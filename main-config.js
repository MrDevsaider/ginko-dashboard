require("dotenv").config();
module.exports = {
  tokens: {
    bot: process.env.tokensBot,
    app: process.env.tokensBotApp,
    id: process.env.tokensId,
    mongo: process.env.tokensMongo,
    url: process.env.tokensURL,
    votes: {
      password: process.env.tokensVotePass,
      webhook: process.env.tokensVoteWebhook
    },
    logs: {
      token: process.env.tokensLogsToken,
      id: process.env.tokensLogsID
    }
  },
  misc: {
    prefix: process.env.prefix,
    github: process.env.github,
    glitch: process.env.glitch,
    donate: process.env.donate,
    support: process.env.support,
    invite: process.env.invite
  }
};
