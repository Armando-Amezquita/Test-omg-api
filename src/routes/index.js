const { Router } = require('express');
const routesAuth = require('./Auth.routes');
const routesUsers = require('./User.routes');
const routesBalances = require('./Balances.routes');
const routesOperations = require('./Operations.routes');
const routesTransactions = require('./Transactions.routes');

const router = Router();    


router.use('/api/auth', routesAuth);
router.use('/api/users', routesUsers);
router.use('/api/balances', routesBalances);
router.use('/api/operations', routesOperations);
router.use('/api/transactions', routesTransactions);

module.exports = router;