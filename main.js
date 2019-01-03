$(document).ready(init);
/*************************************************************************/
//Global Variables go down here:
var arrayOfPlayers = [];
var arrayCommaString = arrayOfPlayers.join();
var onlinePlayerArray = [];
var dotaPlayers = {
    Masondota2: "315657960",
    Dendi: "70388657",
    Arteezy: "104070670",
    SexyBamboe: "20321748",
    Singsing: "97577101",
    Darskyl: "161444478",
    Gorgc: "56939869",
    Canceldota: "141690233",
    Timado: "97658618",
    henry: "205743502",
    MerliniDota: "67760037",
    ODPixel: "89511038",
    monkeys_forever: "86811043",
    aliastar: "83347409",
    balla_: "86809886",
    explosiv_fury: "78891550"
}
var bfPlayers = {
    twistydoesntmiss: 'TwistyDoesntMlSS',
    dazs: 'Ascend_Dazs',
    Boccarossa13: 'Boccarossa',
    misterkaiser: 'Mister_Kaiser',
    mistersamonte: 'MisterSamonte',
    Gen_Odyssey: 'Gen-Odyssey',
    th1r3een: 'l---th1r3een---I',
    julianjanganoo: 'JulianJanganoo',
    fragurassTV: 'fragurassTV',
    SteelRhythm: 'SteelRhythm',
    GodricLight: 'GodricLight',
}
var fortniteTopPlayers = {
    Ninja: 'Ninja',
    NICKMERCS: 'NICKMERCS',
    TwitchProspering: 'TwitchProspering',
    twitch_bogdanakh: 'twitch_bogdanakh',
    TSM_Myth: 'TSM_Myth',
    CourageJD: 'CourageJD',
    Dakotaz: 'Dakotaz',
    Ranger: 'WBG Ranger',
    SypherPK: 'SypherPK',
    Svennoss: 'Svennoss',
    uwatakashi: 'Uwatakashi_',
    Fnatic_Ettnix: 'Twitch-Ettnix',
    trymacs: "twitch trymacs",
    drnkie: "drnkie",
    FearItSelf: 'FearItSelf',
    TSM_Daequan: 'TSM_Daequan',
    HighDistortion: 'HighDistortion',
}
var codPlayers = {
    Rallied: 'RalDaddy',
    Octane: 'Octane623',
    K1LLa93: 'AdamKIIIa',
    Blazt: 'lBlaztR',
    Dashy: 'Dashy-SZN',
    aBeZy: 'aBeZy-',
    pamaj: "pamajino",
    Shooter: 'Shooter',
    DrDisrespect: 'DrDisrespect',
    Pootie33: 'Pootie33',
    ThatChickParker: 'ThatChickParker', 
    Parasite: 'Parasite',
    PIPOPING: 'PIPOPING',
    KuavoKen: 'KuavoKenny',
    SlasheRAL: 'sIasher707',
    Ashtronova: 'Ashtronova',
    MrShaeButter: 'MrShaeButter',
    KaneQuake: 'KaneQuake',
    
}
var firstPage = true;
var gameDataBf;
var gameDataCod;
var gameDataDota = {};
var fortniteStatsObject = {};

/*************************************************************************/
//All functions go down here:

function init() {
    $('#myModal').modal('show');
    createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers, codPlayers);
    getOnlinePlayers();
    addTextToModal();
    $(".up").click(scrollUp)
    $(".down").click(scrollDown)
}

function scrollDown() {
    var elmnt = document.getElementById("livePlayers");
    var h = elmnt.clientHeight
    $('#livePlayers').animate({ scrollTop: "+=" + h }, "1000");
}
function scrollUp() {
    var elmnt = document.getElementById("livePlayers");
    var h = elmnt.clientHeight
    $('#livePlayers').animate({ scrollTop: "-=" + h }, "1000");
}

function addTextToModal() {
    $('.modalText').text(
        'Here at Twtich Buddy we show in-game stats of streamers who play Fortnite, DOTA2, COD4, and Battlefield 1. Go ahead and click on your favorite streamer and laugh at how many times they have died. Enjoy!'
    )
}

function createAllPlayersArray(firstObject, secondObject, thirdObject, fourthObject) {
    arrayOfPlayers = []
    var newArray = [firstObject, secondObject, thirdObject, fourthObject]
    for (var arrayIndex = 0; arrayIndex < newArray.length; arrayIndex++) {
        arrayOfPlayers.push(...Object.keys(newArray[arrayIndex]));
    }
}

function getBfPlayerData(player) {
    var ajaxConfig = {
        url: "https://danielpaschal.com/lfzproxies/battlefieldproxy.php",
        method: "GET",
        dataType: 'Json',
        data: {
            platform: 3,
            displayName: player
        },
        headers: {
            "TRN-Api-Key": "2e1d6fb9-7bd6-4cd5-8121-2eeb037845eb"
        },
        success: function (response) {
            var wins = response.result.basicStats.wins;
            var losses = response.result.basicStats.losses;
            var kills = response.result.basicStats.kills;
            var deaths = response.result.basicStats.deaths;
            var accuracyRatio = response.result.accuracyRatio;
            gameDataBf = {
                'Player': player,
                'Wins': wins,
                'Losses': losses,
                'Kills': kills,
                'Deaths': deaths,
                'Accuracy': parseFloat(accuracyRatio * 100).toFixed(1) + "%"
            }
            displayStats(gameDataBf)
        }
    }
    $.ajax(ajaxConfig)
}

function getOnlinePlayers() {
    var arrayCommaString = arrayOfPlayers.join();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.twitch.tv/kraken/streams?channel=" + arrayCommaString,
        "method": "GET",
        "headers": {
            "Client-ID": "2jfkzp4pqy42ge7y17na6l0kf8fdtx",
        }
    }
    $.ajax(settings).done(function (response) {
        makeOnlinePlayerObj(response);
        renderLivePlayersOnDom();
    });
}

function recreateOnlinePlayerArrayToHaveOnlyOurGamePlayers() {
    var validGames = ["Battlefield 1", "Dota 2", "Fortnite", "Call of Duty: Black Ops 4"];

    for (var arrayIndex = 0; arrayIndex < onlinePlayerArray.length; arrayIndex++) {
        var currentGame = onlinePlayerArray[arrayIndex].game;
        if (!validGames.includes(currentGame)) {
            onlinePlayerArray.splice(arrayIndex, 1);
            arrayIndex--;

        }

    }
}

function makeOnlinePlayerObj(response) {
    onlinePlayerArray = []
    for (var i = 0; i < response.streams.length; i++) {
        var tempPlayerObj = {};
        var streamingGame = response.streams[i].game;
        var thumbnail = response.streams[i].preview.large;
        var displayName = response.streams[i].channel.display_name;
        var status = response.streams[i].channel.status;
        var viewers = response.streams[i].viewers;
        tempPlayerObj.game = streamingGame;
        tempPlayerObj.thumbnail = thumbnail;
        tempPlayerObj.displayName = displayName;

        onlinePlayerArray.push(tempPlayerObj);
    }
}

function getDotaPlayers(player, name) {
    var rank = {
        "url": "https://api.opendota.com/api/players/" + player,
        "method": "GET"
    }
    var winLoss = {
        "url": "https://api.opendota.com/api/players/" + player + "/wl",
        "method": "GET"
    }
    var previousGame = {
        "url": "https://api.opendota.com/api/players/" + player + "/matches",
        "method": "GET"
    }
    gameDataDota.Player = name
    $.ajax(rank).then(getDotaRank)
    $.ajax(winLoss).then(getDotaWinLoss)
    $.ajax(previousGame).then(getDotaPreviousGame)
}

function getDotaRank(response) {
    gameDataDota.Rank = response.mmr_estimate.estimate;
}

function getDotaWinLoss(response) {
    gameDataDota.Wins = response.win;
    gameDataDota.Loses = response.lose;
}

function getDotaPreviousGame(response) {
    gameDataDota["Previous Kills"] = response[0].kills;
    gameDataDota["Previous Deaths"] = response[0].deaths;
    gameDataDota["Previous Assists"] = response[0].assists;
    if (response[0].radiant_win === false) {
        gameDataDota["Previous Game"] = "Lost"
    }
    else {
        gameDataDota["Previous Game"] = "Won"
    }
    console.log(gameDataDota)
    displayStats(gameDataDota)
}

function getFortnitePlayerData(playerName) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://danielpaschal.com/lfzproxies/fortniteproxy.php",
        "method": "GET",
        dataType: 'json',
        data: {
            platform: 'pc',
            player: playerName,
        },
        "headers": {
            "TRN-Api-Key": "516f26d7-878d-41f9-b03e-df2ad5a11530",
        }
    }
    $.ajax(settings).done(function (response) {

        fortniteStatsObject['Player'] = response.epicUserHandle;
        for (var index = 7; index < response.lifeTimeStats.length; index++) {
            fortniteStatsObject[response.lifeTimeStats[index].key] = response.lifeTimeStats[index].value;
        }
        displayStats(fortniteStatsObject)
        return
    });
}

function getCodPlayers(player, name) {
    var codPlayer = {
        "url": "https://my.callofduty.com/api/papi-client/crm/cod/v2/title/bo4/platform/psn/gamer/" + player + "/profile/",
        "method": "GET",
        dataType: "json"
    }
    $.ajax(codPlayer).done(function (response) {
        var stats = response.data.mp.lifetime.all;
        var average = stats.scorePerGame
        var gameWins = stats.wins;
        var gameLosses = stats.losses;
        var kdr = stats.kdRatio;
        var headshots = stats.headshots;
        var accuracy = response.data.mp.weekly.all.accuracy;
        var killstreak = stats.longestKillstreak;
        gameDataCod = {
            'Player': name,
            'Wins': gameWins,
            'Losses': gameLosses,
            'K/D': parseFloat(kdr).toFixed(1),
            'Longest Killstreak': killstreak,
            'Average Score': parseInt(average),
            'Headshots': headshots,
            'Accuracy': parseFloat(accuracy * 100).toFixed(1) + "%",
        }
        displayStats(gameDataCod);
    });
}

function renderLivePlayersOnDom() {
    recreateOnlinePlayerArrayToHaveOnlyOurGamePlayers();
    onlinePlayerArray.sort(function (a, b) { return 0.5 - Math.random() });
    for (let i = 0; i < onlinePlayerArray.length; i++) {
        if (firstPage) {
            let playerCard = $("<div>", {
                addClass: "playerCard",
                css: ({ "background-image": "url(" + onlinePlayerArray[i].thumbnail + ")" }),
                on: {
                    click: function () {
                        let streamName = onlinePlayerArray[i].displayName
                        displayVideo(streamName);
                        let gameName = onlinePlayerArray[i].game;
                        gameDataFetch(gameName, streamName);
                        $('.arrow').css('display', 'none');
                    }
                },
                appendTo: $("#livePlayers"),
            })
            let nameCard = $("<div>", {
                addClass: "nameCard",
                appendTo: playerCard
            })
            let displayName = $("<div>", {
                addClass: "name",
                text: onlinePlayerArray[i].displayName,
                appendTo: nameCard
            })
            if (onlinePlayerArray[i].game === "Call of Duty: Black Ops 4") {
                let displayGame = $("<div>", {
                    addClass: "game",
                    text: "Black Ops 4",
                    appendTo: nameCard
                })
            }
            else {
                let displayGame = $("<div>", {
                    addClass: "game",
                    text: onlinePlayerArray[i].game,
                    appendTo: nameCard
                })
            }
        } else {
            let playerCard = $("<div>", {
                addClass: "playerCard2",
                css: ({ "background-image": "url(" + onlinePlayerArray[i].thumbnail + ")" }),
                on: {
                    click: function () {
                        let streamName = onlinePlayerArray[i].displayName
                        displayVideo(streamName);
                        let gameName = onlinePlayerArray[i].game;
                        gameDataFetch(gameName, streamName)
                    }
                },
                appendTo: $("#livePlayers"),
            })

            let nameCard = $("<div>", {
                addClass: "nameCard2",
                appendTo: playerCard
            })
            let displayName = $("<div>", {
                addClass: "name",
                text: onlinePlayerArray[i].displayName,
                appendTo: nameCard
            })
            if (onlinePlayerArray[i].game === "Call of Duty: Black Ops 4") {
                let displayGame = $("<div>", {
                    addClass: "game",
                    text: "Black Ops 4",
                    appendTo: nameCard
                })
            }
            else {
                let displayGame = $("<div>", {
                    addClass: "game",
                    text: onlinePlayerArray[i].game,
                    appendTo: nameCard
                })
            }
        }
    }
}


function displayVideo(twitchName) {
    firstPage = false;
    $('.playerCard').remove();
    $('.playerCard2').remove();
    $('iframe').remove();
    $('.homeButton').remove();
    $('.loader').remove();
    $('.headerTextSecondPage').remove();
    $('.containerVid').empty();
    $('.arrow').addClass('hide');
    $('#livePlayersContainer').removeClass('livePlayersContainerFirstPage').addClass('livePlayersContainerSecondPage');
    $('#livePlayers').removeClass('livePlayersFirstPage').addClass('livePlayersSecondPage');
    $('.containerVid').removeClass('hide');
    $('.secondHeader').removeClass('hide');
    $('#footerContainer').addClass('hide');
    $('#headerContainer').addClass('hide');
    createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers, codPlayers);
    getOnlinePlayers();
    let homeButton = $('<i>', {
        class: 'homeButton fas fa-angle-left',
        appendTo: '.secondHeader',
        click: displayHome
    })
    let headerLogo = $('<div>', {
        class: 'headerTextSecondPage',
        text: 'Twitch Buddy',
        appendTo: '.secondHeader'
    })
    let loader = $('<div>', {
        class: 'loader',
        appendTo: '.containerVid'
    })
    setInterval(function () {
        loader.removeClass('loader').css('display', 'none')
    }, 3500)
    let iframeContainer = $('<div>', {
        addClass: 'embed-responsive embed-responsive-16by9 iframeContainer',
        appendTo: '.containerVid'
    })
    let createIframe = $('<iframe>', {
        addClass: 'currentVideo embed-responsive-item',
        attr: ({
            'src': `https://player.twitch.tv/?channel=${twitchName}&muted=true`,
            'frameborder': "0",
            'scrolling': "no",
            'allowfullscreen': "true",
        }),
        appendTo: $('.iframeContainer')
    })

}


function displayHome() {
    firstPage = true;
    $('.arrow').css('display', 'flex')
    $('.playerCard').remove();
    $('.playerCard2').remove();
    $('iframe').remove();
    $('#stats').remove();
    $('#livePlayers').empty();
    $('.arrow').removeClass('hide');
    $('#livePlayersContainer').removeClass('livePlayersContainerSecondPage').addClass('livePlayersContainerFirstPage');
    $('#livePlayers').removeClass('livePlayersSecondPage').addClass('livePlayersFirstPage');
    $('.containerVid').addClass('hide');
    $('.secondHeader').addClass('hide');
    $('#footerContainer').removeClass('hide');
    $('#headerContainer').removeClass('hide');
    createAllPlayersArray(dotaPlayers, bfPlayers, fortniteTopPlayers, codPlayers);
    getOnlinePlayers();
}

function displayStats(gameObj) {
    var overallStatsDiv = $('<div>').attr('id', 'stats')
    var statsModal = $('<div>').addClass('statsModal')
    for (var key in gameObj) {
        var statsCont = $('<div>').addClass('statCard');
        var statKey = $('<div>').addClass('statKey').text(key);
        var statVal = $('<div>').addClass('statValue').text(gameObj[key]);
        statsCont.append(statKey, statVal);
        overallStatsDiv.append(statsCont);
    }
    $('.containerVid').append(overallStatsDiv)
}


function gameDataFetch(game, streamName) {
    switch (game) {
        case 'Fortnite':
            for (var key in fortniteTopPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()) {
                    getFortnitePlayerData(fortniteTopPlayers[key])
                    break;
                }
            }
        case 'Dota 2':
            for (var key in dotaPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()) {
                    getDotaPlayers(dotaPlayers[key], key)
                    break;
                }
            }
        case 'Battlefield 1':
            for (var key in bfPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()) {
                    getBfPlayerData(bfPlayers[key])
                    break;

                }
            }
        case 'Call of Duty: Black Ops 4':
            for (var key in codPlayers) {
                if (key.toUpperCase() == streamName.toUpperCase()) {
                    getCodPlayers(codPlayers[key], key)
                    break;
                }
            }
    }
}



