export const getExistsUsers = async (users, ctx) => {
  let usersExists = "";

  for (const userId of users) {
    try {
      await ctx.telegram.getChatMember(ctx.chat.id, userId);
      usersExists += `${userId},`;
      console.log(`ID ${userId} exists`);
    } catch (error) {
      console.log(`ID ${userId} does not exist: ${error}`);
    }
  }

  return usersExists;
};

export const existUser = async (userID, ctx) => {
  try {
    await ctx.telegram.getChatMember(ctx.chat.id, userID);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};



