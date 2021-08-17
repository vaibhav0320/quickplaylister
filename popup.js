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

function load_from_storage() {

  chrome.runtime.sendMessage({ cmd: 'get' }, function (response) {
    var temp_queue = response.farewell;
    console.log(temp_queue);
    if (typeof temp_queue !== 'undefined' && typeof temp_queue !== null) {
      queue = temp_queue;
      for (var key in queue) {
        generate_html(key, queue[key]);
        //console.log('URL: ' + key)
      }
    }
  });


}

//## Generate html page 

function generate_html(url, vidtitle, id) {

  var list = document.getElementById('playlist');
  var entry = document.createElement('li');
  var hreftag = document.createElement('a');
  hreftag.appendChild(document.createTextNode(vidtitle));
  hreftag.title = vidtitle;
  hreftag.href = url;
  let vidId = url
  vidId = vidId.split('=')
  vidId = vidId[1];
  vidId = vidId.split('&')
  vidId = vidId[0]
  hreftag.code = vidId;
  entry.appendChild(hreftag);
  entry.setAttribute('id', url);
  var removeButton = document.createElement('button');
  removeButton.appendChild(document.createTextNode("remove"));
  removeButton.setAttribute('id', url);
  removeButton.setAttribute('class', "removebtn");
  removeButton.innerHTML = '<i class="gg-trash"></i>';
  //removeButton.innerHTML = svg_icon;
  entry.appendChild(removeButton);
  lastid += 1;
  list.appendChild(entry);
}
function send_tabinfo(tab) {
  chrome.runtime.sendMessage({ cmd: 'tab_info', tab: tab }, function (response) { });
}

//#################################################
//#       Handlers Part                           #
//#################################################

//## Handler for link when clicked
function getinfo() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    tabs.forEach(function (tab) {
      console.log('Tab ID: ', tab);
    });
  });
}
async function click_handle_list(e) {

  chrome.runtime.sendMessage({ cmd: 'get_tabid' }, function (response) {
    main_tab = response.tabid;

    console.log("maintab= " + main_tab);
    console.log(main_tab == undefined);
    if (main_tab == undefined) {
      newtab = chrome.tabs.create({ url: e.target.href }, send_tabinfo);
    }
    else {

      function maintab_check() {

        if (chrome.runtime.lastError) {
          newtab = chrome.tabs.create({ url: e.target.href }, send_tabinfo);
        }
        else {
          chrome.tabs.update(main_tab, { url: e.target.href });
        }
      }

      chrome.tabs.get(main_tab, maintab_check);
    }

  });


}

//Handler for delete button
function removelink(buttonid) {
  console.log(buttonid);

  chrome.runtime.sendMessage({ cmd: 'remove_key', key: buttonid }, function (response) { });
  document.getElementById(buttonid).remove();
}

//##handler for deleteAll button

function click_handle_delete_all() {
  playlist = document.getElementById("playlist").innerHTML = "";
  chrome.runtime.sendMessage({ cmd: 'clear_storage' }, function (response) { });
}


//registering handlers 

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("clearall").onclick = click_handle_delete_all;
  document.getElementById("playlist").addEventListener("click", function (e) {
    console.log("user went for: " + e.target);
    if (e.target && e.target.nodeName === 'BUTTON') {
      console.log("HAEL");
      removelink(e.target.id);
    }
    if (e.target && e.target.nodeName === 'A') {
      click_handle_list(e);
    }
  });
});

//!?hover-BG
//Recursion until DOM loades completely.....
function recursion() {
  setTimeout(() => {
    if (document.querySelectorAll('ul#playlist') == undefined) {
      console.log('winding up....................................................................')
      recursion()
    }
    else if (document.querySelectorAll('ul#playlist')[0] == undefined) {
      console.log('winding up....................................................................')
      recursion()
    }
    else if (document.querySelectorAll('ul#playlist')[0].childNodes[0] == undefined) {
      console.log('winding up....................................................................')
      recursion()
    }
    else if (document.querySelectorAll('ul#playlist')[0].childNodes[2].firstElementChild.code == undefined) {
      console.log('winding up....................................................................')
      recursion()
    }
    else {
      const hoverer = (param1) => {
        document.body.style.backgroundImage = `url(https://img.youtube.com/vi/${document.querySelectorAll('ul#playlist')[0].childNodes[param1].firstElementChild.code}/hqdefault.jpg)`
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.backgroundAttachment = 'fixed'
        document.body.style.backgroundPosition = 'center'
        console.log(document.querySelectorAll('ul#playlist')[0].childNodes[param1].firstElementChild.code)
      }
      document.querySelectorAll('ul#playlist')[0].childNodes[1].addEventListener('mouseenter', () => {
        hoverer(1)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[2].addEventListener('mouseenter', () => {
        hoverer(2)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[3].addEventListener('mouseenter', () => {
        hoverer(3)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[4].addEventListener('mouseenter', () => {
        hoverer(4)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[5].addEventListener('mouseenter', () => {
        hoverer(5)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[6].addEventListener('mouseenter', () => {
        hoverer(6)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[7].addEventListener('mouseenter', () => {
        hoverer(7)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[8].addEventListener('mouseenter', () => {
        hoverer(8)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[9].addEventListener('mouseenter', () => {
        hoverer(9)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[10].addEventListener('mouseenter', () => {
        hoverer(10)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[11].addEventListener('mouseenter', () => {
        hoverer(11)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[12].addEventListener('mouseenter', () => {
        hoverer(12)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[13].addEventListener('mouseenter', () => {
        hoverer(13)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[14].addEventListener('mouseenter', () => {
        hoverer(14)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[15].addEventListener('mouseenter', () => {
        hoverer(15)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[16].addEventListener('mouseenter', () => {
        hoverer(16)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[17].addEventListener('mouseenter', () => {
        hoverer(17)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[18].addEventListener('mouseenter', () => {
        hoverer(18)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[19].addEventListener('mouseenter', () => {
        hoverer(19)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[20].addEventListener('mouseenter', () => {
        hoverer(20)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[21].addEventListener('mouseenter', () => {
        hoverer(21)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[22].addEventListener('mouseenter', () => {
        hoverer(22)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[23].addEventListener('mouseenter', () => {
        hoverer(23)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[24].addEventListener('mouseenter', () => {
        hoverer(24)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[25].addEventListener('mouseenter', () => {
        hoverer(25)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[26].addEventListener('mouseenter', () => {
        hoverer(26)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[27].addEventListener('mouseenter', () => {
        hoverer(27)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[28].addEventListener('mouseenter', () => {
        hoverer(28)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[29].addEventListener('mouseenter', () => {
        hoverer(29)
      })
      document.querySelectorAll('ul#playlist')[0].childNodes[30].addEventListener('mouseenter', () => {
        hoverer(30)
      })
    }
  }, 200)

}
recursion()
