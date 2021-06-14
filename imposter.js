const darkmode = new darken({
    toggle: "#toggle",
    variables: {
        "--primary-color": ["#ffffff", "#1f1f1f"],
        "--secondary-color": ["#000000", "#ffffff"],
        "--shadow-darken": ["rgba(0, 0, 0, 0.4)", "rgba(255, 255, 255, 0.2)"],
		"--lazyafswitch": ["url(iosoff.png)","url(ioson.png)"]
    }
});
function notrickroll() {
    window.open("https://www.youtube.com/watch?v=Lrj2Hq7xqQ8", "_blank")
}
function douge() {
    document.getElementById("ursus").value += this.getAttribute("stopbeingsus")
}
function sussybaka() {
    "arebeingpleaseyou" == document.getElementById("ursus").value && (window.open("https://www.youtube.com/watch?v=Lrj2Hq7xqQ8", "_blank"), document.getElementById("ursus").value = ""),
    "susjustGoaway" == document.getElementById("ursus").value && (groovity(), document.getElementById("ursus").value = ""),
    "iSaIdGoAwAyiSaIdGoAwAyiSaIdGoAwAyiSaIdGoAwAy" == document.getElementById("ursus").value && (hiddenSettings(), document.getElementById("ursus").value = ""),
    "dogedogedogeyouarebeingsusushouldgoawaypleasejustGostOpreadingthisstopit" == document.getElementById("ursus").value ? (window.location.href = "/bonk-it.jpg", document.getElementById("ursus").value = "") : document.getElementById("ursus").value = ""
}
function groovity() {
    document.getElementById("imsuchanidiot").className = "nomoredoge";
    var u = document.createElement("script");
    u.src = "gravity.js",
    document.body.appendChild(u)
    var e,
    t,
    o,
    n;
    for (e = document.querySelectorAll(".dogeyy"), t = 0; t < e.length; t++)
        e[t].style.width = "auto", e[t].style.height = "150px";
    for (o = document.querySelectorAll(".dоgeyy"), n = 0; n < o.length; n++)
        o[n].style.width = "auto", o[n].style.height = "150px";
}
Array.from(document.getElementsByClassName("dogeyy")).forEach(function (e) {
    e.addEventListener("click", douge)
}), Array.from(document.getElementsByClassName("dоgeyy")).forEach(function (e) {
    e.addEventListener("click", sussybaka)
}), Array.from(document.getElementsByClassName("tittle")).forEach(function (e) {
    e.addEventListener("click", notrickroll)
});
function hiddenSettings() {
    if (localStorage.getItem("secretbutton") == "shown") {
        document.getElementById("ursus").style.display = "none";
        localStorage.setItem("secretbutton", "hidden")
    } else {
        document.getElementById("ursus").style.display = "block";
        localStorage.setItem("secretbutton", "shown")
    }
}
function isitevenhidden() {
    if (localStorage.getItem("secretbutton") == "shown") {
        document.getElementById("ursus").style.display = "block";
    } else {
        document.getElementById("ursus").style.display = "none";
    }
}

function testlangpo() {
	document.getElementById("testlangpo").innerHTML = "hahhahahaahahah";
}

function testnotdone() {
  var x, i;
  x = document.querySelectorAll(".dogeyy");
  for (i = 0; i < x.length; i++) {
  x[i].style.display = "none";}
}

window.addEventListener("load", myInit, true); function myInit(){
isitevenhidden();
};