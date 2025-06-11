function getMainDomain() {
  const url = window.location.hostname;
  const parts = url.split(".");
  if (parts.length > 2) {
    return parts.slice(-2).join(".");
  }
  return url;
}

function setCookie(name, value, daysToExpire = 1) {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + getMainDomain();
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// eslint-disable-next-line no-unused-vars
function getDetailIsClickAc() {
  const cipherData = getCookie("hi_act_chain");
  if (cipherData) {
    const decoded = JSON.parse(atob(cipherData));
    if (Date.now() - decoded.timestamp < 3600000) {
      return true;
    }
  }
  return false;
}

window.addEventListener("blur", () => {
  const activeElement = document.activeElement;
  const src = activeElement.getAttribute("src");
  if (src && src.includes("afs/ads?")) {
    if (!activeElement.getAttribute("title") && location.pathname.includes("/detail/")) {
      const cipherText = btoa(
        JSON.stringify({
          timestamp: Date.now()
        })
      );
      setCookie("hi_act_chain", cipherText);
    }
  }
});

// eslint-disable-next-line no-unused-vars
function pushEventParamsToGtm(eventName) {
  const searchParams = new URLSearchParams(window.location.search);
  const ttclid = searchParams.get("ttclid");
  window.dataLayer.push({
    event: eventName,
    hi_country: window.youknowwho_ip_country || "unknown",
    hi_ip: window.youknowwho_ip || "unknown",
    hi_ttclid: ttclid || window.getCookie("hi_ttclid") || "unknown"
  });
}
