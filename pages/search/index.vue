<template>
  <div v-show="!hide" class="page">
    <Header v-if="!subdomain" />
    <main class="main">
      <div id="relatedsearches1"> </div>
      <div id="afscontainer1"> </div>
      <!-- <google-ad-preload
        v-if="noAd"
        title="Non-search result Ad"
        ad-slot="6864443826"
      ></google-ad-preload>
      <google-ad-preload
        v-if="noAd2"
        title="Non-search result Ad"
        ad-slot="5519572568"
      ></google-ad-preload> -->
      <div id="relatedstyle2"> </div>
      <div id="relatedsearches2"> </div>
      <h3 class="title-h3">Web Results</h3>
      <section class="news-box-3">
        <news-item-3 v-for="(item, i) in news" :key="i" :item="item"> </news-item-3>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
export default {
  data() {
    return {
      news: [], // 新闻列表
      input: "", // 搜索输入
      channelId: "",
      subdomain: false,
      hide: true,
      noAd: false,
      noAd2: false
    };
  },
  mounted() {
    window.location.hostname.includes("s.") && (this.subdomain = true);
    this.hide = false;

    this.input = this.$route.query.query || "";
    this.input && this.addAdSense();
    this.input && this.searchNews();
  },
  methods: {
    addAdSense() {
      setTimeout(() => {
        this.addAdSenseScript();
      }, 0);
    },
    async searchNews() {
      try {
        const response = await this.$axios.$post("/api/article/search", {
          site_id: process.env.SITE_ID,
          key: this.input
        });

        this.news = response.list;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    addAdSenseScript() {
      const queryString = this.input;
      const searchParams = new URLSearchParams(window.location.search);

      // 获取 URL 查询参数的工具函数
      const getParam = (key) => (searchParams.has(key) ? searchParams.get(key) : "");

      const from = getParam("from");
      const channelId = getParam("channel");

      // 配置 AdSense 参数
      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-1853000876464912",
        query: queryString,
        styleId: "3911226554",
        adsafe: "low",
        ivt: false,
        resultsPageBaseUrl: `${window.location.origin}/search/?afs&channel=${channelId}${
          from ? `&from=${from}` : ""
        }`,
        resultsPageQueryParam: "query"
      };

      // AdSense 加载回调函数
      const adLoadedCallback =
        (eventName, additionalData = {}) =>
        (loaded, response) => {
          if (response) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: eventName, ...additionalData });
          }
        };

      const adblock1 = {
        container: "afscontainer1",
        number: 8,
        adLoadedCallback: (loaded, e) => {
          if (e) {
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "C_AR" });
            try {
              const element = document.getElementById("master-1");
              const height = parseFloat(element.style.height);
              const result = Math.round(height / 456);
              // eslint-disable-next-line no-undef
              dataLayer.push({ event: "C_AR_IN", num: result, query: queryString });
            } catch (error) {
              console.error(error);
            }
          } else {
            this.noAd = true;
            setTimeout(() => {
              this.noAd2 = true;
            }, 50);
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "FF_AR", query: queryString });
          }
        }
      };

      // 根据来源配置 rsblock1
      const rsblock1 = (() => {
        const baseConfig = {
          container: "",
          relatedSearches: 0,
          adLoadedCallback: adLoadedCallback("C_AC", { query: queryString })
        };

        // if (from === "home" || from === "content") {
        //   baseConfig.container = this.subdomain ? "relatedsearches2" : "relatedsearches1";
        //   baseConfig.relatedSearches = this.subdomain ? 5 : 4;
        // } else {
        //   baseConfig.container = "relatedstyle2";
        //   baseConfig.relatedSearches = 6;
        // }

        baseConfig.container = "relatedstyle2";
        baseConfig.relatedSearches = 6;

        return baseConfig;
      })();

      // 加载 Google AdSense
      // eslint-disable-next-line no-undef
      _googCsa("ads", adSenseConfig, adblock1, rsblock1);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}

@media screen and (max-width: 750px) {
  .main {
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
  }
}
</style>
