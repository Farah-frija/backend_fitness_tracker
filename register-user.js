const http = require('http');

const data = JSON.stringify({
  email: 'test@fittracker.com',
  password: 'password123',
  nom: 'User',
  prenom: 'Test',
  role: 'PROPRIETAIRE_ANIMAL'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('\n=== REGISTRATION RESPONSE ===');
    console.log('Status Code:', res.statusCode);
    console.log('Response:', JSON.parse(responseData));
    console.log('\nCopy the user ID from above and use it in your SQL queries!');
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  console.log('\nMake sure the server is running on port 3001!');
});

req.write(data);
req.end();
