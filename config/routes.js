const authMiddleware = require('../app/middleware/auth');
const products = require('../app/controllers/products');
const auth = require('../app/controllers/auth');

module.exports = (app) => {
  // products
  app.get('/products', authMiddleware, products.getAll);
  app.post('/products', authMiddleware, products.create);
  app.put('/products/:id', authMiddleware, products.update);
  app.delete('/products/:id', authMiddleware, products.remove);

  // auth
  app.post('/user/signin', auth.signIn);
  app.post('/user/signup', auth.signUp);
  app.post('/user/refresh-tokens', auth.refreshTokens);
  app.get('/user/current', authMiddleware, auth.getCurrentUser);
  app.get('/user/logout', authMiddleware, auth.signOut);
};
