let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors')
let watson = require('watson-developer-cloud');

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

let assistant = new watson.ConversationV1({
  username: '33e0a707-96d2-42f7-8776-e44612b61b81',
  password: '0Xtlv6mP8wr1',
  version: 'v1',
  version_date: '2018-02-16'
});

let contextObject = null;

// keeps track of the context for multiple conversations, so that users can continue from where the left off
// example: if the user provides their name it will be remembered the next time the user is addressed
const contextMapping = {};

app.get('/', function(req,res) {
  res.send('Aloud Backend');
});

app.get('/message', function(req,res){
  console.log("Sending message to Watson ...");
  const id = req.get('user-agent');
  console.log("ID: " + id);
  if (contextMapping.hasOwnProperty(id)) {
    contextObject = contextMapping[id];
  }
  const text = req.query.text;
  console.log("Input: " + text);
  assistant.message({workspace_id: 'd3848733-0ebd-4a48-94e9-78c761deb46a', context: contextObject, input: {'text': text}}, function(err, response) {
    if (err) {
      console.log('error:', err);
      res.send(err);
    }
    else {
      console.log("Response: " + JSON.stringify(response));
      contextObject = response.context;
      contextMapping[id] = contextObject;
      const output = {
        output: response.output.text[0]
      };
      res.send(output);
    }
  });
});

host = '0.0.0.0';
port = 3000;
app.listen(port, host, function(){
  console.log('Server running at ' + host + ":" + port);
});
