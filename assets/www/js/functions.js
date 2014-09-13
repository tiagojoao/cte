var cte = (function(){

    var database,
    h,
    fade,
    all = h * 0.4,
    a = 0,
    notification = cordova.require("cordova/plugin/localNotification"),
    smsSendingPlugin = cordova.require('cordova/plugin/smssendingplugin'),
    lat, lon, latcine, loncine, networkstate = navigator.connection.type;
    document.addEventListener('deviceready', onDeviceReady, false);

    function onGeoSuccess(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        latcine = 40.751896;
        loncine = -8.571715;
        var currentposition = new google.maps.LatLng(lat,lon);
        var cineposition = new google.maps.LatLng(latcine,loncine);
        var mapoptions = {
            zoom: 16,
            center: cineposition,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapoptions);
        var marker = new google.maps.Marker({
            position: cineposition,
            map: map
        });
        var marker2 = new google.maps.Marker({
            title: 'A sua posição',
            position: currentposition,
            map: map
        });
    }
    function onGeoError(error) {
        console.log('erooo');    
        if( error ) {
            alert('Por favor active o serviço de localização.');
        }
    }
    function handleSocialShare(id , event_title, eventOrNews) {
        $('#select-choice-share option:selected').each(function() {  
            var text = event_title,
            url = 'http://www.cineteatroestarreja.com?#evento.php?id=' + id + '&from=all';
            shareService = $('#select-choice-share option:selected').val();
            switch (shareService) {
                case 'facebook':
                shareFacebookLike(url);
                break;
                case 'twitter':
                shareTwitter(url, text);
                break;
                default:
            }
        });
    }

    function handleMessages(id, event_title, eventOrNews) {
        var e = eventOrNews;
        $('#select-choice-share2 option:selected').each(function() {  
            var text = event_title,
            url = (e === 'true') ? 'http://www.cineteatroestarreja.com?#evento.php?id=' + id + '&from=all' : 'http://www.cineteatroestarreja.com?#noticia.php?id=' + id + '&from=all';
            shareService = $('#select-choice-share2 option:selected').val();

            console.log(e);            
            switch (shareService) {
                case 'message':
                console.log('entrou no switch mensagem');
                shareMessage(url, text, e);
                break;
                case 'email': "value", 
                console.log('entrou no switch email');
                shareEmail(text, url, e);
                break;
                default:
            }
        });
    }

    function messageOrEmail(id , event_title, eventOrNews) {
        var face = '<div style="top:250px"><label for="select-choice-share2">Recomendar</label><select class="shareTarget2" data-event-news="' + eventOrNews + '" name="select-choice-share2" id="select-choice-share2" data-icon="forward" data-mini="true" data-iconpos="left" class="ui-block-a" data-id="' + id + '" data-event-title="'  + event_title + '" ><option value="recomendar">recomendar:</option><option value="email">por email</option><option value="message">por mensagem</option></select></div>';
        $('body').append(face);
        var element = $("#select-choice-share2")[0], worked = false;
        if (document.createEvent) { // all browsers
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            worked = element.dispatchEvent(e);
        } else if (element.fireEvent) { // ie
            worked = element.fireEvent("onmousedown");
        }
        if (!worked) { // unknown browser / error
            console.log("It didn't worked in your browser.");
        }

    }

    function shareFacebookLike(url) {
        console.log(url);
            window.open(
      'http://www.facebook.com/sharer/sharer.php?u=' + url,
  '_blank' 
  );
    
    }


    function shareTwitter(url, text) {
                    window.open(
      'https://twitter.com/intent/tweet?text=Recomendo vivamente este evento: ' + text + '&url=' + url,
  '_blank' 
  );
        
    }

    function shareMessage(url, title, eventOrNews) {
        a += 1;
        var t = title.replace(/[^A-Za-z0-9@$_\/.,"():;\-=+&%#!?<>' \n]/, ''),
        u = url.replace(/[^A-Za-z0-9@$_\/.,"():;\-=+&%#!?<>' \n]/, '');
        var html = '<div data-role="page" id="message' + a + '"><div data-role="header" class="addMenus2">'
        + '<a href="#mypanel" data-role="button" data-icon="reorder" data-iconpos="notext"></a>'
        + '<h1>Mensagem</h1></div><div data-role="content">'
        + '<label for="numberMsg">Número</label> <input type="number" name="number" id="numberMsg" style="border:1px solid black" value=""/><br />'
        + '<label for="msg">Sugestão</label><textarea style="border:1px solid black" name="message" maxlength="255" rows="6" id="msg">Ola! Recomendo-te este evento - ' + t + ' - no Cine-Teatro de Estarreja: ' + u + '</textarea>'
        + '<button class="sendMessage">enviar</button></div></div>';
        $('body').append(html);
        $('.addMenus2').prepend(topNavigationMenu.backMenuButton).append(topNavigationMenu.slideMenuPanel);
        window.location = '#message' + a;
    }


    function shareEmail(subject, body, eventOrNews) {
            window.open(
      'mailto:destino?subject=Evento%20Cine-Teatro%20de%20Estarreja&body=Recomendo-te%20este%20evento%20do%20CineTeatro%20de%20Estarreja%20' + body,
  '_blank' 
  );
    }

    function shareSocial(id, event_title, eventOrNews){
        console.log(eventOrNews);
        var face = '<div style="top:250px"><select class="shareTarget" data-event-news="' + eventOrNews + '" name="select-choice-share" id="select-choice-share" data-icon="forward" data-mini="true" data-iconpos="left" class="ui-block-a" data-id="' + id + '" data-event-title="'  + event_title + '" ><option value="partilha">partilha:</option><option value="facebook">postar no facebook</option><option value="twitter">submeter um tweet</option></select></div>';
        $('body').append(face);
        var element = $("#select-choice-share")[0], worked = false;
    if (document.createEvent) { // all browsers
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        worked = element.dispatchEvent(e);
    } else if (element.fireEvent) { // ie
        worked = element.fireEvent("onmousedown");
    }
    if (!worked) { // unknown browser / error
        console.log("It didn't worked in your browser.");
    }


}


var pushNotification;

function feedLoaded(result) {
    var entry, noticia;
    if (!result.error) {
        for (var i = 0; i < result.feed.entries.length; i++) {

            entry = result.feed.entries[i];
            noticia = "<div class='newsTarget'>" + entry.title
            + '</div>'
            + '<div class="newsPanel"><div class="news"> <p>'
            + entry.content + "</p><p>"
            + entry.publishedDate.substring(25, 4) + "</p><div/></div><hr />";    

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

    h = $(window).height();
    database = window.openDatabase("Evento", "", "Evento", 1000000);
    database.transaction(setup, onDbError, onDbSuccess); 
    

    smsSendingPlugin.isSupported ((function(supported) {
        if(supported){} 
            else{
                alert('serviço de mensagens não suportado');}
            }), function() {

    });
    
    $.jsonp({
        url: 'http://www.cineteatroestarreja.com/agenda_json.php?list=all',    
        dataType: 'jsonp',
        callback: 'events',      
        success: function(data){successFirstPageSwipe(data)},
        error: function(error){errorFirstPageSwipe(error)}
    });
    
    
    networkstate = window.navigator.onLine;
}






$('.windowSize').height( all );
$('.windowSizeHalf').height( h * 0.2 );


// FUNCTIONS
// 
// 
var fades = function(){
    $('#iconSwipe').fadeOut(1000).fadeIn(1000).delay(2000);
}
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
    nextEventImage.attr('class', '.p' + events[len].id);
    
    fade = setInterval(fades, 1000);

    jQuery(window).on("swipe", function(event) {
        clearInterval(fade);
        $('#iconSwipe').fadeOut(3000).remove();
        switch (a) {
            case 1:
            var dataSecondEvent = DateObject(events[len-1].dates[0].date);
            nextEventTitle.html(events[len-1].event_title);
            nextEventText.html(dataSecondEvent.correctDisplayTime);
            nextEventImage.css('background-image', 'url("' + events[len-1].highlight_photo.url + '")');
            nextEventImage.attr('class', 'p' + events[len-1].id);
            a = 3;
            break;
            case 2:
            var dataThirdEvent = DateObject(events[len-2].dates[0].date);
            nextEventTitle.html(events[len-2].event_title);
            nextEventText.html(dataThirdEvent.correctDisplayTime);
            nextEventImage.css('background-image', 'url("' + events[len-2].highlight_photo.url + '")');
            nextEventImage.attr('class', 'p' + events[len-2].id);
            a = 1;
            break;
            case 3:
            nextEventTitle.html(events[len].event_title);
            nextEventText.html(dataFirstEvent.correctDisplayTime);
            nextEventImage.css('background-image', 'url("' + events[len].highlight_photo.url + '")');
            nextEventImage.attr('class', 'p' + events[len].id);
            a = 2;
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

    getAllEventsError(results);
}    

var getAllEventsError = function(error) {
    console.log('a ir buscar eventos');
    $.ajax({
        url: 'http://www.cineteatroestarreja.com/agenda_json.php?list=all',
        dataType: 'jsonp',
        jsonpCallback: 'events',
        success: function(e) {
            database.transaction(function(tx){saveEvents(tx, e)});
        },
        error: function(error) {
            console.log("no internet connection " + error.message);
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
        $('.favoritosContent').append('<div class="panel"> Não adicionou qualquer favorito.</div>');
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

    var data = new Date(),
        data3 = data + (86400000 * 7),
        data2 = data + 86400000;

    notification.add({
        id: 1,
        date: data,
        message: 'evento adicionado aos favoritos',
        subtitle: events.newObject[i].event_title + ' ' + events.newObject[i].date,
        ticker: "Favoritos - Evento Adicionado",
        repeatDaily: false
    });

    /*notification.add({
        id: 2,
        date: data2,
        message: 'proximo evento em 24 horas - CTE',
        subtitle: events.newObject[i].event_title + ' ' + events.newObject[i].date,
        ticker: "Proximo Evento 24 horas - CTE",
        repeatDaily: false
    });
        notification.add({
        id: 3,
        date: data3,
        message: 'proximo evento em 7 dias - CTE',
        subtitle: events.newObject[i].event_title + ' ' + events.newObject[i].date,
        ticker: "Proximo Evento 7 dias - CTE",
        repeatDaily: false
    });*/
    
    database.transaction(function(tx){

        var sql  = "INSERT INTO FAVORITES (id, event_type, event_title, event_technical_info, event_summary, event_description, event_original_title, event_subtitle, event_topic, event_subtopic, event_links, event_ticketline, event_last, highlight_photo, date) VALUES ('";
            sql += events.newObject[i].id + "', '" + events.newObject[i].event_type + "', '" + events.newObject[i].event_title + "', '" + events.newObject[i].event_technical_info + "', '" + events.newObject[i].event_summary + "', '" + events.newObject[i].event_description + "', '" + events.newObject[i].event_original_title + "', '" + events.newObject[i].event_subtitle + "', '" + events.newObject[i].topic + "', '" + events.newObject[i].event_subtopic + "', '" + events.newObject[i].event_links + "', '" + events.newObject[i].event_ticketline + "', '" + events.newObject[i].event_last + "', '" + events.newObject[i].highlight_photo + "', '" + events.newObject[i].date + "')";
    tx.executeSql(sql);
});
}

var removeSingleFavorite = function(id) {
        var data = new Date(); 
    notification.add({
        id: 1,
        date: data,
        message: 'removido dos favoritos',
        subtitle: events.newObject[i].event_title + ' ' + events.newObject[i].date,
        ticker: "Favoritos - Evento Removido",
        repeatDaily: false
    });
    current_id = id;
    database.transaction(function(tx){
        sql = "DELETE FROM FAVORITES WHERE id='" + current_id + "'";
        tx.executeSql(sql);
        console.log(sql + " removido com sucesso");
    });
    window.location = '#favoritos';
}

var saveEvents = function(tx, event) {
    console.log('saving events ?');
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
            icon = 'ok';

        } else {
            string = 'favorite',
            removeOrAdd = 'Remover',
            classToTarget = 'removeEventsFromFavorites',
            title = 'Favorito',
            icon = 'remove';
        }

        var conteudo  = "<div id='" + string + object.id + "' data-role='page' class='events' ><div data-role='header'>"
        + topNavigationMenu.backMenuButton + "<a href='#mypanel' data-role='button' data-icon='reorder' data-iconpos='notext'></a><h1>" + title + "</h1>"
        + topNavigationMenu.slideMenuPanel + "</div><div data-role='content'>"
        + "<img src='" + object.highlight_photo + "'  />"
        + "<div class='titleTarget'>" + object.event_title + "</div>"
        + "<div class=' " + classToTarget + "'>"
        + "<a href=\"#\" class=\"heyy heyRigth newPageRed\" data-role=\"button\" data-icon=\"shopping-cart\" data-iconpos=\"top\" >Reservar</a>"
        + "<a href=\"#\" data-role=\"button\" class=\"heyy heyLeft shareButton\"  data-icon=\"facebook-sign\" data-event-news='true' data-iconpos=\"top\"  data-id='" + object.original_id + "' data-event-title='"  + object.event_title + "' \">Partilhar</a>"
        + "<a href=\"#recomenda" + object.id + "\" class=\"heyy heyRigth shareMessage\" data-event-news='true'  data-id='" + object.original_id + "' data-event-title='"  + object.event_title + "'  data-role=\"button\" data-icon=\"share\" data-iconpos=\"top\" >Recomendar</a>"
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
    var instance = {}, nowDate, now;
    instance.date = new Date(data * 1000),
    instance.day = instance.date.getDay(),
    instance.month = instance.date.getMonth(),
    instance.hours = instance.date.getHours(),
    instance.minutes = instance.date.getMinutes() === 0 ? '00' : instance.date.getMinutes(),
    
    nowDate = new Date();
    now = nowDate.getMinutes();

    if ( instance.minutes - now < 10080 ) {
        instance.weekday = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
        instance.correctDisplayTime = instance.weekday[instance.day] + ' ' + instance.hours + ':' + instance.minutes;
    } else {
        instance.weekday = instance.date.getDate() + '/' + instance.month + '/' + instance.date.getFullYear();
        instance.correctDisplayTime = instance.weekday + ' ' + instance.hours + ':' + instance.minutes;
    }
    
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
 slideMenuPanel: '<div data-role="panel" id="mypanel" data-display="overlay" data-position="right">'
 + '<ul data-role="listview" >'
 + '<li data-icon="none"><a href="#agenda"><img src="icons/agenda-branco.png" height="50px" width="50px"><span style="padding-left:25%;vertical-align:text-top;">Agenda</span></a></li>'
 + '<li data-icon="none"><a href="#favoritos"><img src="icons/favoritos-branco.png" height="50px" width="50px"><span style="padding-left:25%; vertical-align:text-top;">Favoritos</a></li>'
 + '<li data-icon="none"><a href="#noticias"><img src="icons/noticias-branco.png" height="50px" width="50px"><span style="padding-left:25%; vertical-align:text-top;">Noticias</a></li>'
 + '<li data-icon="none"><a href="#comprar"><img src="icons/bilhetes-branco.png" height="50px" width="50px"><span style="padding-left:25%; vertical-align:text-top;">Comprar Bilhetes</a></li>'
 + '<li data-icon="none"><a href="#contactos"><img src="icons/mapa-branco.png" height="50px" width="50px"><span style="padding-left:25%; vertical-align:text-top;">Contactos</a></li>'
 + '<li data-icon="none"><a href="#passatempos"><img src="icons/jogos-branco.png" height="50px" width="50px"><span style="padding-left:25%; vertical-align:text-top;">Jogos</a></li></ul></div>',
 backMenuButton: '<a href="#" data-role="button" data-icon="chevron-left" data-iconpos="notext" data-direction="reverse" data-rel="back" style="padding-rigth:10px;"></a>'
}    

/* Cria as tables de Favoritos e Eventos se não existirem já */
var setup = function(tx) {

//tx.executeSql("DROP TABLE FAVORITES");
console.log(tx);
if( !networkstate ) {
    console.log('no internet');
} else {
    console.log('internet');
    tx.executeSql('DROP TABLE EVENTS');
}
tx.executeSql('CREATE TABLE IF NOT EXISTS FAVORITES (id, event_type, event_title, event_technical_info, event_summary, event_description, event_original_title, event_subtitle, event_topic, event_subtopic, event_links, event_ticketline, event_last, highlight_photo, date )', [], suc1, err1);
tx.executeSql('CREATE TABLE IF NOT EXISTS EVENTS (id, event_type, event_title, event_technical_info, event_summary, event_description, event_original_title, event_subtitle, event_topic, event_subtopic, event_links, event_ticketline, event_last, highlight_photo, date )', [], suc2, err2);
console.log('created tables');

}

function suc1(){
}

function suc2(){
}

function err2(e){
}
function err1(e){
}
var onDbError = function(error) {
    console.log(error.message);
    console.log(error.code);
}
var onDbSuccess = function() {
    console.log('sucesso'); 
}

/*
Defenir a configuração inicial do Jquery Mobile antes de iniciar a aplicação

Nota: O ficheiro jquerymobile.js só deve ser inicializado após a invocação desta configuração
Este ficheiro main.js encontra-se entre o jquery.js e o jquerymobile.js (Required)
*/    
$(document).bind("mobileinit", function(evt) {
    console.log('hey');
    $.mobile.defaultPageTransition = "slide";
    $.mobile.defaultDialogTransition = "flip";
    $.mobile.pageLoadErrorMessage = "A página não pode ser carregada! Verifique a sua ligação à internet.";
    $.mobile.addBackBtn = "true";
    $('.addMenus').prepend(topNavigationMenu.backMenuButton).append(topNavigationMenu.slideMenuPanel);

});

/*
Este evento é adicionado à página inicial
- Carrega próximos 3 eventos
- Attach da função swipe
- Usa o Objeto DateObject
*/

$(document).on('click','.addEventsToFavorites .thisUl', function() {
    var id = $(this).attr('rel');
    $('.addEventsToFavorites .thisUl').css('data-icon', 'star');
    addSingleEventToFavorite(id);
    
});

$(document).on('click', '.shareButton', function(){
    var id = $(this).attr('data-id'),
    title = $(this).attr('data-event-title'),
    eventOrNews = $(this).attr('data-event-news');
    console.log(eventOrNews);
    shareSocial(id, title, eventOrNews);
});

$(document).on('click','.removeEventsFromFavorites .thisUl', function() {
    var id = $(this).attr('rel');
    $('.addEventsToFavorites .thisUl').css('data-icon', 'star-empty');
    removeSingleFavorite(id);
    
});

$(document).on('click', '.shareMessage', function(){
    var id = $(this).attr('data-id'),
    event_title = $(this).attr('data-event-title'),
    eventOrNews = $(this).attr('data-event-news');
    console.log(eventOrNews);
    messageOrEmail(id, event_title, eventOrNews);

});

$(document).on('click', '.sendMessage', function(e) {
    //e.preventDefault();
    var msg = $('#msg').val(),
        number = $('#numberMsg').val(),
    m = msg.replace(/[^A-Za-z0-9@$_\/.,"():;\-=+&%#!?<>' \n]/, '');
    $('#numberMsg').remove();
    smsSendingPlugin.send(number, m, function() {  
        alert('Mensagem enviada com sucesso!');
    }, function() {
        alert('Verifique se o número que indicou está correcto, mensagem não enviada.');
    });
    window.location = '#main';  

});

$(document).on('change', '.shareTarget', function(){
    var id = $(this).attr('data-id'),
    title = $(this).attr('data-event-title'),
    eventOrNews = $(this).attr('data-event-news');
    console.log(eventOrNews);
    $('#select-choice-share').selectedIndex = 0;
    handleSocialShare(id, title, eventOrNews);    
});

$(document).on('change', '.shareTarget2', function(){
    var id = $(this).attr('data-id'),
    title = $(this).attr('data-event-title'),
    eventOrNews = $(this).attr('data-event-news');
    console.log(eventOrNews);
    $('#select-choice-share2').selectedIndex = 0;
    handleMessages(id, title, eventOrNews);    
});

$(document).on('pagebeforeshow', '#favoritos', function() {   
    if ( fade ) {
        clearInterval(fade);
        $('#iconSwipe').fadeOut(3000).remove();
    }
    
    $('.favoritosContent').html('');
    database.transaction(function(tx){
        tx.executeSql('SELECT DISTINCT * FROM FAVORITES;', [], getFavorites, errorFavorites);
    });
});

$(document).on('click', '.newPageRed', function(e){
    e.preventDefault();
    window.open(
      'http://cte.bilheteiraonline.pt',
  '_blank' // <- This is what makes it open in a new window.
  );

});

$(document).on('pageinit', '#agenda', function(){
    if ( fade ) {
        clearInterval(fade);
        $('#iconSwipe').fadeOut(3000).remove();
    }
    
    database.transaction(function(tx) {
        tx.executeSql('SELECT * FROM EVENTS', [], getAllEventsSuccess, getAllEventsError);
    });
});

$(document).on('pageinit', '#jogos', function(){
    if ( fade ) {
        clearInterval(fade);
        $('#iconSwipe').fadeOut(3000).remove();
    }
});


$(document).on("pagebeforeshow", '#contactos', function(){
    if ( fade ) {
        clearInterval(fade);
        $('#iconSwipe').fadeOut(3000).remove();
    }
    console.log('init contactos');
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {enableHighAccuracy: true});

});

google.load("feeds", "1");
google.setOnLoadCallback(OnLoad);
$(document).on('pageload', '#noticia', function(evt) {
    if ( fade ) {
        clearInterval(fade);
        $('#iconSwipe').fadeOut(3000).remove();
    }
    $('.noticiaContent').listview('refresh');
});
}());
