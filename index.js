//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48 




 */
'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

　
// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

　
　
// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot :)')
})

　
　
var token = process.env.FB_ACCESS_TOKEN;
var token_verifi = process.env.FB_VERYFI_TOKEN;

　
//sends message to User on FBMessenger
function sendMessageToFBMessenger(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.FB_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  },  function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  });
}
// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === token_verifi) {
       
       var js = JSON.stringify(req.body);
       res.send('Hello world, I am a chat bot')
       res.send (js);

    }
    res.send('Error, wrong token')
})

　
/*v2*/
// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }
       else if (event.message) {
          processMessage(event);

　
        }
      });
    });

    res.sendStatus(200);
  }
});

　
　
// function to echo back messages 
function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;
  
  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: token,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";

      }
      var message = greeting + "My name is Chat Bot. What movie would you like to know about?";
      //sendMessageToFBMessenger(senderId, {text: message});
      /*set send mesage postback event*/
      sendPostBackWellcome (senderId, body);
      
    });
  } else {
	  // call funciotn process pageload
	  processPageload(pageload);
  }

}

//function to echo message (text )
function processMessage(event) {
  if (!event.message.is_echo) {
    var message = event.message;
    var senderId = event.sender.id;

    console.log("Received message from senderId: " + senderId);
    console.log("Message is: " + JSON.stringify(message));

    // You may get a text or attachment but not both
    if (message.text) {
      var formattedMsg = message.text.toLowerCase().trim();

      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding movie detail.
      // Otherwise, search for new movie.
      /*switch (formattedMsg) {
        case "plot":
        case "date":
        case "runtime":
        case "director":
        case "cast":
        case "rating":
          getMovieDetail(senderId, formattedMsg);
          break;

        default:
          findMovie(senderId, formattedMsg);
      }*/

       switch (message.text) {
          case 'generic':
            sendGenericMessage(senderId);
            break;

          default:
             sendMessageToFBMessenger(senderId, {text: message.text});
        }
      
    } else if (message.attachments) {
      sendMessageToFBMessenger(senderId, {text: "Sorry, I don't understand your request."});
    }
  }
}

　
　
function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Ai Chat Bot Communities",
                    "subtitle": "Communities to Follow",
                    "image_url": "http://1u88jj3r4db2x4txp44yqfj1.wpengine.netdna-cdn.com/...",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/groups/aic...",
                        "title": "FB Chatbot Group"
                    }, {
                        "type": "web_url",
                        "url": "https://www.reddit.com/r/Chat_Bots/",
                        "title": "Chatbots on Reddit"
                    },{
                        "type": "web_url",
                        "url": "https://twitter.com/aichatbots",
                        "title": "Chatbots on Twitter"
                    }],
                }, {
                    "title": "Chatbots FAQ",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "https://tctechcrunch2011.files.wordpress.com/...",
                    "buttons": [{
                        "type": "postback",
                        "title": "What's the benefit?",
                        "payload": "Chatbots make content interactive instead of static",
                    },{
                        "type": "postback",
                        "title": "What can Chatbots do",
                        "payload": "One day Chatbots will control the Internet of Things! You will be able to control your homes temperature with a text",
                    }, {
                        "type": "postback",
                        "title": "The Future",
                        "payload": "Chatbots are fun! One day your BFF might be a Chatbot",
                    }],
                },  {
                    "title": "Learning More",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "http://www.brandknewmag.com/wp-cont...",
                    "buttons": [{
                        "type": "postback",
                        "title": "AIML",
                        "payload": "Checkout Artificial Intelligence Mark Up Language. Its easier than you think!",
                    },{
                        "type": "postback",
                        "title": "Machine Learning",
                        "payload": "Use python to teach your maching in 16D space in 15min",
                    }, {
                        "type": "postback",
                        "title": "Communities",
                        "payload": "Online communities & Meetups are the best way to stay ahead of the curve!",
                    }],
                }]  
            } 
        }
    }
    /*
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })*/
    
    sendMessageToFBMessenger(sender, messageData);
}

　
// process wellcom 
function sendPostBackWellcome (senderId, body){
	
  try{

      var bodyObj = JSON.parse(body);
  var name = bodyObj.first_name;
  var greeting = "Xin chào bạn " + name + ". ";
        
  var messageHello = greeting + "Mình là chat bot. Rất hân hạnh được hỗ trợ bạn. Bạn có cần hỗ trợ về thông tin gì không?";
  var  messageData = {
     "attachment": 
       {
        "type": "template",
        "payload": 
          {
            "template_type": "generic",
            "image_url": "http://www.brandknewmag.com/wp-cont...",
            "text": messageHello,
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Có",
                    "payload": "get_options_wellcome"
                  },
                  {
                    "type": "postback",
                    "title": "Không",
                    "payload": "no_options_wellcome"
                  }
                ]
          }
        } 

      }
  
  	// send message 
  	sendMessageToFBMessenger(sender, messageData);
  } catch (err)  {
      console.error(err);
  }
  
}

　
　
// function process PageLoad 

　
function processPageload (pageload){
	switch (pageload) {
    case "Correct":
    	sendMessageToFBMessenger(senderId, {text: "Awesome! What would you like to find out? Enter 'plot', 'date', 'runtime', 'director', 'cast' or 'rating' for the various details."});
    	break;
    case "Chatbots are fun! One day your BFF might be a Chatbot":
    	sendMessageToFBMessenger(senderId, {text: "Chatbots are fun! One day your BFF might be a Chatbot."});
    	break;
    case "Machine Learning":
    	sendMessageToFBMessenger(senderId, {text: "Use python to teach your maching in 16D space in 15min."});
    	break;
    default:
    	// To do
    	sendMessageToFBMessenger(senderId, {text: "Sorry, I don't understand your request."});
        break;
	}
}
