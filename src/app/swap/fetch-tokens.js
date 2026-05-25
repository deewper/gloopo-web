const https = require('https');

const options = {
  hostname: 'api.atmos.ag',
  path: '/swapRouter/tokenlist',
  method: 'GET',
  headers: {
    'x-api-key': '76e5abdbd6039c54532b7d8ce0ea4a39aab3b8fd6a7a9bb3cf55d42aab8923e9'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
