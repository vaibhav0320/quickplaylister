var main_tab;
var listid = 0;

function datetime_id(){
  var date = new Date();
  var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    ("0" + date.getHours()).slice(-2),
    ("0" + date.getMinutes()).slice(-2),
    ("0" + date.getSeconds()).slice(-2),
    //date.getMilliseconds()
  ];
  return components.join("");
}



//#################################################
//#       On message listners                     #
//#################################################

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       
        if(request.cmd == 'get'){
          var list;
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
          console.log(main_tab)
        }
        if(request.cmd == 'tab_info'){
          console.log(request.tab.id);
          main_tab = request.tab.id;
        }

        //!!!!!!
        if(request.cmd == 'get_time'){
          console.log(request.tab.id);
          main_tab = request.tab.id;
        }

        //!!!!!!
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
    console.log(tab);
    console.log(document.getElementById("movie_player").getDuration())
});


//#################################################
//#       context menu                            #
//#################################################

const CONTEXT_MENU_ID = "quickplay";
function geturl(info) {
  console.log(info);
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    console.log('triggred')
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
          vidtitle = linkurl;
          }
          //console.log(vidtitle);
          var id = datetime_id();
          //console.log(id);
          //data.list[linkurl] = vidtitle;
          data.list[id] = [vidtitle,linkurl];
          chrome.storage.local.set({ "list" : data.list}, function(){});

          let vidId = linkurl;
          vidId = vidId.split('=');
          vidId = vidId[1];
          vidId = vidId.split('&');
          vidId = vidId[0];

          /*  Some impemetation of caching the image thumbnail 

          fetch("https://img.youtube.com/vi/"+vidId+"/hqdefault.jpg").then(response => response.blob()).then(image => {
            chrome.storage.local.set({ vidId : image}, function(){
              console.log("Image downloaded");
            });
          })
          */  

          });

      
  });
  }
}

chrome.contextMenus.onClicked.addListener(geturl);

chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
    title: "Add to QuickList", 
    contexts:["link","page"], 
    id : CONTEXT_MENU_ID,
    targetUrlPatterns: ["https://www.youtube.com/watch?v=*"],
    documentUrlPatterns: [ "https://www.youtube.com/*"]
  });
});

//!cHECK-uP ---> code above this line is to check if any of the song/video playing rightnow belongs to the playlist.
/*identifier() 
function identifier() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    chrome.storage.local.get("list", function(data) {
      for(let TAB_NUM=0; TAB_NUM < tabs.length; TAB_NUM++){
        for(let PLAYLIST_CHILD_NUM=0; PLAYLIST_CHILD_NUM < Object.keys(data.list).length; PLAYLIST_CHILD_NUM++){
          if(tabs[TAB_NUM].url == Object.keys(data.list)[PLAYLIST_CHILD_NUM]){
            console.log(` At Tab No: ${TAB_NUM}, the video is 
            in playlist's --- (${PLAYLIST_CHILD_NUM+1})th song.... URL: ${tabs[TAB_NUM].url}`)
            PLAYLIST_CHILD_NUM++
          }
          else{
            console.log('no song from playlist found in active tabs')
          }
        }
      }
  });       
  });
}
  chrome.tabs.onUpdated.addListener(function() {
    console.log('change in tabs occured')
    identifier() 
});*/
