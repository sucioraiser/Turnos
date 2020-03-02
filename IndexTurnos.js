// Import express and request modules
var express = require('express');
var request = require('request');
const shell = require('shelljs');
var bodyParser = require('body-parser');
var Slack = require('node-slack-upload');
var slack = new Slack('xoxb-127415297921-927341347586-X0RDWROPZmrWR8zOTcAEiWhx');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


// Store our app's ID and Secret. These we got from Step 1.
// For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to  store them securely in environment variables.
// Cambiar a credenciales propias
var clientId = '127415297921.826021812657';
var clientSecret = '80066d6f2f9b48d3c0ab7eaec35e0fe1';

// Instantiates Express and assigns our app variable to it
var app = express();



var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


// Again, we define a port we want to listen to
//Cambiar segun puerto de conexion
//const PORT=4391;

// Lets start our server
app.listen(port, function () {


    //Callback triggered when server is successfully listening. Hurray!
    console.log("Inicializando App:  " + port);
});

// watson conversation

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });


   


   

// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
    res.send('Server Running! ' + req.url);
});




// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});





  
//consulta Turno 
app.post('/consultaturno', urlencodedParser, (req, res) =>{
    res.status(200).end(); // best practice to respond with empty 200 status code
    var reqBody = req.body;
    var responseURL = reqBody.response_url;
 
    if (reqBody.token != 'FRGcZqwzQNRIBVP3CHPFmVmv'){

        res.status(403).end("Access forbidden");
    }else{
       console.log("por aqui2");
  
        var message = {
            "text": "Usuario : ",
            "attachments": [
                {
              "fallback": "Required plain-text summary of the attachment.",
              "color": "#4f36a6",
              "pretext": "Aplicación Turnos GTS",
              "author_name": "Portafolio de Acciones",
              "author_link": "https://www.ibm.com",
              "author_icon": "https://tentulogo.com/wp-content/uploads/IBM-logo-1.jpg",
              "title": "service Line",
              "title_link": "https://ibm.com/",
                    "text": "Seleccione Service Line..",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
              "color": "#4f36a6",
                    "color": "4f36a6",
                    "attachment_type": "default",
                    "actions": [
                        
                      {
                          "text": "Menu",
                          "name": "menuturnos",
                          "type": "select",
                          "data_source": "default",
                          "options": [
                            {
                              "text": "Unix",
                              "value": "UNIX",
                              "description": "Unix",
                              "selected": false
                             },
                             {
                                "text": "Was",
                                "value": "WAS",
                                "description": "WebSphere",
                                "selected": false
                               },
                               {
                                "text": "BD",
                                "value": "BD",
                                "description": "Base de Datos",
                                "selected": false
                               },
                               {
                                "text": "SAP",
                                "value": "SAP",
                                "description": "Sap",
                                "selected": false
                               },
                               {
                                "text": "Wintel",
                                "value": "win",
                                "description": "sap",
                                "selected": false
                               },
                               {
                                "text": "TSM",
                                "value": "TSM",
                                "description": "tsm",
                                "selected": false
                               },
                               {
                                "text": "SMI",
                                "value": "SMI",
                                "description": "smi",
                                "selected": false
                               }
                            ,
                            {
                              "text": "volver",
                              "value": "apphost",
                              "description": "Volver"
                            }
                          ]
                        }
                    ]
                }
            ]
        }

        //sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
        sendMessageToSlackResponseURL(responseURL, message);

        console.log("responseURL"+responseURL);


   var message = {
          "text": "se le a Notificado....",
          "replace_original": false
      }   
  }
  });

// Event on click buttons
app.post('/', urlencodedParser, (req, res) =>{
    res.status(200).end(); // best practice to respond with 200 status

    var actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
    console.log("Accion boton"+actionJSONPayload.actions[0].name); 

    if (actionJSONPayload.actions[0].name === 'menuturnos'){

      var opcion = actionJSONPayload.actions[0].selected_options[0].value;
      console.log("opcion ---> "+opcion); 



      if(actionJSONPayload.actions[0].selected_options[0].value){ 

        // webservice 

        url = "https://backendappapi.us-south.cf.appdomain.cloud/getDay?tower="+opcion;
        
        //auth = username + ":" + password;
        var postOptions = {
          method: 'GET',
          json: true,
          uri: url,
          strictSSL: false,
          //data:json
        }

      request(postOptions, (error, response, body) => {

        var blocks = [{
                      "type": "divider"
                    }];

        for(var j in body){
            obj =  body[j];
            
            //tabla de turnos
            blocks.push(
                  
                  {
                      "type": "section",
                      "text": {
                          "type": "mrkdwn",
                          "text": "Turnos Area:"+obj.T_TOR_EMPL+"\n*<fakeLink.toEmployeeProfile.com|"+obj.T_NOM_TL+" - TEAM LEADER >*"
                      }
                  },
                  {
                      "type": "divider"
                  },
                  {
                      "type": "section",
                      "fields": [
                          {
                              "type": "mrkdwn",
                              "text": "*EMPLEADO:*\n"+obj.T_NOM_EMPL+""
                          },
                          {
                              "type": "mrkdwn",
                              "text": "*H_INICIO:*\n"+obj.H_INICIO+""
                          },
                          {
                              "type": "mrkdwn",
                              "text": "*H_TERMINO:*\n"+obj.H_TERMINO+""
                          },
                          {
                              "type": "mrkdwn",
                              "text": "*T_CORREO_EMPL:*\n"+obj.T_CORREO_EMPL+""
                          },
                          {
                              "type": "mrkdwn",
                              "text": "*TEL_EMPL:*\n"+obj.T_TEL_EMPL+""
                          }
                      ]
                  },
                  {
                      "type": "divider"
                      
                  }
                );
              
            //sendMessageToSlackResponseURL(actionJSONPayload.response_url, objects[j]);
            
         };

         var dataSend= 
                       {
                           "type": "modal",
                       "title": {
                           "type": "plain_text",
                           "text": "Sistema de Turnos Slack",
                           "emoji": true
                       },
                       "submit": {
                           "type": "plain_text",
                           "text": "Submit",
                           "emoji": true
                       },
                       "close": {
                           "type": "plain_text",
                           "text": "Cancel",
                           "emoji": true
                       },
                       "blocks": blocks
                       }

        sendMessageToSlackResponseURL(actionJSONPayload.response_url, dataSend);



//  sendMessageToSlackResponseURL(responseURL, message);
if (error) {
console.log(error);
} else {
//res.json(body);
}
});

 

}else if(actionJSONPayload.actions[0].selected_options[0].value === "BD"){

    console.log("opcion2 ---> "+opcion); 
   // webservice 

   url = "https://backendappapi.us-south.cf.appdomain.cloud/getWeek2?tower="+opcion;
   //auth = username + ":" + password;
   var postOptions = {
       method: 'GET',
       json: true,
       uri: url,
       strictSSL: false,
       //data:json
}

request(postOptions, (error, response, body) => {
   var objects1 = [];
   var objects = [];
   for(var j in  body){
       obj =  body[j];


        //tabla de turnos

       objects.push(
           {
               "type": "selected",
           "title": {
               "type": "plain_text",
               "text": "Sistema de Turnos Slack",
               "emoji": true
           },
           "submit": {
               "type": "plain_text",
               "text": "Submit",
               "emoji": true
           },
           "close": {
               "type": "plain_text",
               "text": "Cancel",
               "emoji": true
           },"blocks": [
                   {
                       "type": "divider"
                   },
                   {
                       "type": "section",
                       "text": {
                           "type": "mrkdwn",
                           "text": "Turnos Area:"+obj.T_TOR_EMPL+"\n*<fakeLink.toEmployeeProfile.com|"+obj.T_NOM_TL+" - TEAM LEADER >*"
                       }
                   },
                   {
                       "type": "divider"
                   },
                   {
                       "type": "section",
                       "fields": [
                           {
                               "type": "mrkdwn",
                               "text": "*EMPLEADO:*\n"+obj.T_NOM_EMPL+""
                           },
                           {
                               "type": "mrkdwn",
                               "text": "*F_INICIO:*\n"+obj.F_INICIO+""
                           },
                           {
                               "type": "mrkdwn",
                               "text": "*F_FIN:*\n"+obj.F_FIN+""
                           },
                           {
                               "type": "mrkdwn",
                               "text": "*H_INICIO:*\n"+obj.H_INICIO+""
                           },
                           {
                               "type": "mrkdwn",
                               "text": "*H_TERMINO:*\n"+obj.H_TERMINO+""
                           },
                           {
                               "type": "mrkdwn",
                               "text": "*T_CORREO_EMPL:*\n"+obj.T_CORREO_EMPL+""
                           },
                           {
                               "type": "mrkdwn",
                               "text": "*TEL_EMPL:*\n"+obj.T_TEL_EMPL+""
                           }
                       ]
                   },
                   {
                       "type": "divider"
                       
                   },
                   {
                       "type": "divider"
                   }
               ]
           }
       );
       sendMessageToSlackResponseURL(actionJSONPayload.response_url, objects[j]);
   };

  
if (error) {
console.log(error);
} else {


}
});

 

}
 



}

      
    
});



function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }

    })
};


function sendMessageToSlackResponse(JSONmessage){
    var postOptions = {
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, body) => {
        if (error){
            // handle errors as you see fit
        }

    })
};
