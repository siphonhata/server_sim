// // const http2 = require('http2'); // Import the http2 module

// // const PORT = 3001;

// // const http2 = require('http2');
// // const xml2js = require('xml2js');
// // const express = require('express');
// // const bodyParser = require('body-parser');

// // const app = express();

// // app.use(bodyParser.text({ type: 'application/xml' }));

// // // Create an HTTP/2 server
// // const server = http2.createSecureServer();



// // app.post('/LGI', (req, res) => {
// //   xml2js.parseString(req.body, (err, result) => {
// //     if (err) {
// //       console.error('Error parsing SOAP request:', err);
// //       const responseFailedXML = `
// //         <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
// //           <soap:Body>
// //             <LGIResponse>
// //               <Result>
// //                 <ResultCode>1018</ResultCode>
// //                 <ResultDesc>Error parsing SOAP request</ResultDesc>
// //               </Result>
// //             </LGIResponse>
// //           </soap:Body>
// //         </soap:Envelope>
// //       `;
// //       res.status(400).send(responseFailedXML);
// //       return;
// //     }

// //     const username = result['soap:Envelope']['soap:Body'][0]['LGI'][0]['OPNAME'][0];
// //     const pass = result['soap:Envelope']['soap:Body'][0]['LGI'][0]['PWD'][0];

// //     const udm_username = "udm_username";
// //     const udm_password = "udm_password";

// //     if (username === udm_username && pass === udm_password) {
// //       console.log("username and pass are correct")
// //       const responseXML = `
// //         <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
// //           <soap:Body>
// //             <LGIResponse>
// //               <Result>
// //                 <ResultCode>0</ResultCode>
// //                 <ResultDesc>Operation is successful</ResultDesc>
// //               </Result>
// //             </LGIResponse>
// //           </soap:Body>
// //         </soap:Envelope>
// //       `;

// //       res.set('Content-Type', 'application/xml');
// //       res.send(responseXML);
// //       return;
// //     } else {
// //       console.log("username and pass don't match")
// //       const responseFailedXML = `
// //         <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
// //           <soap:Body>
// //             <LGIResponse>
// //               <Result>
// //                 <ResultCode>1018</ResultCode>
// //                 <ResultDesc>Username/Password doesn't match</ResultDesc>
// //               </Result>
// //             </LGIResponse>
// //           </soap:Body>
// //         </soap:Envelope>
// //       `;
// //       res.status(200).send(responseFailedXML);
// //       return;
// //     }
// //   });
// // });

// //  // Route handling remains the same as before
// // server.on('request', (req, res) => {
// //     if (req.method === 'POST' && req.url === '/add') {
// //       // Handling for /add route
// //       // Code for parsing SOAP request and sending SOAP response
// //     } else if (req.method === 'POST' && req.url === '/LGI') {
// //       // Handling for /LGI route
// //       // Code for parsing SOAP request, performing login, and sending SOAP response
// //     } else if (req.method === 'GET' && req.url === '/status') {
// //       // Handling for /status route
// //       // Code for checking status and sending JSON response
// //     } else {
// //       // Return 404 for other routes
// //       res.writeHead(404);
// //       res.end();
// //     }
// //   });
  

 

// // server.on('request', app);

// // app.listen(PORT, () => {
// //   console.log(`Server is running on https://localhost:${PORT}`);
// // });
// const express = require('express');
// const bodyParser = require('body-parser');
// const xml2js = require('xml2js');

// const app = express();
// const PORT = 3001;


// app.use(bodyParser.text({ type: 'application/xml' })); // Middleware to parse incoming XML
 


// // Route for handling incoming SOAP requests to login (UDM)
// app.post('/LGI', (req, res) => 
//   {
    
//     // Parse the incoming SOAP XML
//     xml2js.parseString(req.body, (err, result) => 
//     {
//       if (err) 
//        {
//             console.error('Error parsing SOAP request:', err);
//             const responseFailedXML = `
//                 <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
//                     <soap:Body>
//                         <LGIResponse>
//                             <Result>
//                                 <ResultCode>1018</ResultCode>
//                                 <ResultDesc>Error parsing SOAP request</ResultDesc>
//                             </Result>
//                         </LGIResponse>
//                     </soap:Body>
//                 </soap:Envelope>
//             `;
//             res.status(400).send(responseFailedXML);
//             return;
//         }
  
//       // Extract values to be used
//       const username = result['soap:Envelope']['soap:Body'][0]['LGI'][0]['OPNAME'][0];
//       const pass = result['soap:Envelope']['soap:Body'][0]['LGI'][0]['PWD'][0];
  
//       // Extract values from bash script

//       const udm_username = "udm_username";
//       const udm_password = "udm_password";
//       // Perform login
      
//       if (username === udm_username && pass === udm_password)
//       {
//         console.log("username and pass are correct")
//         const responseXML = `
//         <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
//               <soap:Body>
//                 <LGIResponse>
//                     <Result>
//                         <ResultCode>0</ResultCode>
//                         <ResultDesc>Operation is successful</ResultDesc>
//                     </Result>
//                 </LGIResponse>
//               </soap:Body>
//             </soap:Envelope>
//           `;
  
//         // Send SOAP response
//         res.set('Content-Type', 'application/xml');
//         res.send(responseXML);
//         return;
//       }
//       else
//       {
//         console.log("username and pass dont match")
//         const responseFailedXML = `
//           <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
//             <soap:Body>
//               <LGIResponse>
//                 <Result>
//                   <ResultCode>1018</ResultCode>
//                   <ResultDesc>Username/Password doesn&apos;t match</ResultDesc>
//                 </Result>
//               </LGIResponse>
//             </soap:Body>
//           </soap:Envelope>
//         `;
//         res.status(200).send(responseFailedXML);
//         return;
//       }
//     });
//   });


//   app.get('/status', (req, res) => {
//     // Simulate a check to see if everything is okay
//     const isGood = Math.random() < 0.5; // Randomly decide if it's good or not

//     if (isGood) {
//         // If everything is good, send a success response
//         res.status(200).json({ status: 'Hata' });
//     } else {
//         // If there's an error, send an error response
//         res.status(500).json({ status: 'Error' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
    
// });
