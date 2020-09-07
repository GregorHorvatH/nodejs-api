# nodejs-api

OAuth REST API server

## API

### User

- POST - Create (/user/signup)
- POST - Login (/user/signin)
- POST - Update Token (/user/refresh-tokens)
- GET - Current User (/user/current)
- GET - Logout (/user/logout)

### Product

- GET - Get All (/products)
- POST - Create (/products)
- PUT - Update (/products/:id)
- DELETE - Delete (/products/:id)
