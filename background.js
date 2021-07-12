
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.cmd == 'set'){;
        //console.log(queue);
        chrome.storage.local.set({ "list" : request.url }, function(){
            sendResponse({farewell: "saved"});
        });
        
        }

        if(request.cmd == 'get'){
          var list;
            console.log("get called");
            chrome.storage.local.get("list", function(data) {
                list = data.list;
                console.log(list);
                sendResponse({farewell: list});
            });          
            
            
        }

        if(request.cmd == 'clear_storage'){
            clear_local_storage()
        }
        return true;
    }
  );

  function clear_local_storage(){
    chrome.storage.local.set({"list": []},function() {

     })
   }

//#################################################
//#       context menu                            #
//#################################################

const CONTEXT_MENU_ID = "quickplay";
function getword(info,tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  //console.log(info);
  //console.log("Word " + info.linkUrl + " was clicked.");
  if(typeof info.linkUrl !== "undefined"){
      chrome.storage.local.get("list", function(data) {

      data.list.push(info.linkUrl);
      chrome.storage.local.set({ "list" : data.list}, function(){
       
      });
  });
  }
}

chrome.contextMenus.onClicked.addListener(getword);

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    title: "Add video to Quick list", 
    contexts:["link"], 
    id : CONTEXT_MENU_ID
  });
});
