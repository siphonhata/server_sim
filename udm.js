const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const http = require('http');

const app = express();
const PORT = 3002;


app.use(bodyParser.text({ type: 'application/xml' })); // Middleware to parse incoming XML
 
app.post('/udm', (req, res) => {
    // Parse the incoming SOAP XML
    console.log(req.body);
    xml2js.parseString(req.body, (err, result) => {
      if (err) {
        console.error('Error parsing SOAP request:', err);
        res.status(400).send('Error parsing SOAP request');
        return;
      }
  
  
      // Prepare SOAP response
      const responseXML = `
        <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
          <soap:Body>
            <UdmResponse>
              <result>"Remove from network"</result>
            </UdmResponse>
          </soap:Body>
        </soap:Envelope>
      `;
  
      // Send SOAP response
      res.set('Content-Type', 'text/xml');
      res.send(responseXML);
    });
  });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
      
  });