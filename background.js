

//ytplayer = document.getElementById("movie_player");


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
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
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

      if(typeof data.list !== 'undefined'){
        data.list.push(info.linkUrl);
      }
      else{
        var tlist = [];
        tlist[0]= info.linkUrl;
        data.list = tlist; 
        console.log("done");
      }

      chrome.storage.local.set({ "list" : data.list}, function(){
        console.log("setting",data.list);
        chrome.storage.local.get("list", function(data) { console.log(data.list)});
      });
  });
  }
}

chrome.contextMenus.onClicked.addListener(getword);

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    title: "Search abla ka dabla", 
    contexts:["link"], 
    id : CONTEXT_MENU_ID
  });
});
