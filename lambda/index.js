/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const startVoice = 'Abriendo Skill donde podrás obtener los próximos lanzamientos de juegos. Estás són las opciones disponibles: juego más cercano de lanzamiento, próximo juego de lanzamiento.';
const helpGame = 'Estás són las opciones disponibles que te pueden ayudar: juego más cercano de lanzamiento, próximo juego de lanzamiento.';

var next_g = 3;

const https = require('https');
var json_data;
const name_game = [];
const date_game_launch = [];

var req = https.get("https://api.crackwatch.com/api/games?page=0&is_released=false&is_sort_inverted=true", function(res) {
  
var data = '';
        
    res.on('data', function(stream) {
      data += stream;
    });
    
    res.on('end', function() {
        json_data = JSON.parse(data);
            
        for (var i = 0; i <= 29; i++) {
          
            name_game[i] = json_data[i].title;
            
            var phrase = json_data[i].releaseDate;
            var resultado_split_month_year = phrase.split("-");
            var day = resultado_split_month_year[2];
            var resultado_split_day = day.split("T");
            var month = get_month(resultado_split_month_year[1]);
          
            date_game_launch[i] = resultado_split_day[0]+" de "+month+" del "+resultado_split_month_year[0];
        }
            
        });
});


function get_month(resultado_split_month_year){
  
  if(resultado_split_month_year[1] == 1 || resultado_split_month_year[1] == 01){
    return "enero";
  }
  else if(resultado_split_month_year[1] == 2 || resultado_split_month_year[1] == 02){
    return "febrero";
  }
  else if(resultado_split_month_year[1] == 3 || resultado_split_month_year[1] == 03){
    return "marzo";
  }
  else if(resultado_split_month_year[1] == 4 || resultado_split_month_year[1] == 04){
    return "abril";
  }
  else if(resultado_split_month_year[1] == 5 || resultado_split_month_year[1] == 05){
    return "mayo";
  }
  else if(resultado_split_month_year[1] == 6 || resultado_split_month_year[1] == 06){
    return "junio";
  }
  else if(resultado_split_month_year[1] == 7 || resultado_split_month_year[1] == 07){
    return "julio";
  }
  else if(resultado_split_month_year[1] == 8 || resultado_split_month_year[1] == 08){
    return "agost";
  }
  else if(resultado_split_month_year[1] == 9 || resultado_split_month_year[1] == 09){
    return "septiembre";
  }
  else if(resultado_split_month_year[1] == 10 || resultado_split_month_year[1] == 10){
    return "octubre";
  }
  if(resultado_split_month_year[1] == 11 || resultado_split_month_year[1] == 11){
    return "noviembre";
  }
  if(resultado_split_month_year[1] == 12 || resultado_split_month_year[1] == 12){
    return "diciembre";
  }
}


const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    
    return handlerInput.responseBuilder
      .speak(startVoice)
      .reprompt(startVoice)
      .getResponse();
  },
};


const proximoJuegoHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'proximoJuego';
  },
  handle(handlerInput) {
    var next_game = "El próximo juego és "+name_game[0]+" con fecha de lanzamiento "+date_game_launch[0]+".";

    return handlerInput.responseBuilder
      .speak(next_game)
      .reprompt(next_game)
      .getResponse();
  },
};


const siguienteJuegoHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'siguienteJuego';
  },
  handle(handlerInput) {
    
    var next_game = siguienteJuegoFunc();
    next_g++;
    
    return handlerInput.responseBuilder
      .speak(next_game)
      .reprompt(next_game)
      .getResponse();
  },
};

function siguienteJuegoFunc(){
    
    var siguienteJuego;

    if(next_g >= 0 || next_g <=30){
      siguienteJuego = "El siguiente juego és "+name_game[next_g]+" con fecha de lanzamiento "+date_game_launch[next_g]+".";
    }else{
       siguienteJuego ="Has superado él limite de 30 juegos.";
    }
    
    return siguienteJuego;
}

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    
    return handlerInput.responseBuilder
      .speak(helpGame)
      .reprompt(startVoice)
      .getResponse();
  },
};


const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak('Cerrando la Skill, próximos lanzamientos de juegos.')
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};



const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Ha ocurrido un error.')
      .reprompt('Ha ocurrido un error.')
      .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    proximoJuegoHandler,
    siguienteJuegoHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();