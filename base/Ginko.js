let { Client } = require("discord.js");

module.exports = class client extends Client {
  constructor(options) {
    super(options);
  }
  async findOrCreateUser(param, isLean) {
    let usersData = this.usersData;
    return new Promise(async function(resolve, reject) {
      let userData = isLean
        ? await usersData.findOne(param).lean()
        : await usersData.findOne(param);
      if (userData) {
        userData.save = async function() {
          await usersData
            .where({ _id: userData._id })
            .updateOne({ $set: userData });
          userData = await usersData.findOne(param).lean();
          return userData;
        };
        resolve(userData);
      } else {
        userData = new usersData(param);
        await userData.save();
        userData.save = async function() {
          await usersData
            .where({ _id: userData._id })
            .updateOne({ $set: userData });
          userData = await usersData.findOne(param).lean();
          return userData;
        };
        resolve(isLean ? userData.toJSON() : userData);
      }
    });
  }
  async findOrCreateGuild(param, isLean) {
    let guildsData = this.guildsData;
    return new Promise(async function(resolve, reject) {
      let guildData = isLean
        ? await guildsData
            .findOne(param)
            .populate("membersData")
            .lean()
        : await guildsData.findOne(param).populate("membersData");
      if (guildData) {
        guildData.save = async function() {
          this.guildsData = guildsData;
          this.guildsData = guildsData;
          await this.guildsData
            .where({ _id: guildData._id })
            .updateOne({ $set: guildData });
          guildData = await this.guildsData.findOne(param).lean();
          return guildData;
        };
        resolve(guildData);
      } else {
        guildData = new guildsData(param);
        await guildData.save();
        guildData.save = async function() {
          this.guildsData = guildsData;
          await this.guildsData
            .where({ _id: guildData._id })
            .updateOne({ $set: guildData });
          guildData = await this.guildsData.findOne(param).lean();
          return guildData;
        };
        resolve(guildData.toJSON());
      }
    });
  }
  async findOrCreateMember(param, isLean) {
    let membersData = this.membersData;
    let guildsData = this.guildsData;
    return new Promise(async function(resolve, reject) {
      let memberData = isLean
        ? await membersData.findOne(param).lean()
        : await membersData.findOne(param);
      if (memberData) {
        memberData.save = async function() {
          await membersData
            .where({ _id: memberData._id })
            .updateOne({ $set: memberData });
          memberData = await membersData.findOne(param).lean();
          return memberData;
        };
        resolve(memberData);
      } else {
        memberData = new membersData(param);
        await memberData.save();
        memberData.save = async function() {
          await membersData
            .where({ _id: memberData._id })
            .updateOne({ $set: memberData });
          memberData = await membersData.findOne(param).lean();
          return memberData;
        };
        let guild = await guildsData.findOne({ id: param.guildID });
        if (guild) {
          guild.members.push(memberData._id);
          await guild.save();
        }
        resolve(isLean ? memberData.toJSON() : memberData);
      }
    });
  }
};
