const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const http = require('http');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(bodyParser.text({ type: 'application/xml' }));
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
app.post('/rmv_SUB', (req, res) => 
{
 
  xml2js.parseString(req.body, (err, result) => {
    if (err) {
      console.error('Error parsing SOAP request:', err);
      return res.status(400).send('Error parsing SOAP request');
    }
    
    // start session check
        const isdn = result['soap:Envelope']['soap:Body'][0]['rmv:RMV_SUB'][0]['rmv:ISDN'][0];
        const rmvki = result['soap:Envelope']['soap:Body'][0]['rmv:RMV_SUB'][0]['rmv:RMVKI'][0];

        fs.readFile('sa_phone_numbers.txt', 'utf8', (err, data) => {
          if (err) {
              console.error('Error reading file:', err);
              return;
          }
      
          // Split the file content by newline character
          const lines = data.split('\n');
      
          // Filter out lines that do not match the ISDN
          const filteredLines = lines.filter(line => {
              // Assuming the ISDN is present at the beginning of the line
              // You might need to adjust this depending on your file format
              return !line.startsWith(isdn);
          });

          if (filteredLines.length === lines.length) {
            console.error('ISDN not found in the file.');
            return;
        }
      
          // Join the filtered lines back into a single string
          const updatedContent = filteredLines.join('\n');
      
          // Write the updated content back to the file
          fs.writeFile('sa_phone_numbers.txt', updatedContent, 'utf8', err => {
              if (err) {
                  console.error('Error writing to file:', err);
                  return;
              }
              console.log('ISDN removed successfully.');
          });
      });

    res.send("ISDN removed successfully.").status(200);
  });
});

app.post('/LGI', (req, res) => {

  xml2js.parseString(req.body, (err, result) => {
    if (err) {
      console.error('Error parsing SOAP request:', err);
      return res.status(400).send('Error parsing SOAP request');
    }

    const { OPNAME, PWD } = result['soap:Envelope']['soap:Body'][0]['LGI'][0];
    const udmUsername = "udm_username";
    const udmPassword = "udm_password";

    if (OPNAME[0] === udmUsername && PWD[0] === udmPassword) {
      const sessionToken = generateSessionToken();
      activeSessions.set(sessionToken, OPNAME[0]);
      const redirectURL = `http://localhost:3001/${sessionToken}`;
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
        'Location': redirectURL,
        'Connection': 'Keep-Alive'
      });
      res.status(307).contentType('application/xml').send(responseXML);
      //res.status(200).contentType('application/xml').send(responseXML);
    } else {
      console.log("username and pass don't match");
      const responseFailedXML = `
        <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
          <soap:Body>
            <LGIResponse>
              <Result>
                <ResultCode>1018</ResultCode>
                <ResultDesc>Username/Password doesn't match</ResultDesc>
              </Result>
            </LGIResponse>
          </soap:Body>
        </soap:Envelope>
      `;
      res.status(200).send(responseFailedXML);
    }
  });
  
});

app.post('/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  
  // Check if the session ID is valid
  if (activeSessions.has(sessionId)) {
      // Session ID is valid, respond with the LGI response body
      const lgiResponseBody = `
          <?xml version="1.0"?>
          <SOAP:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
              <SOAP:Body>
                  <LGIResponse>
                      <Result>
                          <ResultCode>0</ResultCode>
                          <ResultDesc>Operation is successful</ResultDesc>
                      </Result>
                  </LGIResponse>
              </SOAP:Body>
          </SOAP:Envelope>
      `;

      // Respond with the LGI response body
      res.status(200).send(lgiResponseBody);
  } else {
      // Session ID is not valid, respond with a 404 status code
      res.status(404).send('Session ID is not valid');
  }
});

////////////////////////////////

app.post('/rmv_SUB', (req, res) => {
  console.log("PHAKATHI")

  res.send("PHA200").status(200);
});

app.get('/status', (req, res) => {
  const isGood = Math.random() < 0.5;
  const status = isGood ? 'Hata' : 'Error';
  res.status(isGood ? 200 : 500).json({ status });
});
////////////////////
function generateSANumbers(numOfNumbers, outputFile) {
  const saNumbers = [];

  for (let i = 0; i < numOfNumbers; i++) {
      // Generate random 9-digit phone number
      const phoneNumber = '27' + Math.floor(100000000 + Math.random() * 900000000);
      saNumbers.push(phoneNumber);
  }

  // Write the phone numbers to a text file
  fs.writeFile(outputFile, saNumbers.join('\n'), (err) => {
      if (err) throw err;
      console.log(`${numOfNumbers} SA phone numbers generated and saved to ${outputFile}.`);
  });
}

const httpServer = http.createServer(app);
httpServer.keepAliveTimeout = 670000;
httpServer.listen(PORT, () => 
{
  console.log(`HTTP Server is running on http://localhost:${PORT}`);
});
