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

sponsorBlockDesktop = {
  autoSkipOnMusicVideosUpdate: true,
  invidiousInstances: [
    "inv.cthd.icu",
    "inv.riverside.rocks",
    "invidio.xamh.de",
    "invidious.kavin.rocks",
    "invidious.namazso.eu",
    "invidious.osi.kr",
    "invidious.snopyta.org",
    "vid.puffyan.us",
    "yewtu.be",
    "youtube.076.ne.jp",
    "yt.artemislena.eu",
  ],
  userID: "hYk16zSuvpWFClCtBt2e1jxODkeOXaQlk4rO",
  categoryPillUpdate: true,
  categorySelections: [
    { name: "sponsor", option: 1 },
    { name: "poi_highlight", option: 1 },
    { name: "exclusive_access", option: 0 },
    { name: "selfpromo", option: 1 },
    { name: "interaction", option: 1 },
    { name: "intro", option: 1 },
    { name: "outro", option: 1 },
    { name: "preview", option: 1 },
    { name: "filler", option: 1 },
    { name: "music_offtopic", option: 1 },
  ],
  hideUploadButtonPlayerControls: true,
  hideDeleteButtonPlayerControls: true,
  showTimeWithSkips: false,
  skipCount: 91,
  unsubmittedSegments: {
    "2zxTFYEAknA": [
      {
        segment: [0],
        UUID: "5TciXCU7gxZNWa8EVFMeJV1jQhaSWEcNNTcs",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
    ],
    "42Rf1zl16ZA": [
      {
        segment: [1.683],
        UUID: "wLfwUr6sV0Cgy1eUV1Nj7KNd37D23RrNfz2a",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
    ],
    "4IaOeVgZ-wc": [
      {
        segment: [2643.681],
        UUID: "PE5NEuXXtemtPacdDyjZpwnX32XnIQ4XB4je",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
    ],
    PQRzAYXzfmw: [
      {
        segment: [127.943, 129.805],
        UUID: "8BiCn4RtksykC6PHRGSRPaLTyNwwLnvSBOnE",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
      {
        segment: [131.56, 132.579],
        UUID: "c33BFcNSIh3dAmcK5jqw70yUXav7chdkobtB",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
      {
        segment: [139.31, 141.085],
        UUID: "utqpXA4hEn3Pgwy0hFNJaNTha6862VrO3xn4",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
      {
        segment: [142.235, 142.235],
        UUID: "eCYAnpChWB4GjufLzHSvNrS2jGXUzcOOx7pJ",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
      {
        segment: [142.963, 142.963],
        UUID: "AcKKi9YT92OlJ0XiOrAzq5Z08tTKYogp9hxj",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
      {
        segment: [142.963],
        UUID: "IBqEitbCNVBOkDH0OYoWPX5xJNmvNN6Dc98E",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
    ],
    AnBs3RVq_QM: [
      {
        segment: [89.128],
        UUID: "1LrfE28UmTDJ5m9it3VzNo297ZKbEAuAesPn",
        category: "chooseACategory",
        actionType: "skip",
        source: 1,
      },
    ],
  },
  showPopupDonationCount: 4,
  isVip: false,
  minutesSaved: 133.96604121666667,
  permissions: {
    sponsor: true,
    selfpromo: true,
    exclusive_access: true,
    interaction: true,
    intro: true,
    outro: true,
    preview: true,
    music_offtopic: true,
    filler: true,
    poi_highlight: true,
    chapter: false,
  },
  defaultCategory: "chooseACategory",
  renderSegmentsAsChapters: false,
  whitelistedChannels: [],
  forceChannelCheck: false,
  sponsorTimesContributed: 0,
  submissionCountSinceCategories: 0,
  disableSkipping: false,
  muteSegments: true,
  fullVideoSegments: true,
  manualSkipOnFullVideo: false,
  trackViewCount: true,
  trackViewCountInPrivate: true,
  trackDownvotes: true,
  dontShowNotice: false,
  noticeVisibilityMode: 3,
  hideVideoPlayerControls: false,
  hideInfoButtonPlayerControls: false,
  hideSkipButtonPlayerControls: false,
  hideDiscordLaunches: 0,
  hideDiscordLink: false,
  supportInvidious: false,
  serverAddress: "https://sponsor.ajay.app",
  minDuration: 0,
  skipNoticeDuration: 4,
  audioNotificationOnSkip: false,
  checkForUnlistedVideos: false,
  testingServer: false,
  refetchWhenNotFound: true,
  ytInfoPermissionGranted: false,
  allowExpirements: true,
  showDonationLink: true,
  showUpsells: true,
  donateClicked: 0,
  autoHideInfoButton: true,
  autoSkipOnMusicVideos: false,
  scrollToEditTimeUpdate: false,
  showChapterInfoMessage: true,
  darkMode: true,
  showCategoryGuidelines: true,
  showCategoryWithoutPermission: false,
  showSegmentNameInChapterBar: true,
  useVirtualTime: true,
  showSegmentFailedToFetchWarning: true,
  categoryPillColors: {},
  skipKeybind: { key: "Enter" },
  startSponsorKeybind: { key: ";" },
  submitKeybind: { key: "'" },
  nextChapterKeybind: { key: "]", ctrl: true },
  previousChapterKeybind: { key: "[", ctrl: true },
  payments: {
    licenseKey: null,
    lastCheck: 1670924242559,
    lastFreeCheck: 1670924241520,
    freeAccess: false,
    chaptersAllowed: false,
  },
  colorPalette: { red: "#780303", white: "#ffffff", locked: "#ffc83d" },
  barTypes: {
    "preview-chooseACategory": { color: "#ffffff", opacity: "0.7" },
    sponsor: { color: "#00d400", opacity: "0.7" },
    "preview-sponsor": { color: "#007800", opacity: "0.7" },
    selfpromo: { color: "#ffff00", opacity: "0.7" },
    "preview-selfpromo": { color: "#bfbf35", opacity: "0.7" },
    exclusive_access: { color: "#008a5c", opacity: "0.7" },
    interaction: { color: "#cc00ff", opacity: "0.7" },
    "preview-interaction": { color: "#6c0087", opacity: "0.7" },
    intro: { color: "#00ffff", opacity: "0.7" },
    "preview-intro": { color: "#008080", opacity: "0.7" },
    outro: { color: "#0202ed", opacity: "0.7" },
    "preview-outro": { color: "#000070", opacity: "0.7" },
    preview: { color: "#008fd6", opacity: "0.7" },
    "preview-preview": { color: "#005799", opacity: "0.7" },
    music_offtopic: { color: "#ff9900", opacity: "0.7" },
    "preview-music_offtopic": { color: "#a6634a", opacity: "0.7" },
    poi_highlight: { color: "#ff1684", opacity: "0.7" },
    "preview-poi_highlight": { color: "#9b044c", opacity: "0.7" },
    filler: { color: "#7300FF", opacity: "0.9" },
    "preview-filler": { color: "#2E0066", opacity: "0.7" },
  },
};

sponsorBlockVanced = {
  dontShowNotice: false,
  barTypes: {
    sponsor: { color: "#00D400" },
    intro: { color: "#00FFFF" },
    outro: { color: "#0202ED" },
    interaction: { color: "#CC00FF" },
    selfpromo: { color: "#FFFF00" },
    music_offtopic: { color: "#FF9900" },
    preview: { color: "#008FD6" },
    filler: { color: "#7300FF" },
  },
  showTimeWithSkips: true,
  minDuration: 0,
  trackViewCount: true,
  categorySelections: [
    { name: "sponsor", option: 2 },
    { name: "intro", option: 1 },
    { name: "outro", option: 1 },
    { name: "interaction", option: 2 },
    { name: "selfpromo", option: 2 },
    { name: "music_offtopic", option: 1 },
  ],
  userID: "",
  isVip: false,
  lastIsVipUpdate: 1666460231890,
  serverAddress: "https://sponsor.ajay.app/api/",
};
