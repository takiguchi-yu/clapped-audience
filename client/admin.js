(() =>{
  const btn = document.getElementById('adminBtn');
  btn.addEventListener('click', e => {

    const message = document.getElementById('message').value;
    const position = displayRadioValue('position');
    const duration = document.getElementById('duration').value;
    const fontColor = document.getElementById('fontColor').value;
    const fontSize = document.getElementById('fontSize').value;
    const fontWeight = document.getElementById('fontWeight').value;

    ws.send(`{ "action": "sendmessage", "data": "text,${message},${position},${duration},${fontColor},${fontSize},${fontWeight}", "eventCode": "${eventCode}"}`);
  });
})();


function displayRadioValue(name) {
  const els = document.getElementsByName(name);
  for (let i = 0, length = els.length; i < length; i++) {
    if (els[i].checked) {
      return els[i].value
    }
  }
}
