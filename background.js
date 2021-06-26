async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true, url: "*youtube.com*" };
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log(tab)
  return tab;
}