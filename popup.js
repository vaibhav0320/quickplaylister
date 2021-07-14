var queue = new Array();
var lastid = 0;

load_from_storage();

function load_from_storage(){
   
  chrome.runtime.sendMessage({cmd: 'get'}, function(response) {
    var temp_queue = response.farewell;
    console.log(temp_queue);
    if(typeof temp_queue !== 'undefined' && typeof temp_queue !== null){
      queue = temp_queue;
      /*queue.forEach((url)=>{
       get_title(url);
        
      });*/
      for(var key in queue){
        get_title(key,queue[key]);
      }
    }
    });
    
  
}

function get_title(url,vidtitle){
  /*fetch("https://www.youtube.com/oembed?url="+url+"&format=json").then(r => r.text()).then(result => {
    var vidtitle;
    try{
      var resp = JSON.parse(result);
      vidtitle = resp.title;
      console.log(resp.title);
    }
    catch{
      vidtitle = url;
    }*/
   
    //document.getElementById('playlist').innerHTML += '<li> <a href=' + url + '>'  + vidtitle + ' </a> </li>';
    var list = document.getElementById('playlist');
    
    var entry = document.createElement('li');
    var hreftag = document.createElement('a');
    hreftag.appendChild(document.createTextNode(vidtitle));
    hreftag.title= vidtitle;
    hreftag.href = url;
    entry.appendChild(hreftag);
    entry.setAttribute('id','item'+lastid);
    var removeButton = document.createElement('button');
    removeButton.appendChild(document.createTextNode("remove"));
    removeButton.setAttribute('id','button'+lastid);  
    entry.appendChild(removeButton);
    lastid+=1;
    list.appendChild(entry);

}


// Function to get tabid based on current tab

function get_tabid(){
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  tabid = tabs[0].id;
  console.log("tab id is == ", tabid);
  main_tab =  tabid;
}); }


function send_tabinfo(tab){
  chrome.runtime.sendMessage({cmd: 'tab_info', tab:tab},function(response){});
}

async function click_handle_list(e){

 /* chrome.runtime.getBackgroundPage(function (bg) {
    var main_tab = bg.main_tab;
    console.log(main_tab);
    if(main_tab === 'undefined'){
      chrome.tabs.create({url:e.target.href});
    }
    else{
    chrome.tabs.update(main_tab,{url:e.target.href});}
  });*/
  chrome.runtime.sendMessage({cmd: 'get_tabid'}, function(response) {
     main_tab = response.tabid;
     console.log("maintab= "+main_tab);
     console.log(main_tab == undefined);
     if(main_tab == undefined){
      newtab=chrome.tabs.create({url:e.target.href},send_tabinfo);
    }
    else{

      function maintab_check(){

        if (chrome.runtime.lastError) {
          newtab = chrome.tabs.create({url:e.target.href},send_tabinfo);
          //console.log(newtab);
        } 
        else{
        chrome.tabs.update(main_tab,{url:e.target.href});
        }
      }

      chrome.tabs.get(main_tab,maintab_check);
    }

  });
    
    //console.log(e.target.href);
}



function click_handle_delete_all(){ // Add something to remove links from html 
    chrome.runtime.sendMessage({cmd: 'clear_storage'}, function(response) {
    
  });
}

function removelink(buttonid){
  console.log(buttonid);
  document.getElementById(buttonid).parentElement.remove();
}
//Defining handlers

document.addEventListener("DOMContentLoaded", function () {
//document.getElementById("playlist").onclick = click_handle_list;
document.getElementById("clearall").onclick = click_handle_delete_all;
document.getElementById("playlist").addEventListener("click",function(e) {
  console.log(e.target.nodeName);
  if(e.target && e.target.nodeName === 'BUTTON') {
      removelink(e.target.id);
  }
  if(e.target && e.target.nodeName === 'A'){
    click_handle_list(e);
  }
});
});


//Adds url to queue and get the tab id of current tab.

/*function add_to_queue(url){

  chrome.runtime.sendMessage({url: url}, function(response) {
      if(response.send != "ack"){
        console.log('internal error !!');
        return -1;
      }
      console.log("ack");
  });

  queue.push(url);
  //get_info_from_page();
  //console.log(queue);

  chrome.storage.local.set({ "list" : queue }, function(){
    console.log("Saved");
  });
  chrome.runtime.sendMessage({cmd: 'set', url : queue}, function(response) {
    //console.log(response.farewell);
  });

   //need to fix xss
  // document.getElementById('playlist').innerHTML += '<li> <a href=' + url + '>'  +  url + ' </a> </li>';

} */

/*function get_info_from_page(){
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

*/

/*chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log("back : from the extension");
    if(request.msg == "title"){
      console.log(request.title);
      console.log(request.playback_time);
    }

  sendResponse({send: "ack"});
  
});*/