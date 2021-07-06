var queue = new Array();
var main_tab;

// Function to get tabid based on current tab

function get_tabid(){
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  tabid = tabs[0].id;
  console.log("tab id is == ", tabid);
  main_tab =  tabid;
}); }

//Adds url to queue and get the tab id of current tab.

function add_to_queue(url){


  /*chrome.runtime.sendMessage({url: url}, function(response) {
      if(response.send != "ack"){
        console.log('internal error !!');
        return -1;
      }
      console.log("ack");
  });*/

  if(queue.length == 0 ){
    get_tabid(url);
    current_id = 0;
  }
  queue.push(url);
  get_info_from_page();
  //console.log(queue);

   //need to fix xss
   document.getElementById('playlist').innerHTML += '<li> <a href=' + url + '>'  +  url + ' </a> </li>';

}

function get_info_from_page(){
  if(typeof main_tab !== "undefined"){
    
    chrome.scripting.executeScript({
      target: { tabId: main_tab },
      files: ['contentscript.js']
    });
    
}
else{
    setTimeout(get_info_from_page, 250);
}
  
}

// Handler when link is clicked

function click_handler_add() {
  var url = document.getElementById('url').value;
  var res = url;

/* String matching function needs to be added */
 // var res = url.match(/aa/i);  
  if(res == null){
    return;
  }
  console.log(res);
  add_to_queue(res);
 /* var temp = "\"click_handle_list('"+res+"');\"";
  console.log('<li> <a href=' + res + ' onClick='+ temp + '>'  + 'afda </a> </li>');*/

 
 
}

async function click_handle_list(e){
  
    chrome.tabs.update(main_tab,{url:e.target.href});
    console.log(e.target.href);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log("back : from the extension");
    if(request.msg == "title"){
      console.log(request.title);
      console.log(request.playback_time);
    }

  sendResponse({send: "ack"});
  
});

//handlers

document.addEventListener("DOMContentLoaded", function () {
document.getElementById("submit").onclick = click_handler_add;
document.getElementById("playlist").onclick = click_handle_list;

});

const CONTEXT_MENU_ID = "quickplay";
function getword(info,tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  console.log(info);
  console.log("Word " + info.linkUrl + " was clicked.");
  add_to_queue(info.linkUrl);
}

chrome.contextMenus.onClicked.addListener(getword);

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    title: "Search abla ka dabla", 
    contexts:["link"], 
    id : CONTEXT_MENU_ID
  });
});
