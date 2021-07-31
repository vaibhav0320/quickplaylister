var main_tab;
var listid = 0;

//#################################################
//#       On message listners                     #
//#################################################

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       
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
        if(request.cmd == 'remove_key'){

          chrome.storage.local.get("list", function(data) {
            list = data.list;
            delete list[request.key];
            chrome.storage.local.set({"list":list},function(){});
          });
        }
        return true;
    }
  );

  function clear_local_storage(){
    chrome.storage.local.set({"list": {}},function() {

     })
   }



chrome.tabs.onUpdated.addListener(function(main_tab,changeInfo,tab){
    console.log(tab,changeInfo);
});

//#################################################
//#       context menu                            #
//#################################################

const CONTEXT_MENU_ID = "quickplay";
function geturl(info) {
  console.log(info);
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  //console.log(info);
  //console.log("Word " + info.linkUrl + " was clicked.");
  var linkurl;
  if(info.linkUrl == undefined) { linkurl = info.pageUrl;}
  else{linkurl = info.linkUrl;}
  if(typeof linkurl !== "undefined"){
      chrome.storage.local.get("list", function(data) {
        if(data.list.length == 0){
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            tabid = tabs[0].id;
            console.log("tab id is = ", tabid);
            main_tab =  tabid;
          });
          data.list = {};
        }
        
        fetch("https://www.youtube.com/oembed?url="+linkurl+"&format=json").then(r => r.text()).then(result => {
          var vidtitle;
          try{
          var resp = JSON.parse(result);
          vidtitle = resp.title;
          }
    
          catch{
          vidtitle = url;
          }
          console.log(vidtitle);
          data.list[linkurl] = vidtitle;
          chrome.storage.local.set({ "list" : data.list}, function(){});
          });

      
  });
  }
}

chrome.contextMenus.onClicked.addListener(geturl);

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    title: "Add video to Quick list", 
    contexts:["link","page"], 
    id : CONTEXT_MENU_ID,
    targetUrlPatterns: ["https://www.youtube.com/watch?v=*"],
    documentUrlPatterns: [ "https://www.youtube.com/*"]
  });
});
