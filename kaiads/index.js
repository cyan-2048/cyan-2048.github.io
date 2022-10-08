function click() {
  try {
    const value = document.querySelector(".items");
    Object.defineProperty(document, "activeElement", { value });
    value.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

window.addEventListener("message", (event) => void (event.data === "click" && click()), false);

const urlparams = new URLSearchParams(location.search);

getKaiAd({
  publisher: urlparams.get("publisher") || "f76b7e40-cd70-4a3a-b98f-f03ad252de83",
  app: urlparams.get("app") || "sveltecord",
  slot: urlparams.get("slot") || "sveltecord",

  h: 54,
  w: 216,
  test: 0,
  timeout: 10000,

  // Max supported size is 240x264
  // container is required for responsive ads
  container: document.body,
  onerror: (err) => console.error("Custom catch:", err),
  onready: (ad) => {
    window.ad = ad;
    ad.on("click", () => console.log("click event"));
    ad.call("display", {
      tabindex: 0,
      display: "block",
      navClass: "items",
    });
    ad.on("display", () => {
      console.log("displayed! time to handle the click variable");
    });
  },
});
