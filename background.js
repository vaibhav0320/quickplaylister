var queue = new Array();
var main_tab;
async function getCurrentTab(uurl) {
  let queryOptions = {active: true, currentWindow: true, url: uurl};
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function init(url){
  queue.push(url);
  main_tab = getCurrentTab(url);
  console.log(main_tab);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log("back : from the extension");
    console.log(request);
    if(queue.length == 0){
      init(request.url);
    }
  
  console.log(queue);
  console.log(main_tab);
  sendResponse({send: "ack"});
}
);

async function store_info() {
  
}