var queue = new Array();


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

function click_handler() {
  var url = document.getElementById('url').value;
  var res = url;

/* String matching function needs to be added */
 // var res = url.match(/aa/i);  
  if(res == null){
    return;
  }
  console.log(res);
  add_to_queue(res);
 
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit").onclick = click_handler;
});