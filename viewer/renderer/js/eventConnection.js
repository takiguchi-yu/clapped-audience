function eventConnection() {
  const eventCode = document.getElementById('eventCode').value
  window.electronAPI.eventCode(eventCode);
  location.href = './event.html'
}