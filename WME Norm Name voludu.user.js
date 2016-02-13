
// ==UserScript==
// @name         WME Norm Name voludu
// @namespace    https://greasyfork.org/users/5252
// @version      0.3.3.2
// @description  Standardize street names according to local and national convention
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/*
// @author       sketch,bgodette
// @copyright    2015 sketch,bgodette
// @grant        none
// ==/UserScript==
// After testing the popup, change line 109.  It now says "if (true) in order to show the popup on every load. -- Voludu

function bootstrapNormName(){
    var bGreasemonkeyServiceDefined = false;
    
    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
    }
    catch (err) { /* Ignore */ }
    
    if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    
    setTimeout(initNormName, 1000);
}
/*
function checkJqueryUI() {
// If this is to be done, it must (?) be done with unsafewindow rather than with window?      
    if (typeof jQuery.ui != 'undefined') {
        console.log ("WME Norm Name: JQueryUI loaded");
    }
    else {
        console.log ("WME Norm Name: waiting for JQueryUI");
        setTimeout( checkJqueryUI, 50 );
    }
}
*/  

function initNormNotice(){
    var panelHeight=350, panelWidth=540;

    $("<style>")
    .prop("type", "text/css")
    .html('.NormPG { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);' +
          '          width: ' + panelWidth + 'px; ' + //height: ' +    // + panelHeight + 'px; ' 
          '          padding: 10px; margin: 0; overflow-y: auto; overflow-x: auto; word-wrap: break-word;' +
          '          background-color: white; box-shadow: 0px 5px 20px #555555;' +
          '          border: 1px solid #858585; border-radius: 10px; }\n' +        
          ".NormPG h2  { margin-top:10px; margin-bottom: 10px; font-size: 20pt; font-weight: bold; text-align: left; color: #C0C0C0 }\n" +
          '.NormPG-hr  { display: block; border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1);' +
          '             border-bottom: 1pxi solid rgba(255, 255, 255, 0.3);' +
          '             margin-top: 8px; margin-bottom: 12px; }\n' +
          '.NormPG-btn-container {position: relative; width: 70px; display: block; left: 148px; bottom: 0px; margin: 10px; vertical-align: middle; padding: 0}\n' +
          '.NormPG-btn { margin: 0px 5px 0px; padding: 0px 15px; display: inline-block; height: 32px; }\n'
    )
    .appendTo("head");
    
    
    var NormNoticeDiv= '<div id="NormNoticePanel" class="NormPG" >' + 
        '<h2>Name Norm</h2>' + 
        '<div id="NormNotice">Test</div>' +
        '<div class="NormPG-btn-container">' +
                '       <button id="btnNormOK" class="btn btn-default NormPG-btn">OK</button></div>' +
        "</div>";
    ($('#map').append(NormNoticeDiv));
    
    $('#NormNoticePanel').hide();
    
    $('#btnNormOK').click (function() {
                $('#NormNoticePanel').hide();
            });
}

function NormNotice(NormNoticeText){
    $("#NormNotice").html(NormNoticeText);
    $("#NormNoticePanel").show();

}    

function initNormName(){    
   	//Alert on update
	var updateAlert = true;
	var normVersion = "0.3.3.2";
	var normChanges = ` 
<p>Hey. It's Norm. I'm new today. Version " + normVersion + ".</p> 
<p style=\"color: red;\">Always open the console (F12) and check every single change I make BEFORE you save. 
I'm only as good as my regexps, and I've been known to make serious mistakes, especially when segment names are mangled in unexpected ways.</p> 
<p>Check out all my cool new stuff. <ul> 
   <li>0.3.3 changes:<ul> 
       <li>National:<ul> 
            <li>Brg -> Br (Bridge)</li> 
            <li>cardinal directions 'E' -> E.</li> 
       </ul></li> 
       <li>New states: West Virginia</li> 
       <li>New changes: Ohio</li> 
       <li>Bugs fixed: New York</li> 
    </ul></li> 
    <li>0.3.3.1: Wisconsin restored with tweaks. Ooops</li> 
    <li>0.3.3.2: Somehow I got lost in New Jersey and thought I was also in North Carolina. Fixed it. Sorry!</li> 
</ul></p>`;
    
    
    if (updateAlert && ('undefined' === localStorage.normVersion || normVersion !== localStorage.normVersion)) {
        initNormNotice();
        NormNotice(normChanges);
    	localStorage.normVersion = normVersion;
    }

    //Get stored keyboard shortcut
    if (localStorage.NormName) {
		var nnShortcut = JSON.parse(localStorage.NormName);
	}
    else{
        var nnShortcut = '';
    }
    //Save keyboard shortcut
    function saveNNShortcut(){
        nnShortcut = Waze.accelerators.Actions.normName.shortcut.keyCode;
        localStorage.NormName = JSON.stringify(nnShortcut);
    }
    window.addEventListener("beforeunload", saveNNShortcut, false);
	
    //Only allow if rank 4 or higher
    var rankCheck = Waze.loginManager.user.normalizedLevel;
    if(rankCheck >= 4){
        //Add icon to toolbar
        $('<div class="NormNameIcon">').appendTo($('#edit-buttons'));
        $('#edit-buttons')[0].style.width = ($('#edit-buttons')[0].offsetWidth+60)+'px';
        $('.NormNameIcon').css({
            'height':'60px',
            'width':'57px',
            'float':'right',
            'background':'url("data:image/png;base64,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") no-repeat',
            'background-position':'center center'
        });

        //Hover event
        $('.NormNameIcon').hover(
            function(){
                $(this).css({"background-color": "#d4e7ed"});
                var xPos=this.getBoundingClientRect().left;
                xPos-=$("#sidebar")[0].getBoundingClientRect().right-$("#sidebar")[0].getBoundingClientRect().left;
            },
            function(){
                $(this).css({"background-color": "transparent"});
            }
        );

        //Click event
        $('.NormNameIcon').click(function(){mainNormName();});

        //Keyboard shortcut
        addKeyboardShortcutToEditor(nnShortcut);
    }
}

function addKeyboardShortcutToEditor(nnShortcut){
    Waze.accelerators.Groups['normname']=[];
    Waze.accelerators.Groups['normname'].members=[];
    I18n.translations.en.keyboard_shortcuts.groups['normname'] = [];
    I18n.translations.en.keyboard_shortcuts.groups['normname'].description = 'Norm Name';
    I18n.translations.en.keyboard_shortcuts.groups['normname'].members = [];
    I18n.translations.en.keyboard_shortcuts.groups.normname.members['normName'] = 'Normalize street names';
    Waze.accelerators.addAction('normName', {group: 'normname'});
    Waze.accelerators.events.register('normName', null, mainNormName);
    Waze.accelerators.registerShortcuts({nnShortcut: "normName"}); 	
}

function mainNormName(){
  var UpdateObject, AddOrGetCity, AddOrGetStreet;
	if (typeof(require) !== "undefined") {
		UpdateObject = require("Waze/Action/UpdateObject");
		AddOrGetCity = require("Waze/Action/AddOrGetCity");
		AddOrGetStreet = require("Waze/Action/AddOrGetStreet");
	} else {
		UpdateObject = Waze.Action.UpdateObject;
		AddOrGetCity = Waze.Action.AddOrGetCity;
		AddOrGetStreet = Waze.Action.AddOrGetStreet;
	}
  function to_decimal(name) {
    var newname = name;
    var newnum = newname.match(/^(([NSEW] )?I|US|SR|SH|CR)-\d+ \d+\s?\/\s?\d+/);
    if (newnum) {
      var orig = newnum[0];
      var deci = orig.split("-");
      var repl = deci[0] + "-";
      deci = deci[1].split(" ");
      if (deci.length == 2) {
        bits = deci[1].split("/");
      } else {
        bits = [deci[1], deci[3]];
      }
      deci = deci[0];
      var numer = parseInt(bits[0],10);
      var denom = parseInt(bits[1],10);
      if (denom !== 0) {
        numer = numer + (denom * deci);
        var frac = numer / denom;
        repl = repl.concat(frac);
        newname = newname.replace(orig, repl);
      }
    }
    return (newname);
  }
  
  function state_transforms(name, state) {
    var newname = name;
    switch(state) {
      case "Alabama":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /i, "CR-");
        newname = newname.replace(/\b(State|Al(abama?)) H(igh)?wa?y /i, "SR-");
        newname = newname.replace(/\bState R(ou)?te /i, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bAL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bAL (\d+)/ig, "SR-$1");
      	break;
      case "Colorado":
        newname = newname.replace(/^Alley$/, "");
        newname = newname.replace(/^([NSEW] )?Rd /i, "$1CR-");
        newname = newname.replace(/^([NSEW] )?C ?R ?(\d+)/i, "$1CR-$2");
        newname = newname.replace(/^([NSEW] )?Co Rd /i, "$1CR-");
        newname = newname.replace(/^([NSEW] )?Cty Rd /i, "$1CR-");
        newname = newname.replace(/^(\w+) Co Rd (\d+)/i, "$1 CR-$2");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/^Co Hwy /i, "CR-");
        newname = newname.replace(/^([NSEW] )?Hwy /i, "$1SH-");
        newname = newname.replace(/State Hwy /i, "SH-");
        newname = newname.replace(/State Rte /i, "SH-");
        newname = newname.replace(/State Route /i, "SH-");
        newname = newname.replace(/(^|\s)S[RH]-\s?(\d+)/ig, "$1SH-$2");
        /* convert fractional notation to decimal notation */
        newname = to_decimal(newname);
        break;
      case "Florida":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /i, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /i, "SR-");
        newname = newname.replace(/\bState R(ou)?te /i, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bFL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bFL (\d+)/ig, "SR-$1");
      	break;
      case "Georgia":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /i, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /i, "SR-");
        newname = newname.replace(/\bState R(ou)?te /i, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bGA-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bGA (\d+)/ig, "SR-$1");
      	break;
      case "Illinois":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /i, "CR-");
        newname = newname.replace(/\bCty H(igh)?wa?y /i, "CR-");
        newname = newname.replace(/\bCounty (\d+)/i, "CR-($1)");
        newname = newname.replace(/CTH-/, "CR-");
        newname = newname.replace(/\bState H(igh)?wa?y /i, "SR-");
        newname = newname.replace(/\bState R(ou)?te /i, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bIL-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bIL (\d+)/ig, "SR-$1");
      	break;
      case "Indiana":
      	newname = newname.replace(/In(diana)? H(igh)?wa?y /i, "IN-");
        newname = newname.replace(/State H(igh)?wa?y /i, "IN-");
        newname = newname.replace(/State R(ou)?te /i, "IN-");
        newname = newname.replace(/State R(oa)?d /i, "IN-");
        newname = newname.replace(/State Spur (\d+)/i, "IN-$1 SPUR");
        newname = newname.replace(/^S[HR](-\d+)/, "IN$1");
        newname = newname.replace(/(\s|^)IN-\s?(\d+)/ig, "$1IN-$2");
        newname = newname.replace(/(\s|^)IN (\d+)/ig, "$1IN-$2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /i, "CH-");
        newname = newname.replace(/\bCounty (\d+)/i, "CH-($1)");
      	newname = newname.replace(/\bI-164\b/, "I-69");
      	break;
      case "Kansas":
        newname = newname.replace(/\bState H(igh)?wa?y /i, "K-");
        newname = newname.replace(/\bState R(ou)?te /i, "K-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1K-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1K-$2");
        break;
      case "Louisiana":
        newname = newname.replace(/^([NSEW] )?Co Rd /i, "$1Parish Rd ");
        newname = newname.replace(/L(ouisian)?a H(igh)?wa?y /i, "LA-");
        newname = newname.replace(/\bState H(igh)?wa?y /i, "LA-");
        newname = newname.replace(/\bState R(ou)?te /i, "LA-");
        newname = newname.replace(/State Spur (\d+)/i, "LA-$1 SPUR");
        newname = newname.replace(/Hwy (\d+(\-\d)?) Spu?r/i, "LA-$1 SPUR");
        newname = newname.replace(/^S[HR](-\d+)/, "LA$1");
        newname = newname.replace(/(\s|^)LA-\s?(\d+)/ig, "$1LA-$2");
        newname = newname.replace(/(\s|^)LA (\d+)/ig, "$1LA-$2");
        newname = newname.replace(/\bLA-(71|79|80|167)\b/ig, "US-$1");
        newname = newname.replace(/\bHwy (11|51|61|65|71|79|80|84|90|165|167|171|190|371|425)\b/ig, "US-$1");
        newname = newname.replace(/\bHwy (?!63)(\d\d)\b/ig, "LA-$1");
        newname = newname.replace(/\bHwy (\d{3,4})\b/ig, "LA-$1");
        newname = newname.replace(/\bU(\s|-)turn/i, "U turn");
        newname = newname.replace(/\bExpy\b/i, "Expwy");
        newname = newname.replace(/((^|(\/|[NEWS]|Rue|Place)\s))St.\s/, '$1Saint ');
        newname = newname.replace(/\bBrg\b/, 'Br');
        break;
      case "Michigan":
        newname = newname.replace(/^([NSEW] )?Co Rd /i, "$1CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/^Co Hwy /i, "CR-"); 
        newname = newname.replace(/State Hwy /i, "M-");
        newname = newname.replace(/State Rte /i, "M-");
        newname = newname.replace(/State Route /i, "M-");
        newname = newname.replace(/^S[HR](-\d+)/, "M$1");
        newname = newname.replace(/(\s)M-\s?(\d+)/ig, "$1M-$2");
        break;
      case "Mississippi":
        newname = newname.replace(/^([NSEW] )?Co Rd /i, "$1CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/^Co Hwy /i, "CR-");
        newname = newname.replace(/State Hwy /i, "MS-");
        newname = newname.replace(/State Rte /i, "MS-");
        newname = newname.replace(/State Route /i, "MS-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/g, "$1MS-$2");
        newname = newname.replace(/(\s|^)MS-\s?(\d+)/ig, "$1MS-$2");
        newname = newname.replace(/(\s|^)MS (\d+)/ig, "$1MS-$2");
        break;
      case "New York":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te?) /i, "CR-");
        newname = newname.replace(/NY (Hwy|Ro?u?te?) /i, "NY-");
        newname = newname.replace(/State Hwy /ig, "NY-");
        newname = newname.replace(/State Rte? /ig, "NY-");
        newname = newname.replace(/State Route /ig, "NY-");
        newname = newname.replace(/State Spur (\d+)/ig, "NY-$1 SPUR");
        newname = newname.replace(/\bS[HR](-\d+)/ig, "NY$1");
        newname = newname.replace(/(\s|^)NY-\s?(\d+)/ig, "$1NY-$2");
        newname = newname.replace(/(\s|^)NY (\d+)/ig, "$1NY-$2");
        newname = newname.replace(/\bEx(p|w)y\b/ig, "Expwy");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(1|4|6|9W?|11|20|44|62|202|209|219|220|20A|62 BUS)\b/ig, "US-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(?!2)(\d)\b/ig, "NY-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(?!15)(\d\d)\b/ig, "NY-$2");
        newname = newname.replace(/\b(Ro?u?te |RT-|RT )(\d{3})\b/ig, "NY-$2");
        newname = newname.replace(/\bTunl\b/ig, "Tun");
        newname = newname.replace(/\bLong Is\b/ig, "Long Island");
        break;
      case "New Jersey":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /i, "CR-");
        newname = newname.replace(/\bState Hwy /i, "SR-");
        newname = newname.replace(/\bState Rte /i, "SR-");	
        newname = newname.replace(/\bState Route /i, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bNJ-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bNJ (\d+)/ig, "SR-$1");
        break;
      case "North Carolina":
        newname = newname.replace(/\bState H(igh)?wa?y /i, "NC-");
        newname = newname.replace(/\bState R(ou)?te /i, "NC-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1NC-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1NC-$2");
        break;
      case "Ohio":
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/^Rcr /i, "CR-");
        newname = newname.replace(/\bCo(unty)? H(igh)?wa?y /i, "CH-");
        newname = newname.replace(/\b(Twp|Township) R((oa)?d|(ou)?te) /i, "TR-");
        newname = newname.replace(/\bTo?w(nshi)?p H(igh)?wa?y /i, "TH-");
        newname = newname.replace(/\bC-?(\d)/i, "CR-$1");
        newname = newname.replace(/\bT-?(\d)/i, "TR-$1");
        newname = newname.replace(/\bState Hwy /i, "SR-");
        newname = newname.replace(/\bState Rte /i, "SR-");	
        newname = newname.replace(/\bState Route /i, "SR-");
        newname = newname.replace(/\bS[HR]-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bS[HR] (\d+)/ig, "SR-$1");
        newname = newname.replace(/\bOH-\s?(\d+)/ig, "SR-$1");
        newname = newname.replace(/\bOH (\d+)/ig, "SR-$1");
        break;
      case "Pennsylvania":
        newname = newname.replace(/State Hwy /i, "SR-");
        newname = newname.replace(/State Rte /i, "SR-");
        newname = newname.replace(/(PA|State) Route /i, "SR-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SR-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SR-$2");
        newname = newname.replace(/^.*?P(ENN(SYLVANI)?)?A\sTPK(E)?/ig, "Penna. Tpk");
        newname = newname.replace(/PENNA\sTPK(E)?/ig, "Penna. Tpk");
        break;
      case "South Carolina":
        newname = newname.replace(/\bState H(igh)?wa?y /i, "SC-");
        newname = newname.replace(/\bState R(ou)?te /i, "SC-");
        newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SC-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SC-$2");
		newname = newname.replace(/.+(S-\d\d?-\d+)/i, "$1");
        break;
      case "Texas":
      	newname = newname.replace(/State Hwy /i, "SH-");
      	newname = newname.replace(/State Rte /i, "SH-");
      	newname = newname.replace(/State Route /i, "SH-");
      	newname = newname.replace(/State Highway /i, "SH-");
      	newname = newname.replace(/(\s|^)S[HR]-\s?(\d+)/ig, "$1SH-$2");
        newname = newname.replace(/(\s|^)S[HR] (\d+)/ig, "$1SH-$2");
        newname = newname.replace(/\bFarm(\s|-)to(\s|-)market\b/i, "FM");
        newname = newname.replace(/^Farm R(oa)?d (\d{2,}\b)/i, "FM $2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CR-");
        newname = newname.replace(/\b([NS][EW])CR\s?(\d{2,4})\b/i, "$1 CR-$2");
        newname = newname.replace(/\b([NS][EW])\s?(\d{4})\b/i, "$1 CR-$2");
        newname = newname.replace(/\b(CR-\d+) Rd\b/i, "$1");
        newname = newname.replace(/\b([NS])E CR-\b/i, "$1E CR-");
        newname = newname.replace(/\b([NS])W CR-\b/i, "$1W CR-");
        newname = newname.replace(/^Pvt Rd (\d{2,})\b/i, "Private Rd $1");
        newname = newname.replace(/^Pr (\d{2,})\b/i, "Private Rd $1");
        newname = newname.replace(/U(\s|-)turn/i, "Turnaround");
        break;
      case "West Virginia":
        newname = newname.replace(/\bW(est)? ?V(irginia)? H(igh)?wa?y /ig, "WV-");
        newname = newname.replace(/\bState H(igh)?wa?y /ig, "WV-");
        newname = newname.replace(/\bState R(ou)?te /ig, "WV-");
        newname = newname.replace(/\bS[HR]- ?(\d+)/ig, "WV-$1");
        newname = newname.replace(/\bS[HR] (\d+)/g, "WV-$1");
        newname = newname.replace(/\bWV-\s?(\d+)/ig, "WV-$1");
        newname = newname.replace(/\bWV (\d+)/ig, "WV-$1");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /ig, "CR-");
        newname = newname.replace(/\bCo(unty)? (Trunk )?(H(igh)?wa?y )?(\d{1,3}\b)/ig, "CR-$5");
        newname = newname.replace(/\bCounty (\d+)/ig, "CR-$1");
        newname = newname.replace(/\bCTH-/ig, "CR-");
        newname = newname.replace(/\bCH-/ig, "CR-");
        newname = newname.replace(/ \(ALT\)( |$)/ig, " ALT$1");
        newname = newname.replace(/\bCR-(\d{1,3}) \/ (\d{1,2})\b/ig, "CR-$1/$2");
        break;
      case "Wisconsin":
      	newname = newname.replace(/Wis?(consin)? Hwy /i, "WIS-");
        newname = newname.replace(/State Hwy /i, "WIS-");
        newname = newname.replace(/State Rte /i, "WIS-");
        newname = newname.replace(/State Route /i, "WIS-");
        newname = newname.replace(/State Spur (\d+)/i, "WIS-$1 SPUR");
        newname = newname.replace(/^S[HR](-\d+)/, "WIS$1");
        newname = newname.replace(/(\s|^)WIS?-\s?(\d+)/ig, "$1WIS-$2");
        newname = newname.replace(/(\s|^)WIS? (\d+)/ig, "$1WIS-$2");
        newname = newname.replace(/\bCo(unty)? R((oa)?d|(ou)?te) /i, "CH-");
        newname = newname.replace(/\bCo(unty)? (Trunk )?(H(igh)?wa?y )?([A-Z]{1,3}\b)/i, "CH-$5");
        newname = newname.replace(/\bCounty (\d+)/i, "CH-($1)");
        newname = newname.replace(/CTH-/, "CH-");
        newname = newname.replace(/CR-/, "CH-");
      	break;
    }
    return(newname);
  }

  function transform_name(street, city) {
    var newname = street.name;
    /* remove leading/trailing whitespace */
    newname = newname.replace(/^(.*)\s+$/, "$1");
    newname = newname.replace(/^\s+(.*)$/, "$1");

    /* convert two or more whitespaces into a single ' ' */
    newname = newname.replace(/\s{2,}/g, ' ');

    /* replace ',' with '/', adding any necessary spaces around it is done later */
    newname = newname.replace(/,/g, "/");
    
    /* make sure there's spaces around '/' */
    newname = newname.replace(/(.)\s?\/\s?(.)/g, "$1 / $2");

    /* fix fractions - hamfisted second attempt */
    newname = newname.replace(/(\s\d) \/ (\d{1,2}\s)/g, "$1/$2");
    
    /* fix runways */
    newname = newname.replace(/\b((0?[1-9]|[1-2][0-9]|3[0-6])[LCR]?)\s\/\s((0?[1-9]|[1-2][0-9]|3[0-6])[LCR]?)\b/i, "$1/$3");
    
    newname = newname.replace(/^To:? /i, "to ");
    newname = newname.replace(/ To /, " to ");
    newname = newname.replace(/^US Hwy Fs Rd /i, "FS-");
    newname = newname.replace(/^U S F S Rd /i, "FS-");
    newname = newname.replace(/^US-Fs Rd /i, "FS-");
    newname = newname.replace(/^USFS Rd /i, "FS-");
    newname = newname.replace(/^Fs? Rd? /i, "FS-");
    newname = newname.replace(/^F[sr] (\d)/i, "FS-$1");
    newname = newname.replace(/^F S /i, "FS-");

    /* convert Interstate and US Highway formats anywhere in the name to short-form */
    newname = newname.replace(/(^| )US Highway /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy Route /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy Rte /ig, "$1US-");
    newname = newname.replace(/(^| )US Hwy /ig, "$1US-");
    newname = newname.replace(/(^| )US Rte /ig, "$1US-");
    newname = newname.replace(/(^| )US Route /ig, "$1US-");
    newname = newname.replace(/(^| )US-\s?/ig, "$1US-");
    newname = newname.replace(/(^| )US\s?(\d+)/ig, "$1US-$2");
    newname = newname.replace(/US-9\s+([EW])/ig, "US-9$1");
    newname = newname.replace(/US-\d+\s?[NSEW]/ig, function(v) { return v.toUpperCase(); });
    
    newname = newname.replace(/(^| )I-\s?/ig, "$1I-");
    newname = newname.replace(/(^| )I\s?(\d+)/g, "$1I-$2");

    newname = newname.replace(/(^| )SR-\s?/ig, "$1SR-");
    newname = newname.replace(/(^| )SR\s?(\d+)/ig, "$1SR-$2");
    newname = newname.replace(/(^| )SH-\s?/ig, "$1SH-");
    newname = newname.replace(/(^| )SH\s?(\d+)/ig, "$1SH-$2");
    newname = newname.replace(/(^| )CR-\s?/ig, "$1CR-");
    newname = newname.replace(/(^| )CR\s?(\d+)/ig, "$1CR-$2");
    
    newname = newname.replace(/(\d+\w? ([NSEW] )?)(Busn?|BL|BS|Business)\b/ig, "$1BUS");
    newname = newname.replace(/(\d+\w? ([NSEW] )?)BUS\.? (Loop|Lp|Spur)\b/ig, "$1BUS");
    /* \d matches '.' so the above replace doesn't consume '.' after BUS, so consume it here */
    newname = newname.replace(/\bBUS\./g, "BUS");
    
    /* bannered routes */
    newname = newname.replace(/(\d+\s)Spu?r\b/i, "$1SPUR");
    newname = newname.replace(/(\d+\s)Alt\b/i, "$1ALT");
    newname = newname.replace(/(\d+\s)By-?p(ass)?\b/i, "$1BYP");
    newname = newname.replace(/(\d+\s)Conn(ector)?\b/i, "$1CONN");
    newname = newname.replace(/(\d+\s)Tru?c?k\b/i, "$1TRUCK");

    /* new unnumbered exit standard */
    newname = newname.replace(/^Exit:? to:?/i, "to");
    newname = newname.replace(/^Exit: /i, "to ");
    newname = newname.replace(/^Exit/i, "Exit");

    /* convert all ':' after the first ':' to a ' / ' */
    newname = newname.replace(/^([^:]+:)([^:]+):/g, "$1$2 /");
    newname = newname.replace(/^((?!Exit[^:]+))([^:]+):/g, "$1$2 /");
    newname = newname.replace(/^(to [^:]+):(.*)$/i, "$1 /$2"); /* redundant? */

    newname = newname.replace(/^(Exit \d+[\w\-]*)( \/ | \- | )/i, "$1: ");
    newname = newname.replace(/^Exit (\w+ )/i, "to $1");
    
    /* saint */
    newname = newname.replace(/((^|(\/|[NEWS]|Rue|Place)\s))St\s/, '$1St. ');
/*    newname = newname.replace(/\bSaint\b/, 'St.'); */

	/* bridge */
	newname = newname.replace(/\bBrg\b/, "Br");
    
    /* bye bye nasty old 'N' 'S' 'E' 'W' format */
    newname = newname.replace(/( |^)'([NSEW])'( |$)/g, '$1$2.$3');

    /* State specific name transformations */
    var state = W.model.states.get(city.stateID);
    newname = state_transforms(newname, state.name);
    
    return(newname);
  }

  function remove_city(v, name, city)
  {
    var newcity = city.getID();
    var state = W.model.states.get(city.stateID);
    if (state.name.match(/^(Colorado|Illinois|Indiana|Michigan|Ohio|Wisconsin)$/)) { /* states that remove city name from Fway */
      if (name.match(/^I-\d+ [NSEW]$/) || v.attributes.roadType == 18) { /* Interstates and Railroads */
        var oldcity = W.model.cities.get(strt.cityID);
        var oldstate = W.model.states.get(oldcity.stateID);
        var oldcnt = W.model.countries.get(oldcity.countryID);
        newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.stateID, countryID: oldcity.countryID});
        if (!newobj[0]) {
          var t = W.model.states.get(oldcity.stateID);
          var e = W.model.countries.get(oldcity.countryID);
          W.model.actionManager.add(new AddOrGetCity(t, e, "", true));
          newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.stateID, countryID: oldcity.countryID});
        }
        if (newobj[0]) {
          newcity = newobj[0].id;
          oldstate = W.model.states.get(newobj[0].stateID);
          oldcnt = W.model.countries.get(newobj[0].countryID);
        }
       /* if (v.attributes.roadType == 18 && (v.attributes.lockRank < 1 || v.attributes.fwdDirection === false || v.attributes.revDirection === false)) {
          W.model.actionManager.add(new UpdateObject(v, {lockRank: 1, fwdDirection: true, revDirection: true}));
        } */
      }
    }
    else if (state.name.match(/^(Louisiana|Mississippi|Kansas|Pennsylvania|New York)$/)) /* states that don't remove city name from Fway */
    {
      if (v.attributes.roadType == 18) { /* Railroads */
        var oldcity = W.model.cities.get(strt.cityID);
        var oldstate = W.model.states.get(oldcity.stateID);
        var oldcnt = W.model.countries.get(oldcity.countryID);
        newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.stateID, countryID: oldcity.countryID});
        if (!newobj[0]) {
          var t = W.model.states.get(oldcity.stateID);
          var e = W.model.countries.get(oldcity.countryID);
          W.model.actionManager.add(new AddOrGetCity(t, e, "", true));
          newobj = W.model.cities.getByAttributes({isEmpty: true, stateID: oldcity.stateID, countryID: oldcity.countryID});
        }
        if (newobj[0]) {
          newcity = newobj[0].id;
          oldstate = W.model.states.get(newobj[0].stateID);
          oldcnt = W.model.countries.get(newobj[0].countryID);
        }
      /*  if (v.attributes.roadType == 18 && (v.attributes.lockRank < 1 || v.attributes.fwdDirection === false || v.attributes.revDirection === false)) {
          W.model.actionManager.add(new UpdateObject(v, {lockRank: 1, fwdDirection: true, revDirection: true}));
        } */
      }
    }
    return(newcity);
  }

  function get_new_sid(newname, newcity)
  {
    if (newname === "" || newname === null) {
      newobj = W.model.streets.getByAttributes({isEmpty: true, cityID: newcity});
    } else {
      newobj = W.model.streets.getByAttributes({isEmpty: false, cityID: newcity, name: newname});
    }
    if (!newobj[0]) {
      if (newname === "" || newname === null) {
        W.model.actionManager.add(new AddOrGetStreet(newname, W.model.cities.get(newcity), true));
        newobj = W.model.streets.getByAttributes({isEmpty: true, cityID: newcity, name: newname});
      } else {
        W.model.actionManager.add(new AddOrGetStreet(newname, W.model.cities.get(newcity), false));
        newobj = W.model.streets.getByAttributes({isEmpty: false, cityID: newcity, name: newname});
      }
      if (newobj[0]) {
        return(newobj[0].id);
      }
    } else {
      return(newobj[0].id);
    }
  }
  
  function onScreen(obj) {
    if (obj.geometry) {
      return(W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
    }
    return(false);
  }
  
  var primary_hn_count = 0;
  
  Object.forEach(W.model.segments.objects, function(k, v) {
    if (v.attributes.junctionID === null && onScreen(v) && v.isGeometryEditable()) {
      if (v.attributes.primaryStreetID) {
        strt = W.model.streets.get(v.attributes.primaryStreetID);
        if (strt) {
          var newname = strt.name;
          var newcity = strt.cityID;
          var city = W.model.cities.get(strt.cityID);
          if (strt.name && (primary_hn_count < 3 || v.attributes.hasHNs === false) && !strt.name.match(/http:\/\//i)) {
            /* don't change names on railroads and runways */
            if (v.attributes.roadType != 18 && v.attributes.roadType != 19) {
              newname = transform_name(strt, city);
            }
            newcity = remove_city(v, newname, city);
          }
          var newcname = W.model.cities.get(newcity);
          if (newname != strt.name || newcity != strt.cityID) {
            console.log("sid: " + v.getID() + " Pri: old: " + strt.name + ", " + city.name + " new: " + newname + ", " + newcname.name);
            var newid = get_new_sid(newname, newcity);
            W.model.actionManager.add(new UpdateObject(v, {primaryStreetID: newid, separator: false}));
            if (v.attributes.hasHNs) {
              primary_hn_count++;
              if (primary_hn_count == 3) {
                console.log("Changed the primary street name on 3 segments with house numbers, not changing more, consider saving now.")
              }
            }
          }
        }
      }
      if (v.attributes.streetIDs) {
        var i;
        var newsid = [];
        var updated = false;
        for (i = 0; i < v.attributes.streetIDs.length; i++) {
          strt = W.model.streets.get(v.attributes.streetIDs[i]);
          if (strt) {
            var newname = strt.name;
            var newcity = strt.cityID;
            var city = W.model.cities.get(strt.cityID);
            if (strt.name && !strt.name.match(/http:\/\//i)) {
              /* don't change names on railroads and runways */
              if (v.attributes.roadType != 18 && v.attributes.roadType != 19) {
                newname = transform_name(strt, city);
              }
              newcity = remove_city(v, newname, city);
            }
            var newcname = W.model.cities.get(newcity);
            if (newname != strt.name || newcity != strt.cityID) {
              console.log("sid: " + v.getID() + " Alt[" + i + "] old: " + strt.name + ", " + city.name + " new: " + newname + ", " + newcname.name);
              updated = true;
              newsid.push(get_new_sid(newname, newcity));
            } else {
              newsid.push(strt.id);
            }
          }
        }
        if (updated) {
          W.model.actionManager.add(new UpdateObject(v, {streetIDs: newsid, separator: false}));
        }
      }
    }
  });
}

bootstrapNormName();
WME Norm Name voludu.user.js
Open with
Patti TaterTot 
(thelasttatertot.waze@gmail.com)Displaying WME Norm Name voludu.user.js.
