const darkmode = new darken({
      toggle: "#toggle",
      variables : {
        "--primary-color" : ["#ffffff", "#1f1f1f"],
        "--secondary-color" : ["#000000", "#ffffff"],
      }
});


function notrickroll() {
  window.open('https://www.youtube.com/watch?v=Lrj2Hq7xqQ8', '_blank');
}


Array.from(document.getElementsByClassName("dogeyy")).forEach(function(element) {
  element.addEventListener('click', douge);
});

function douge() {
  document.getElementById('ursus').value += this.getAttribute('stopbeingsus');
}


function sussybaka() {
  if (document.getElementById('ursus').value == 'arebeingpleaseyou'){
    window.open('https://www.youtube.com/watch?v=Lrj2Hq7xqQ8', '_blank');
    document.getElementById('ursus').value = '';
  } else {
    document.getElementById('ursus').value = ''
  }
}

Array.from(document.getElementsByClassName("dоgeyy")).forEach(function(element) {
  element.addEventListener('click', sussybaka);
});

Array.from(document.getElementsByClassName("tittle")).forEach(function(element) {
  element.addEventListener('click', notrickroll);
});