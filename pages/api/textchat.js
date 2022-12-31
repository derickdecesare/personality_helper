


export default async function handler (req, res) {
let message ='inital message'
const { MessagingResponse } = require('twilio').twiml;
const twiml = new MessagingResponse();

console.log(req.body) 
console.log(req.body.Body) //this is the message
const incomingMessage = req.body.Body

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = require('twilio')(accountSid, authToken)

    // client.messages.create({
    //     body:'this is my message',
    //     from:'+17262009979',
    //     to:'+13038286690'
    // })
    // .then(message => console.log(message.sid))


    await fetch('https://allenwilldiefromai.com/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: incomingMessage }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == 200) {
          message = data.message
         }
      });
  
      
    





    twiml.message(message);
      // Set the Content-Type header and send the response
      res.setHeader('Content-Type', 'text/xml');
      res.status(200).send(twiml.toString());
      return;

}