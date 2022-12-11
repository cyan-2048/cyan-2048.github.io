function id(_) {
  return document.getElementById(_);
}

function copy(result) {
  navigator?.clipboard?.writeText(result).catch(() => {
    prompt("copy this instead:", result);
  });
}

function copyValue(_id) {
  copy(id(_id).value);
}

//**blob to dataURL**
function blobToDataURL(blob) {
  return new Promise((res) => {
    var a = new FileReader();
    a.onload = () => res(a.result);
    a.readAsDataURL(blob);
  });
}

async function dataURLFunc(text) {
  id("dataURLText").value = await blobToDataURL(text);
}

const jsonText = id("jsonText");
function jsonStringify(_) {
  let object = Function(`return (${jsonText.value})`)();

  const num = +_;
  const whitespace = isNaN(num) ? _ : num;
  jsonText.value = JSON.stringify(object, null, whitespace);
}

const evalText = id("evalText");
function evalFunc(_copy = false, showResult = false) {
  try {
    const result = eval(evalText.value);
    if (showResult) {
      evalText.value = result;
      return;
    }
    _copy && copy(result);
  } catch (error) {
    alert(error);
  }
}

const videoPlayer = id("videoPlayer");
function playVideo(files) {
  try {
    URL.revokeObjectURL(videoPlayer.src);
    videoPlayer.src = URL.createObjectURL(files[0]);
  } catch (e) {}
}

playVideo(id("videoInput").files);

document.body.setAttribute(
  "style",
  localStorage["dark_mode"] == "true"
    ? "--primary-color: #1f1f1f; --secondary-color: #ffffff; --shadow-darken: rgba(255, 255, 255, 0.2);"
    : "--primary-color: #ffffff; --secondary-color: #000000; --shadow-darken: rgba(0, 0, 0, 0.4);"
);
