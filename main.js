chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('subsimapp.html', {
  	id: "subsimapp",
    innerBounds: {
      width: 700,
      height: 700
    }
  });
});