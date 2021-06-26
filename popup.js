function click_handler() {
  console.log("here");
  var url = document.getElementById('url').value;
  console.log(url);
 
}
document.addEventListener("DOMContentLoaded", function () {
  console.log("CLick");
  document.getElementById("submit").onclick = click_handler;
});