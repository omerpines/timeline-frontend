module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '79577925a66d6d9ee4a3676306d6e74f'),
  },
  autoMigration: true,
});
