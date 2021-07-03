var queue = new Array();
var main_tab;
var current_id;

//ytplayer = document.getElementById("movie_player");

async function get_tab() {
  let queryOptions = {active: true, currentWindow: true, url: queue[current_id]};
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}



function add_to_queue(url){
  if(queue.length == 0 ){
    some_fun(url);
    current_id = 0;
  }
  queue.push(url);
}

function some_fun(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    tabid = tabs[0].id;
    console.log("tab id is == ", tabid);
    main_tab =  tabid;
}   );
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log("back : from the extension");
    
  add_to_queue(request.url);
  sendResponse({send: "ack"});
  
}
);

