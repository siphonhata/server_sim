const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');

const app = express();
const PORT = 3001;


app.use(bodyParser.text({ type: 'application/xml' })); // Middleware to parse incoming XML
 
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

// Route for handling incoming SOAP requests to login (UDM)
app.post('/LGI', (req, res) => 
  {
    
    // Parse the incoming SOAP XML
    xml2js.parseString(req.body, (err, result) => 
    {
      if (err) 
       {
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
  
      // Extract values to be used
      const username = result['soap:Envelope']['soap:Body'][0]['LGI'][0]['OPNAME'][0];
      const pass = result['soap:Envelope']['soap:Body'][0]['LGI'][0]['PWD'][0];
  
      // Extract values from bash script

      const udm_username = "udm_username";
      const udm_password = "udm_password";
      // Perform login
      
      if (username === udm_username && pass === udm_password)
      {
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
  
        // Send SOAP response
        res.set('Content-Type', 'application/xml');
        res.send(responseXML);
        return;
      }
      else
      {
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
    // Simulate a check to see if everything is okay
    const isGood = Math.random() < 0.5; // Randomly decide if it's good or not

    if (isGood) {
        // If everything is good, send a success response
        res.status(200).json({ status: 'Hata' });
    } else {
        // If there's an error, send an error response
        res.status(500).json({ status: 'Error' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
    
});
