const { sanitizeEntity } = require('strapi-utils');
console.log('heyhey');
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  async me(ctx) {
    console.log('hey');
    // const user = ctx.state.user;

    // if (!user) {
    //   return ctx.badRequest(null, [
    //     { messages: [{ id: 'No authorization header was found' }] },
    //   ]);
    // }
   
	  // const userQuery = await strapi.query('user', 'users-permissions');
    // const userWithMedia = await userQuery.findOne({ id: ctx.state.user.id });
    // console.log('userWithMedia here');
    // const data = sanitizeUser(userWithMedia, { model: userQuery.model });
    // ctx.body = data;
  },
};
