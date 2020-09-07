module.exports = {
  appPort: process.env.PORT || 5000,
  mongoUri: 'mongodb://root:root@localhost:32768/online-store?authSource=admin',
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  jwt: {
    secret: '6db1d202-dedd-4520-9d68-8291d1239455',
    tokens: {
      access: {
        type: 'access',
        expiresIn: '10m',
      },
      refresh: {
        type: 'refresh',
        expiresIn: '30m',
      },
    },
  },
};
