const app = require('./src/app');
console.log('App initialized');

const authRoutes = require('./src/routes/authRoutes');
console.log('Auth routes loaded, has routes:', authRoutes.stack.length);
authRoutes.stack.forEach(layer => {
  console.log('  -', layer.route?.path, Object.keys(layer.route?.methods || {}));
});

// Listen on a test port
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server on port ${PORT}`);
  
  // Make a test request
  const http = require('http');
  setTimeout(() => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Response:', data);
        process.exit(0);
      });
    });
    
    req.on('error', (err) => {
      console.error('Error:', err);
      process.exit(1);
    });
    
    req.write(JSON.stringify({name:'test', email:'test@test.com', password:'pass123'}));
    req.end();
  }, 500);
});
