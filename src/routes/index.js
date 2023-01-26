const { Router } = require('express');
const routesAuth = require('./Auth.routes');
const { routerUsers } = require('./User.routes');
const { routerProducts } = require('./Products.routes');

const router = Router();    


router.use('/api/auth', routesAuth);
router.use('/api/users', routerUsers);
router.use('/api/products', routerProducts);

module.exports = router;