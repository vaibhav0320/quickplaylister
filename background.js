var main_tab;
var listid = 0;
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

        if(request.cmd == 'get_tabid'){
          sendResponse({tabid: main_tab})
        }
        if(request.cmd == 'tab_info'){
          console.log(request.tab.id);
          main_tab = request.tab.id;
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
function geturl(info,tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  //console.log(info);
  //console.log("Word " + info.linkUrl + " was clicked.");
  if(typeof info.linkUrl !== "undefined"){
      chrome.storage.local.get("list", function(data) {
      
        if(data.list.length == 0){
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            tabid = tabs[0].id;
            console.log("tab id is = ", tabid);
            main_tab =  tabid;
          });
        }

        fetch("https://www.youtube.com/oembed?url="+info.linkUrl+"&format=json").then(r => r.text()).then(result => {
          var vidtitle;
          try{
          var resp = JSON.parse(result);
          vidtitle = resp.title;
          console.log(resp.title);
           }
    
          catch{
          vidtitle = url;
          }
          data.list.push(info.linkUrl);
          chrome.storage.local.set({ "list" : data.list}, function(){});
       
            
          });

      
  });
  }
}

chrome.contextMenus.onClicked.addListener(geturl);

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    title: "Add video to Quick list", 
    contexts:["link"], 
    id : CONTEXT_MENU_ID
  });
});
