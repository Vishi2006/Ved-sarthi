const authRoutes = require('./src/routes/authRoutes');
console.log(authRoutes.stack.map(layer => ({ path: layer.route?.path, methods: layer.route?.methods })));
