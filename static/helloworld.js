/* eslint-disable no-undef */
// 初始化标志变量
window.pageLoadTime = performance.now();
window.arFlag = false;
window.isUnloaded = false;
window.done = false;

window.addEventListener("beforeunload", () => {
  // 提取标志变量和事件索引
  const elementUrlIndex = window.dataLayer.findIndex(
    ({ event: eventType }) => eventType === "gtm.linkClick"
  );

  if (!window.isUnloaded && elementUrlIndex !== -1) {
    // 处理穿插广告埋点逻辑
    if (window.clickOpen === 1) {
      dataLayer.push({ event: "D_AL" });
    } else {
      dataLayer.push({ event: "D_RE" });
    }
    window.isUnloaded = true;
  }

  if (!window.done) {
    // 处理 AFS 广告埋点逻辑
    const activeElement = document.activeElement;
    const src = activeElement?.getAttribute("src") || "";
    let eventName = "";

    if (src.includes("afs/ads?")) {
      if (activeElement.getAttribute("title")) {
        eventName = "T_AR";
        window.arFlag = true;

        if (window.navigator.webdriver) {
          dataLayer.push({ event: "AR_DRIVER" });
        }
        if (document.visibilityState === "hidden") {
          dataLayer.push({ event: "AR_HIDDEN" });
        }
        const clickTime = performance.now();
        const timeElapsed = clickTime - window.pageLoadTime;
        if (timeElapsed > 3000) {
          dataLayer.push({ event: "AR_3" });
        } else if (timeElapsed > 2000) {
          dataLayer.push({ event: "AR_2" });
        } else if (timeElapsed > 1000) {
          dataLayer.push({ event: "AR_1" });
        } else {
          dataLayer.push({ event: "AR_0" });
        }
      } else {
        eventName = "T_AC";
      }
    } else if (src.includes("afs/ads/i/")) {
      eventName = "T_AG";
    } else if (elementUrlIndex !== -1) {
      eventName = "D_RE";
    }

    if (eventName) {
      dataLayer.push({ event: eventName });
      window.done = true;
    }
  }
});

// 监听 hash 变化事件 --- 判断穿插全屏广告出现
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#google_vignette") {
    window.clickOpen = 1;
    // 触发穿插
    dataLayer.push({ event: "C_AL" });
  }
});

// 监听消息事件
window.addEventListener("message", (event) => {
  if (
    event.data === '{"eventType":"adClosed","result":{"status":1},"googMsgType":"fullscreen"}' &&
    event.origin === "https://googleads.g.doubleclick.net"
  ) {
    window.clickOpen = 0;
    // 关闭穿插广告
    dataLayer.push({ event: "G_AL" });
  }
});

// 监听失去焦点事件
window.addEventListener("blur", () => {
  const activeElement = document.activeElement;
  const sourceAttribute = activeElement.getAttribute("src");

  // afs埋点
  if (sourceAttribute && sourceAttribute.includes("afs/ads?")) {
    if (activeElement.getAttribute("title")) {
      dataLayer.push({ event: "D_AR" });
    } else {
      dataLayer.push({ event: "D_AC" });
    }
  }

  // 页内广告埋点
  if (sourceAttribute && sourceAttribute.includes("googleads.g.doubleclick.net/pagead/ads?")) {
    const closestIns = activeElement.closest("ins");
    let adStatus = "unfilled";
    if (closestIns) {
      adStatus = closestIns.getAttribute("data-ad-status") || adStatus;
    }
    if (adStatus === "filled") {
      // 点击页内广告
      dataLayer.push({ event: "D_IP" });
    }
  } else if (
    sourceAttribute &&
    sourceAttribute.includes("googleads.g.doubleclick.net/pagead/html/")
  ) {
    if (sourceAttribute.includes("btvi=")) {
      // 点击锚定广告
      dataLayer.push({ event: "D_FI" });
    }
  }
});

window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    setTimeout(() => {
      window.done = false;
      window.pageLoadTime = performance.now();
      window.arFlag = false;
      document.body.focus();
    }, 0);
  }
  if (window.arFlag) {
    dataLayer.push({ event: "AR_VCHANGE" });
  }
});

// 注册所有事件监听器
window.addEventListener("unload", () => {
  if (window.arFlag) {
    dataLayer.push({ event: "AR_UNLOAD" });
  }
});

window.addEventListener("pagehide", () => {
  if (window.arFlag) {
    dataLayer.push({ event: "AR_HIDE" });
  }
});

if (window.navigator.webdriver) {
  dataLayer.push({ event: "WEB_DRIVER" });
}
