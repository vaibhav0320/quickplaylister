var queue = new Array();
var main_tab;

function add_to_queue(url){


  chrome.runtime.sendMessage({url: url}, function(response) {
      if(response.send != "ack"){
        console.log('internal error !!');
        return -1;
      }
      console.log("ack");
  });

  queue.push(url);
  //console.log(queue);

}


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
  document.getElementById('playlist').innerHTML += '<li> <a href=' + res + '>'  + res + ' </a> </li>';
 
}

async function click_handle_list(e){
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    tabid = tabs[0].id;
    console.log("tab id is == ", tabid);
    main_tab =  tabid;
});
    chrome.tabs.update(main_tab,{url:e.target.href});
    console.log(e.target.href);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit").onclick = click_handler_add;
  document.getElementById("playlist").onclick = click_handle_list;

});
