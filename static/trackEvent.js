/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
/* eslint-disable prefer-const */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
function getParam(queryKey) {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.has(queryKey) ? searchParams.get(queryKey).trim() : "";
  } catch (c) {
    return "";
  }
}
const initPixels = {
  tiktok: function (b) {
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      (ttq.methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
        "holdConsent",
        "revokeConsent",
        "grantConsent"
      ]),
        (ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      (ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      }),
        (ttq.load = function (e, n) {
          let r = "https://analytics.tiktok.com/i18n/pixel/events.js",
            o = n && n.partner;
          (ttq._i = ttq._i || {}),
            (ttq._i[e] = []),
            (ttq._i[e]._u = r),
            (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          n = document.createElement("script");
          (n.type = "text/javascript"), (n.async = !0), (n.src = r + "?sdkid=" + e + "&lib=" + t);
          e = document.getElementsByTagName("script")[0];
          e.parentNode.insertBefore(n, e);
        });

      ttq.load(b);
      if (w.location.pathname.startsWith("/detail")) {
        ttq.page();
      }
    })(window, document, "ttq");
  },
  taboola: function (pixelId) {
    window._tfa = window._tfa || [];
    window._tfa.push({
      notify: "event",
      name: "page_view",
      id: pixelId
    });
    !(function (t, f, a, x) {
      if (!document.getElementById(x)) {
        t.async = 1;
        t.src = a;
        t.id = x;
        f.parentNode.insertBefore(t, f);
      }
    })(
      document.createElement("script"),
      document.getElementsByTagName("script")[0],
      `//cdn.taboola.com/libtrc/unip/${pixelId}/tfa.js`,
      "tb_tfa_script"
    );
  },
  outbrain: function (pixelId) {
    /** DO NOT MODIFY THIS CODE**/
    !(function (_window, _document) {
      var OB_ADV_ID = pixelId;
      if (_window.obApi) {
        var toArray = function (object) {
          return Object.prototype.toString.call(object) === "[object Array]" ? object : [object];
        };
        _window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(toArray(OB_ADV_ID));
        return;
      }
      var api = (_window.obApi = function () {
        api.dispatch ? api.dispatch.apply(api, arguments) : api.queue.push(arguments);
      });
      api.version = "1.1";
      api.loaded = true;
      api.marketerId = OB_ADV_ID;
      api.queue = [];
      var tag = _document.createElement("script");
      tag.async = true;
      tag.src = "//amplify.outbrain.com/cp/obtp.js";
      tag.type = "text/javascript";
      var script = _document.getElementsByTagName("script")[0];
      script.parentNode.insertBefore(tag, script);
    })(window, document);

    if (window.location.pathname.startsWith("/detail")) {
      window.obApi("track", "PAGE_VIEW");
    }
  },
  pinterest: function (pixelId) {
    !(function (e) {
      if (!window.pintrk) {
        window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments));
        };
        var n = window.pintrk;
        (n.queue = []), (n.version = "3.0");
        var t = document.createElement("script");
        (t.async = !0), (t.src = e);
        var r = document.getElementsByTagName("script")[0];
        r.parentNode.insertBefore(t, r);
      }
    })("https://s.pinimg.com/ct/core.js");
    window.pintrk("load", pixelId, { em: "<user_email_address>" });
    window.pintrk("page");
  },
  facebook: function (pixelId) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }
};

(function () {
  const source = getParam("hi_source"),
    pixelId = getParam("hi_pc");
  if (source && initPixels[source]) initPixels[source](pixelId);
})();

function trackEventToPixel(eventKey) {
  const eventNameObj = {
    // 触发词条
    D_C_AC: {
      taboola: "lead",
      tiktok: "Lead",
      outbrain: "Lead",
      pinterest: "lead",
      facebook: "Lead"
    },
    // 点击词条
    T_AC_MSG: {
      taboola: "add_to_wishlist",
      tiktok: "AddToWishlist",
      outbrain: "Add to cart",
      pinterest: "initiatecheckout",
      facebook: "AddToWishlist"
    },
    // 请求广告
    Q_AR: {
      taboola: "view_content",
      tiktok: "ViewContent",
      outbrain: "Content view",
      pinterest: "viewcategory",
      facebook: "ViewContent"
    },
    // 触发广告
    C_AR: {
      taboola: "start_checkout",
      tiktok: "Download",
      outbrain: "Download",
      pinterest: "signup",
      facebook: "InitiateCheckout"
    },
    // 点击广告
    T_AR: {
      taboola: "make_purchase",
      tiktok: "Purchase",
      outbrain: "Registration",
      pinterest: "checkout",
      facebook: "Purchase"
    }
  };

  const source = getParam("hi_source"),
    eventName = eventNameObj[eventKey][source];
  let pixelId = getParam("hi_pc");
  if (source && pixelId && eventName) {
    if (source === "taboola") {
      window._tfa.push({ notify: "event", name: eventName, id: pixelId });
    } else if (source === "tiktok") {
      window.ttq?.instance(pixelId)?.track?.(eventName);
      if (eventName === "Purchase") {
        window.ttq?.instance(pixelId)?.track?.("InitiateCheckout");
      }
    } else if (source === "outbrain") {
      window.obApi?.("track", eventName);
    } else if (source === "pinterest") {
      window.pintrk?.("track", eventName);
    } else if (source === "facebook") {
      window.fbq?.("track", eventName);
    }
  }
}

// 封装构建URL的公用函数
function getResultsPageUrl(queryParams) {
  let url = `${window.location.origin}/search/?afs`;
  for (const [key, value] of Object.entries(queryParams)) {
    if (value) {
      url += `&${key}=${value}`;
    }
  }
  return url;
}
