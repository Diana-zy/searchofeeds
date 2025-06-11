<template>
  <div class="page">
    <Header :lang="newInfo.language" />
    <article class="article">
      <h1 class="article-title">{{ newInfo.name }}</h1>
      <div class="news-detail">{{ newInfo.first_paragraph }}</div>
      <div id="relatedsearches1"> </div>
      <NuxtImg
        format="auto"
        fit="cover"
        width="900"
        :src="newInfo.cover"
        :alt="newInfo.name"
        class="article-img"
        preload
      />
      <!-- eslint-disable vue/no-v-html -->
      <div class="news-detail" v-html="newInfo.content"></div>
      <!--eslint-enable-->
    </article>
    <div id="relatedstyle2"> </div>
    <Footer :lang="newInfo.language" />
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, params, env }) {
    const path = params.detail;
    const lastDashIndex = path.lastIndexOf("-");
    const id = path.substring(lastDashIndex + 1, path.length);
    const [data] = await Promise.all([
      $axios.$get("/api/article/detail", {
        params: {
          site_id: env.SITE_ID,
          article_id: id
        }
      })
    ]);
    data.content = data.content.replace(/<\/h4><p><br><br>|<br><br><\/p><h4>/g, (match) => {
      return match.includes("</h4><p>") ? "</h4><p>" : "</p><h4>";
    });
    return { newInfo: data };
  },
  data() {
    return {
      channelId: ""
    };
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.newInfo.language
      },
      title: this.newInfo.name + " - Searchofeeds",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.newInfo.first_paragraph
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.newInfo.terms
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.newInfo.name
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.newInfo.first_paragraph
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `https://searchofeeds.com/detail/${this.newInfo.path}/`
        },
        {
          hid: "og:locale",
          property: "og:locale",
          content: this.newInfo.language
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.newInfo.cover
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "article"
        }
      ]
    };
  },
  // beforeMount() {
  //   if (this.newInfo.recommend_words && this.$recKeywords.length > 0) {
  //     this.detailKeyword = this.newInfo.recommend_words;
  //   } else {
  //     this.detailKeyword = this.$recKeywords;
  //   }
  // },
  mounted: function () {
    // 获取 URL 查询参数
    const searchParams = new URLSearchParams(window.location.search);
    // AdSense 配置参数
    if (searchParams.has("channel")) {
      this.channelId = searchParams.get("channel");
    } else {
      this.channelId = this.newInfo.channel || "";
      console.log("channelId", this.channelId, this.newInfo);
      if (this.channelId !== "") {
        searchParams.set("channel", this.channelId);
        const newUrl = `${window.location.origin}${
          window.location.pathname
        }?${searchParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }

    setTimeout(() => {
      if (window.location.hostname.indexOf("s.") === 0) {
        this.addAdSenseScript2();
      } else {
        this.addAdSenseScript();
      }
    }, 0);

    let lastScrollTop = 0;
    let scrolledUpFromBottom = false;
    let flag1 = false;
    let flag2 = false;
    let flag3 = false;

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // 判断用户是否向下滚动
      if (scrollTop > lastScrollTop) {
        scrolledUpFromBottom = false; // 如果用户向下滚动，重置标志
        if (flag1 === false) {
          // eslint-disable-next-line no-undef
          dataLayer.push({ event: "SCROLL_D" });
          flag1 = true;
        }
      }
      // 判断用户是否向上滚动
      else {
        if (scrollTop + windowHeight >= docHeight - 5) {
          // 加入小缓冲区以检测页面底部
          scrolledUpFromBottom = true;
        }

        if (scrolledUpFromBottom) {
          if (flag2 === false) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "SCROLL_BU" });
            flag2 = true;
          }
        } else if (flag3 === false) {
          // eslint-disable-next-line no-undef
          dataLayer.push({ event: "SCROLL_U" });
          flag3 = true;
        }
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // 处理移动设备或负滚动
    });
  },
  methods: {
    addAdSenseScript() {
      console.log("addAdSenseScript", this.newInfo.terms);
      // 获取 URL 查询参数
      const searchParams = new URLSearchParams(window.location.search);
      const clickId = searchParams.has("click_id") ? searchParams.get("click_id") : "";
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      terms = terms.replace(/[，]/g, ",");
      const paramKeys = [];
      // 遍历查询参数并将其添加到 paramKeys 数组中
      for (const param of searchParams) {
        paramKeys.push(param[0]);
      }
      const ignoredPageParams = paramKeys.join(",");

      const adSenseConfig = {
        channel: this.channelId,
        pubId: "partner-pub-1853000876464912",
        styleId: "3911226554",
        adsafe: "low",
        ignoredPageParams,
        relatedSearchTargeting: "content",
        resultsPageBaseUrl: `${window.location.origin}/search/?afs&channel=${this.channelId}${
          clickId && `&click_id=${clickId}`
        }`,
        resultsPageQueryParam: "query",
        terms: terms || this.newInfo.terms,
        referrerAdCreative: terms || this.newInfo.referrer_ad_creative,
        ivt: false,
        adtest: "off"
      };
      // 初始化 _googCsa 并加载相关搜索广告
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1", // 广告容器 ID
        relatedSearches: 10, // 相关搜索广告数量
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          console.log("adLoadedCallback", loaded, response, isExperimentVariant, callbackOptions);
          if (response) {
            // eslint-disable-next-line no-undef
            window.pushEventParamsToGtm("C_AC");
            try {
              let numberOfKeys = 0;
              let concatenatedKeys = "miss";
              if (callbackOptions.termPositions) {
                const keys = Object.keys(callbackOptions.termPositions);
                numberOfKeys = keys.length;
                concatenatedKeys = keys.join(",");
              }
              const element = document.getElementById("master-1");
              const height = parseFloat(element.style.height);
              const result = Math.round(height / 105);

              // eslint-disable-next-line no-undef
              dataLayer.push({
                event: "C_AC_IN",
                num: result,
                key1: numberOfKeys,
                key2: concatenatedKeys
              }); // 事件推送到 dataLayer
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    },
    addAdSenseScript2() {
      console.log("addAdSenseScript", this.newInfo.terms);
      // 获取 URL 查询参数
      const searchParams = new URLSearchParams(window.location.search);
      const clickId = searchParams.has("click_id") ? searchParams.get("click_id") : "";
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      terms = terms.replace(/[，]/g, ",");
      const paramKeys = [];
      // 遍历查询参数并将其添加到 paramKeys 数组中
      for (const param of searchParams) {
        paramKeys.push(param[0]);
      }
      const ignoredPageParams = paramKeys.join(",");

      const adSenseConfig = {
        channel: this.channelId,
        pubId: "partner-pub-1853000876464912",
        styleId: "3911226554",
        adsafe: "low",
        ignoredPageParams,
        relatedSearchTargeting: "query",
        query: terms ? terms.split(",")[0] : this.newInfo.terms.split(",")[0],
        ivt: false,
        resultsPageBaseUrl: `${window.location.origin}/search/?afs&channel=${this.channelId}${
          clickId && `&click_id=${clickId}`
        }`,
        resultsPageQueryParam: "query"
      };

      // 初始化 _googCsa 并加载相关搜索广告
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1", // 广告容器 ID
        relatedSearches: 10, // 相关搜索广告数量
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          console.log("adLoadedCallback", loaded, response, isExperimentVariant, callbackOptions);
          if (response) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "C_AC" }); // 事件推送到 dataLayer
            try {
              let numberOfKeys = 0;
              let concatenatedKeys = "miss";
              if (callbackOptions.termPositions) {
                const keys = Object.keys(callbackOptions.termPositions);
                numberOfKeys = keys.length;
                concatenatedKeys = keys.join(",");
              }
              const element = document.getElementById("master-1");
              const height = parseFloat(element.style.height);
              const result = Math.round(height / 105);

              // eslint-disable-next-line no-undef
              dataLayer.push({
                event: "C_AC_IN",
                num: result,
                key1: numberOfKeys,
                key2: concatenatedKeys
              }); // 事件推送到 dataLayer
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.article-img {
  width: 100%;
  margin-bottom: 1em;
}
.article {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
  min-height: calc(100vh - 72px - 56px - 64px);
}
.article-title {
  font-size: 26px;
  font-family: "rssb";
  font-weight: bold;
  line-height: 30px;
  margin-bottom: 24px;
}
.read-more {
  line-height: 4;
}
.hide {
  display: none;
  &.show {
    display: block;
  }
}
.news-box-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.google-ad-preload {
  margin-bottom: 4px;
}
@media screen and (max-width: 750px) {
  .news-box-2 {
    display: flex;
    flex-wrap: wrap;
    gap: vw(32);
  }
  .article {
    line-height: vw(38);
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
    min-height: calc(100vh - vw(304));
  }
  .article-title {
    font-size: vw(40);
    line-height: vw(56);
    margin-bottom: vw(32);
  }
  .article-desc {
    margin-bottom: vw(48);
  }
  .google-ad-preload {
    margin-bottom: vw(10);
  }
}
</style>
