const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const http = require('http');
const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(bodyParser.text({ type: 'application/xml' }));

// Route for handling incoming SOAP requests to add two numbers
app.post('/add', (req, res) => {
  // Parse the incoming SOAP XML
  console.log(req.body);
  xml2js.parseString(req.body, (err, result) => {
    if (err) {
      console.error('Error parsing SOAP request:', err);
      res.status(400).send('Error parsing SOAP request');
      return;
    }

    // Extract numbers to be added
    const num1 = parseInt(result['soap:Envelope']['soap:Body'][0]['Add'][0]['num1'][0]);
    const num2 = parseInt(result['soap:Envelope']['soap:Body'][0]['Add'][0]['num2'][0]);

    // Perform addition
    const resultSum = num1 + num2;

    // Prepare SOAP response
    const responseXML = `
      <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
        <soap:Body>
          <AddResponse>
            <result>${resultSum}</result>
          </AddResponse>
        </soap:Body>
      </soap:Envelope>
    `;

    // Send SOAP response
    res.set('Content-Type', 'text/xml');
    res.send(responseXML);
  });
});

const activeSessions = new Map();

function generateSessionToken() {
  let token = '';
  const characters = '0123456789';
  const tokenLength = 7;

  for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
  }

  return token;
}

// Route for handling incoming SOAP requests to login (UDM)
app.post('/LGI', (req, res) => {
  xml2js.parseString(req.body, (err, result) => {
    if (err) {
      console.error('Error parsing SOAP request:', err);
      const responseFailedXML = `
          <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
              <soap:Body>
                  <LGIResponse>
                      <Result>
                          <ResultCode>1018</ResultCode>
                          <ResultDesc>Error parsing SOAP request</ResultDesc>
                      </Result>
                  </LGIResponse>
              </soap:Body>
          </soap:Envelope>
      `;
      res.status(400).send(responseFailedXML);
      return;
    }

    const username = result['soap:Envelope']['soap:Body'][0]['LGI'][0]['OPNAME'][0];
    const pass = result['soap:Envelope']['soap:Body'][0]['LGI'][0]['PWD'][0];

    const udm_username = "udm_username";
    const udm_password = "udm_password";

    if (username === udm_username && pass === udm_password) {
      const sessionToken = generateSessionToken();
      activeSessions.set(sessionToken, username);

      console.log("username and pass are correct")
      const responseXML = `
      <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
            <soap:Body>
              <LGIResponse>
                  <Result>
                      <ResultCode>0</ResultCode>
                      <ResultDesc>Operation is successful</ResultDesc>
                  </Result>
              </LGIResponse>
            </soap:Body>
          </soap:Envelope>
        `;

      res.set({
        'Content-Type': 'application/xml',
        'Session': sessionToken,
        'udm_node': `http://localhost:3002/${sessionToken}`,
        'Connection': 'Keep-Alive'
      });
      res.send(responseXML);
      return;
    } else {
      console.log("username and pass dont match")
      const responseFailedXML = `
        <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
          <soap:Body>
            <LGIResponse>
              <Result>
                <ResultCode>1018</ResultCode>
                <ResultDesc>Username/Password doesn&apos;t match</ResultDesc>
              </Result>
            </LGIResponse>
          </soap:Body>
        </soap:Envelope>
      `;
      res.status(200).send(responseFailedXML);
      return;
    }
  });
});

app.get('/status', (req, res) => {
  const isGood = Math.random() < 0.5;

  if (isGood) {
      res.status(200).json({ status: 'Hata' });
  } else {
      res.status(500).json({ status: 'Error' });
  }
});

// For HTTP2, you need SSL/TLS certificates
const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
};

// Create HTTP server
const httpServer = http.createServer(app);

// Create HTTP2 server
const http2Server = http2.createSecureServer(options, app);

// Start both servers
httpServer.listen(PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${PORT}`);
});

http2Server.listen(PORT + 1, () => {
  console.log(`HTTP2 Server is running on https://localhost:${PORT + 1}`);
});
