var queue = new Array();
var lastid = 0;
var svg_icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="trash" viewBox="0 0 16 16"> \
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> \
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg> \
<span class="visually-hidden"> \
Menu \
</span>'
load_from_storage();


//## Initial function to fetch the data from storage if exist.

function load_from_storage(){
   
  chrome.runtime.sendMessage({cmd: 'get'}, function(response) {
    var temp_queue = response.farewell;
    console.log(temp_queue);
    if(typeof temp_queue !== 'undefined' && typeof temp_queue !== null){
      queue = temp_queue;
      for(var key in queue){
        generate_html(key,queue[key]);
      }
    }
    });
    
  
}

//## Generate html page 

function generate_html(url,vidtitle){
  
    var list = document.getElementById('playlist');
    
    var entry = document.createElement('li');
    var hreftag = document.createElement('a');
    hreftag.appendChild(document.createTextNode(vidtitle));
    hreftag.title= vidtitle;
    hreftag.href = url;
    entry.appendChild(hreftag);
    entry.setAttribute('id',url);
    var removeButton = document.createElement('button');
    removeButton.appendChild(document.createTextNode("remove"));
    removeButton.setAttribute('id',url);
    removeButton.setAttribute('class',"removebtn"); 
    removeButton.innerHTML = '<i class="gg-trash"></i>';
    //removeButton.innerHTML = svg_icon;
    entry.appendChild(removeButton);
    lastid+=1;
    list.appendChild(entry);

}

function send_tabinfo(tab){
  chrome.runtime.sendMessage({cmd: 'tab_info', tab:tab},function(response){});
}

//#################################################
//#       Handlers Part                           #
//#################################################

//## Handler for link when clicked

async function click_handle_list(e){

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
        } 
        else{
        chrome.tabs.update(main_tab,{url:e.target.href});
        }
      }

      chrome.tabs.get(main_tab,maintab_check);
    }

  });
    
   
}

//Handler for delete button
function removelink(buttonid){
  console.log(buttonid);
  
  chrome.runtime.sendMessage({cmd: 'remove_key', key:buttonid}, function(response) {});
  document.getElementById(buttonid).remove();
}

//##handler for deleteAll button

function click_handle_delete_all(){ 
   playlist = document.getElementById("playlist").innerHTML="";
  chrome.runtime.sendMessage({cmd: 'clear_storage'}, function(response) {});
}


//registering handlers 

document.addEventListener("DOMContentLoaded", function () {
document.getElementById("clearall").onclick = click_handle_delete_all;
document.getElementById("playlist").addEventListener("click",function(e) {
  console.log(e.target);
  if(e.target && e.target.nodeName === 'BUTTON') {
      console.log("HAEL");
      removelink(e.target.id);
  }
  if(e.target && e.target.nodeName === 'A'){
    click_handle_list(e);
  }
});
});
