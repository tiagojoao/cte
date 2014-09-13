var cte = (function(){
    var database;
    var h = $(window).height(),
    all = h * 0.4;

function handleSocialShare(id , event_title) {
  $('#select-choice-share option:selected').each(function() {  
    text = event_title;
    url ='http://www.cineteatroestarreja.com?#evento.php?id=' + id + '&from=all';
    shareService = $('#select-choice-share option:selected').val();

    switch (shareService) {
      case 'facebook':
      console.log('entrou no switch faceeeee"');
      shareFacebookLike(url);
      break;
      case 'twitter':
      console.log('entrou no switch twitter"');
      shareTwitter(url, text);
      break;
      case 'email':
      console.log('entrou no switch twitter"');
      shareEmail(url, text);
      break;
      default:
  }
});
}

function shareFacebookLike(url) {
    window.location='http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
}


function shareTwitter(url, text) {
    window.location = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
}


function shareEmail(subject, body) {
    window.location = 'mailto:&subject=' + subject + '&body=' + body;
}

function shareSocial(id, event_title){
  console.log(id + event_title);

  var face = '<label for="select-choice-share">Partilhar</label><select class="shareTarget" name="select-choice-share" id="select-choice-share" data-icon="forward" data-mini="true" data-iconpos="left" class="ui-block-a" data-id="' + id + '" data-event-title="'  + event_title + '" ><option value="no">Partilhar</option> <option value="facebook">Post this on Facebook</option><option value="twitter">Tweet this</option><option value="email">Email</option></select>';
  $('body').html(face);
}


    var pushNotification;

    function feedLoaded(result) {
        var entry, noticia;
        console.log(result);
      if (!result.error) {
        for (var i = 0; i < result.feed.entries.length; i++) {

          entry = result.feed.entries[i];
          noticia = "<div class='newsTarget'>" + entry.title
                  + '</div>'
                  + "<a href=\"#\" data-role=\"button\" class=\"heyy heyLeft\"  data-icon=\"facebook-sign\" data-iconpos=\"top\" \">Partilhar</a>"
                  + "<a href=\"index.html#recomenda" + i + "\" class=\"heyy heyRigth shareButton \"  data-role=\"button\" data-icon=\"share\" data-iconpos=\"top\" >Recomendar</a>"
                  + '<div class="newsPanel"><div class="news"> <p>'
                  + entry.content + "</p><p>"
                  + entry.publishedDate + "</p><div/></div>";              
    
          $('.noticiaContent').append(noticia);
      }
  }
}

function OnLoad() {
  var feed = new google.feeds.Feed("http://www.cineteatroestarreja.com/rss.php");
  feed.setNumEntries(20);
  feed.load(feedLoaded);
}


function onDeviceReady() {
setTimeout(function(){
    $('body').append('heyyy');
}, 3000);
    
    document.addEventListener("backbutton", function(e)
    {
        $("#app-status-ul").append('<li>backbutton event received</li>');

        if( $("#home").length > 0) {
            // call this to get a new token each time. don't call it to reuse existing token.
            //pushNotification.unregister(successHandler, errorHandler);
            e.preventDefault();
            navigator.app.exitApp();
        }
        else
        {
            navigator.app.backHistory();
        }
    }, false);

    try 
    { 
        pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android') {
            $("#app-status-ul").append('<li>registering android</li>');
                        pushNotification.register(successHandler, errorHandler, {"senderID":"661780372179","ecb":"onNotificationGCM"});     // required!
                    } else {
                        $("#app-status-ul").append('<li>registering iOS</li>');
                        pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});    // required!
                    }
                }
                catch(err) 
                { 
                    txt="There was an error on this page.\n\n"; 
                    txt+="Error description: " + err.message + "\n\n"; 
                    alert(txt); 
                } 
            }
            
            // handle APNS notifications for iOS
            function onNotificationAPN(e) {
                if (e.alert) {
                   $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
                   navigator.notification.alert(e.alert);
               }

               if (e.sound) {
                var snd = new Media(e.sound);
                snd.play();
            }

            if (e.badge) {
                pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
            }
        }

            // handle GCM notifications for Android
            function onNotificationGCM(e) {
                $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
                
                switch( e.event )
                {
                    case 'registered':
                    if ( e.regid.length > 0 )
                    {
                        $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                        // Your GCM push server needs to know the regID before it can push to this device
                        // here is where you might want to send it the regID for later use.
                        console.log("regID = " + e.regID);
                    }
                    break;
                    
                    case 'message':
                        // if this flag is set, this notification happened while we were in the foreground.
                        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                        if (e.foreground)
                        {
                            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                            
                            // if the notification contains a soundname, play it.
                            var my_media = new Media("/android_asset/www/"+e.soundname);
                            my_media.play();
                        }
                        else
                        {   // otherwise we were launched because the user touched a notification in the notification tray.
                            if (e.coldstart)
                                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                            else
                                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                        }

                        $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                        $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                        break;

                        case 'error':
                        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                        break;

                        default:
                        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                        break;
                    }
                }

                function tokenHandler (result) {
                    $("#app-status-ul").append('<li>token: '+ result +'</li>');
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
            }
            
            function successHandler (result) {
                $("#app-status-ul").append('<li>success:'+ result +'</li>');
            }
            
            function errorHandler (error) {
                $("#app-status-ul").append('<li>error:'+ error +'</li>');
            }
            
            document.addEventListener('deviceready', onDeviceReady, true);
//
//  
//    
//      
//        
//          
//            
//                

$('.windowSize').height( all );
$('.windowSizeHalf').height( h * 0.2 );


// FUNCTIONS
// 
// 
var successFirstPageSwipe = function(events) {

    var len = events.length - 1,
    nextEventTitle = $('#titleNextEvt'),
    nextEventText = $('#textNextEvt'),
    nextEventImage = $('#mainImage'),
    dataFirstEvent = DateObject(events[len].dates[0].date),
    a = 1;

    nextEventTitle.html(events[len].event_title);
    nextEventText.html(dataFirstEvent.correctDisplayTime);
    nextEventImage.css('background-image', 'url("' + events[len].highlight_photo.url + '")');

    jQuery(window).on("swipe", function(event) {

        switch (a) {
            case 1:
            var dataSecondEvent = DateObject(events[len-1].dates[0].date);
            nextEventTitle.html(events[len-1].event_title);
            nextEventText.html(dataSecondEvent.correctDisplayTime);
            nextEventImage.css('background-image', 'url("' + events[len-1].highlight_photo.url + '")');
            a = 2;
            break;
            case 2:
            var dataThirdEvent = DateObject(events[len-2].dates[0].date);
            nextEventTitle.html(events[len-2].event_title);
            nextEventText.html(dataThirdEvent.correctDisplayTime);
            nextEventImage.css('background-image', 'url("' + events[len-2].highlight_photo.url + '")');
            a = 3;
            break;
            case 3:
            nextEventTitle.html(events[len].event_title);
            nextEventText.html(dataFirstEvent.correctDisplayTime);
            nextEventImage.css('background-image', 'url("' + events[len].highlight_photo.url + '")');
            a = 1;
            break;
        } 
    });
}


var errorFirstPageSwipe = function(error) {
    nextEventImage.css('background-image', 'url("img/main.png")');
    nextEventTitle.html('Verifica a tua conexão à internet');
    nextEventText.html();
}

var getAllEventsSuccess = function(tx, results){
    last = results.rows.length;
    if( last === 0){
        getAllEventsError(results);
    } else {
        console.log('Eventos da base de dados');
        var e = '',
        conteudo = '', 
        string = 'evento';
        first = results.rows.items(0).id;
        console.log(first);
        console.log(last);
        for ( i = first ; i < last; i += 1 ) {
            events.newObject[i] = CurrentObject(i);
            conteudo += events.getEventsBodyContent(results, 'true');
            e += events.getList(results, 'true');            
        }
        $('body').append(conteudo);
        $('.agendaContent').append(e);
        $('.agendaContent').listview('refresh');
    }
}    

var getAllEventsError = function(error) {
    $.ajax({
        url: 'http://www.cineteatroestarreja.com/agenda_json.php?list=all',
        dataType: 'jsonp',
        jsonpCallback: 'events',
        success: function(e) {
            database.transaction(function(tx){saveEvents(tx, e)});
        },
        error: function(error) {
            console.log("no internet connection " + error);
        }
    });
}

var errorFavorites = function(error) {
    console.log('erro');
    console.log('errorFavorites - > ' +  error);
}

var getFavorites = function(tx, results) {
    var len = results.rows.length;
    if ( len === 0 ) {
        $('.favoritosContent').append('<li>Não adicionou qualquer favorito.</li>');
    } else {
        var e = '', conteudo='';
        for ( i = 0; i < len; i += 1 ) {
            conteudo += events.getEventsBodyContent(results.rows.item(i), 'false'); 
            e += events.getList(results.rows.item(i), 'false'); 
        }      
        $('body').append(conteudo);
        $('.favoritosContent').append(e);
        $('.favoritosContent').listview('refresh');
    }
}

var addSingleEventToFavorite = function(i) {
    console.log(i);
    database.transaction(function(tx){
        console.log(i);
        var sql  = "INSERT INTO FAVORITES (id, event_type, event_title, event_technical_info, event_summary, event_description, event_original_title, event_subtitle, event_topic, event_subtopic, event_links, event_ticketline, event_last, highlight_photo, date) VALUES ('";
            sql += events.newObject[i].id + "', '" + events.newObject[i].event_type + "', '" + events.newObject[i].event_title + "', '" + events.newObject[i].event_technical_info + "', '" + events.newObject[i].event_summary + "', '" + events.newObject[i].event_description + "', '" + events.newObject[i].event_original_title + "', '" + events.newObject[i].event_subtitle + "', '" + events.newObject[i].topic + "', '" + events.newObject[i].event_subtopic + "', '" + events.newObject[i].event_links + "', '" + events.newObject[i].event_ticketline + "', '" + events.newObject[i].event_last + "', '" + events.newObject[i].highlight_photo + "', '" + events.newObject[i].date + "')";
    tx.executeSql(sql);
});
}

var removeSingleFavorite = function(id) {
    current_id = id;
    database.transaction(function(tx){
        sql = "DELETE FROM FAVORITES WHERE id='" + current_id + "'";
        tx.executeSql(sql);
        console.log(sql + " removido com sucesso");
    });
}

var saveEvents = function(tx, event) {
    var l = event.length, cont, sql, conte='', i;    
    console.log(event);

    for ( i = 0; i < l; i++ ) {

        events.newObject[i] = CurrentObject(event, i);
        sql  = "INSERT INTO EVENTS (id, event_type, event_title, event_technical_info, event_summary, event_description, event_original_title, event_subtitle, event_topic, event_subtopic, event_links, event_ticketline, event_last, highlight_photo, date) VALUES ('";
            sql += i + "', '" + events.newObject[i].event_type + "', '" + events.newObject[i].event_title + "', '" + events.newObject[i].event_technical_info + "', '" + events.newObject[i].event_summary + "', '" + events.newObject[i].event_description + "', '" + events.newObject[i].event_original_title + "', '" + events.newObject[i].event_subtitle + "', '" + events.newObject[i].event_topic + "', '" + events.newObject[i].event_subtopic + "', '" + events.newObject[i].event_links + "', '" + events.newObject[i].event_ticketline + "', '" + events.newObject[i].event_last + "', '" + events.newObject[i].highlight_photo + "', '" + events.newObject[i].date + "')";
tx.executeSql(sql);
cont += events.getEventsBodyContent(events.newObject[i], 'true');
conte += events.getList(events.newObject[i], 'true');
}

$('body').append(cont);
$('.agendaContent').append(conte);
$('.agendaContent').listview('refresh');        
}

var clean = function(string) {
    var e = string + '';
    return e.replace(/<(?!\s*\/?(br|p)\b)[^>]+>/ig, '');
}


// OBJECTS
// 
// 
var CurrentObject = function(results, i) {
    var instance = {};
    instance.id = i,
    instance.original_id = (results.rows) ? clean(results.rows.item(i).id) : clean(results[i].id), 
    instance.event_type = (results.rows) ? clean(results.rows.item(i).event_type) : clean(results[i].event_type),
    instance.event_title = (results.rows) ? clean(results.rows.item(i).event_title) : clean(results[i].event_title),
    instance.event_technical_info = (results.rows) ? clean(results.rows.item(i).event_technical_info) : clean(results[i].event_technical_info),
    instance.event_summary = (results.rows) ? clean(results.rows.item(i).event_summary) : clean(results[i].event_summary),
    instance.event_description = (results.rows) ? clean(results.rows.item(i).event_description) : clean(results[i].event_description),
    instance.event_original_title = (results.rows) ? clean(results.rows.item(i).event_original_title) : clean(results[i].event_original_title),
    instance.event_subtitle = (results.rows) ? clean(results.rows.item(i).event_subtitle) : clean(results[i].event_subtitle),
    instance.event_topic = (results.rows) ? clean(results.rows.item(i).event_topic) : clean(results[i].event_topic), 
    instance.event_subtopic = (results.rows) ? clean(results.rows.item(i).event_subtopic) : clean(results[i].event_subtopic),
    instance.event_links = (results.rows) ? clean(results.rows.item(i).event_links) : clean(results[i].event_links),
    instance.event_ticketline = (results.rows) ? clean(results.rows.item(i).event_ticketline) : clean(results[i].event_ticketline),
    instance.event_last = (results.rows) ? clean(results.rows.item(i).event_last) : clean(results[i].event_last),
    instance.highlight_photo = (results.rows) ? clean(results.rows.item(i).highlight_photo.url) : clean(results[i].highlight_photo.url),
    date = (results.rows) ? clean(results.rows.item(i).dates[0].date) : clean(results[i].dates[0].date);
    newDate = DateObject(date);
    instance.date = newDate.correctDisplayTime;
    
    return instance;
}

var events = {
    newObject: [],

    getEventsBodyContent: function(object, eventOrFavorite) {
        var string, removeOrAdd, classToTarget, title;

        if ( eventOrFavorite === 'true' ) {
            string = 'event',
            removeOrAdd = 'Favorito',
            classToTarget = 'addEventsToFavorites',
            title = 'Evento',
            icon = 'star-empty';
        } else {
            string = 'favorite',
            removeOrAdd = 'Remover',
            classToTarget = 'removeEventsFromFavorites',
            title = 'Favorito',
            icon = 'star';
        }

        var conteudo  = "<div id='" + string + object.id + "' data-role='page' class='events' ><div data-role='header'>"
        + topNavigationMenu.backMenuButton + "<a href='#mypanel' data-role='button' data-icon='reorder' data-iconpos='notext'></a><h1>" + title + "</h1>"
        + topNavigationMenu.slideMenuPanel + "</div><div data-role='content'>"
        + "<img src='" + object.highlight_photo + "'  />"
        + "<div class='titleTarget'>" + object.event_title + "</div>"
        + "<div class=' " + classToTarget + "'>"
        + "<a href=\"http://cte.bilheteiraonline.pt/\" class=\"heyy heyRigth\" data-role=\"button\" data-icon=\"shopping-cart\" data-iconpos=\"top\" >Reservar</a>"
        + "<a href=\"#\" data-role=\"button\" class=\"heyy heyLeft shareButton\"  data-icon=\"facebook-sign\" data-iconpos=\"top\"  data-id='" + object.original_id + "' data-event-title='"  + object.event_title + "' \">Partilhar</a>"
        + "<a href=\"index.html#recomenda" + object.id + "\" class=\"heyy heyRigth\"  data-role=\"button\" data-icon=\"share\" data-iconpos=\"top\" >Recomendar</a>"
        + "<a href=\"#\" data-role=\"button\" data-icon=\"" + icon + "\" class=\"heyy heyLeft thisUl\"  data-iconpos=\"top\" eventOrFavorite=\"" + eventOrFavorite + "\" rel=\"" + object.id + "\" >" + removeOrAdd + "</a></div>"
        + "<data-role=\"button\" data-inset='true' data-corners='false' class='eventInformation'><p><div class='panel'>"
        + "<h5>" + object.event_subtitle + "</h5>"
        + "</p><p' >" + object.event_original_title +"</p><p>"
        + object.event_topic + object.event_subtopic
        + "</p><p>"
        + object.event_technical_info + "</div></div></div>";
        return conteudo;
    },

    getList: function(object, eventOrFavorite) {
      var e;
      string = (eventOrFavorite === 'true') ? '#event' : '#favorite';
      e = "<li data-icon='chevron-right'><a href=\"" + string + object.id + "\" data-transition='slide'><img src=\""
      + object.highlight_photo + "\" class=\"ui-li-imagens\"/>"
      + "<h1>"
      + object.event_title + "</h1><p style=\"font-weight:bold\">"
      + object.date + "</p><p>"
      + "</p></a></li>";
      return e;
  },

  stringClean: function(string){
      return string.replace("'", " ");
  }
};

/*
DateObject Constructor
    - Aceita a data do evento como parametro (required)
    - Instancia 6 propriedades
    - Instancia 0 métodos
    - Retorna o Objeto
Para inicializar basta atribuir a uma variavel este objeto .:Ex:. var novaData = DateObject(dataDoEvento)
*/
var DateObject = function(data) {
    var instance = {};
    instance.weekday = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
    instance.date = new Date(data * 1000),
    instance.day = instance.date.getDay(),
    instance.hours = instance.date.getHours(),
    instance.minutes = instance.date.getMinutes() === 0 ? '00' : instance.date.getMinutes(),
    instance.correctDisplayTime = instance.weekday[instance.day] + ' - ' + instance.hours + ' : ' + instance.minutes;
    return instance;
}

/*
Object Literal
- slideMenuPanel : menu principal que desliza do lado direito para o lado esquerdo (Contém as 6 opções principais)
- backMenuButton : 'go back' button. Retorna para a última página visitada, guardando as anteriores em cache.
Nota: a utilização do backMenuButton não é uma boa prática, visto que guarda todas as paginas visitadas e retorna sempre para a anterior, e não para o menu anterior.
Isto faz com que se virmos 10 eventos, e quisermos voltar ao menu inicial através do backMenuButton, teremos de clicar 10 vezes, em vez de 3.
*/
var topNavigationMenu = {
    slideMenuPanel:   '<div data-role="panel"  id="mypanel" data-display="overlay" data-position="right">'
    + '<ul data-role="listview" ><li><span id="homePageBtn"><h1>Menu</h1></span></li>'
    + '<li data-icon="plus-sign"><a href="#agenda">Agenda</a></li>'
    + '<li data-icon="plus-sign"><a href="#noticias">Noticias</a></li>'
    + '<li data-icon="plus-sign"><a href="#comprar">Comprar Bilhetes</a></li>'
    + '<li data-icon="plus-sign"><a href="#passatempos" onclick="showAlert(); return false;">Passatempos</a></li>'
    + '<li data-icon="plus-sign"><a href="#favoritos" >Favoritos</a></li>'
    + '<li data-icon="plus-sign"><a href="#contactos">Como Chegar</a></li></ul></div>',
    backMenuButton: '<a href="#" data-role="button" data-icon="chevron-left" data-iconpos="notext" data-direction="reverse" data-rel="back"></a>'
}    

/* Cria as tables de Favoritos e Eventos se não existirem já */
var setup = function(tx) {
    //tx.executeSql("DROP TABLE FAVORITES");
    var networkstate = window.navigator.onLine;
    if( !networkstate ) {
        console.log('no internet');
    } else {
        console.log('internet');
        tx.executeSql('DROP TABLE EVENTS');
    }
    tx.executeSql('CREATE TABLE IF NOT EXISTS FAVORITES (id, event_type, event_title, event_technical_info, event_summary, event_description, event_original_title, event_subtitle, event_topic, event_subtopic, event_links, event_ticketline, event_last, highlight_photo, date )', [], onDbSuccess, onDbError);
    tx.executeSql('CREATE TABLE IF NOT EXISTS EVENTS (id, event_type, event_title, event_technical_info, event_summary, event_description, event_original_title, event_subtitle, event_topic, event_subtopic, event_links, event_ticketline, event_last, highlight_photo, date )', [], onDbSuccess, onDbError);
}

/*
Função chamada quando ocorrer um erro na base de dados
*/
var onDbError = function(error) {
  console.log(error);
}

/*
Função chamada quando a operação na base de dados for concretizada
*/
var onDbSuccess = function() {
 console.log('sucesso'); 
}

/*
Defenir a configuração inicial do Jquery Mobile antes de iniciar a aplicação

Nota: O ficheiro jquerymobile.js só deve ser inicializado após a invocação desta configuração
Este ficheiro main.js encontra-se entre o jquery.js e o jquerymobile.js (Required)
*/    
$(document).bind("mobileinit", function(evt) {
    $.mobile.defaultPageTransition = "slide";
    $.mobile.defaultDialogTransition = "flip";
    $.mobile.pageLoadErrorMessage = "A página não pode ser carregada! Verifique a sua ligação à internet.";
    $.mobile.addBackBtn = "true";
    $('.addMenus').prepend(topNavigationMenu.backMenuButton).append(topNavigationMenu.slideMenuPanel);
    database = window.openDatabase("Events", "", "Events", 2000000);
    database.transaction(setup, onDbError, onDbSuccess);
});

/*
Este evento é adicionado à página inicial
- Carrega próximos 3 eventos
- Attach da função swipe
- Usa o Objeto DateObject
*/
$(document).on('pagebeforeshow', '#main', function(e) {
    $(this).css('overflow', 'hidden');
    $.jsonp({
        url: 'http://www.cineteatroestarreja.com/agenda_json.php?list=all',    
        dataType: 'jsonp',
        callback: 'events',      
        success: function(data){successFirstPageSwipe(data)},
        error: function(error){errorFirstPageSwipe(error)}
    });
});

$(document).on('pageinit', '#agenda', function() {
    database.transaction(function(tx){
        tx.executeSql('SELECT * FROM EVENTS', [], getAllEventsSuccess, getAllEventsError);
    });
});

$(document).on('click','.addEventsToFavorites .thisUl', function() {
    var id = $(this).attr('rel');
    addSingleEventToFavorite(id);
    
});

$(document).on('click', '.shareButton', function(){
    var id = $(this).attr('data-id')
        title = $(this).attr('data-event-title');
        shareSocial(id, title);
});
$(document).on('click','.removeEventsFromFavorites .thisUl', function() {
    var id = $(this).attr('rel');
    removeSingleFavorite(id);
    
});

$(document).on('change', '.shareTarget', function(){
    var id = $(this).attr('data-id')
        title = $(this).attr('data-event-title');
        handleSocialShare(id, title);    
})

$(document).on('pagebeforeshow', '#favoritos', function() {   

    $('.favoritosContent').html('');
    database.transaction(function(tx){
        tx.executeSql('SELECT * FROM FAVORITES;', [], getFavorites, errorFavorites);
    });
});

// Get XML
google.load("feeds", "1");
google.setOnLoadCallback(OnLoad);
$(document).on('pageload', '#noticia', function(evt) {
  $('.noticiaContent').listview('refresh');
});

}());

/*var 

var db, dbresults, itemindex, lat, lon, tx;
var obj = new Array();

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// Phonegap Storage Api

function store() {
}
// Google Maps Api
function onGeoSuccess(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  latcine = 40.75200;
  loncine = -8.571718;
  var currentposition = new google.maps.LatLng(lat,lon);
  var cineposition = new google.maps.LatLng(latcine,loncine);
  var mapoptions = {
    zoom: 16,
    center: cineposition,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map = new google.maps.Map(document.getElementById('map'), mapoptions);
var marker = new google.maps.Marker({
    position: currentposition,
    map: map
});
}
function onGeoError(error) {
  if ( error === 1 ) {
    alert('Turn on Geolocation services.');
}
}
function onError(message) {
  alert(message);
}


function alturaEcra() {
  document.write(screen.height);
}





}());

*/