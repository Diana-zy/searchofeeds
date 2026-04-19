<template>
  <div class="page">
    <Header />
    <main>
      <div class="layout-left">
        <common-page-label :title="`Search Results for &quot;${input}&quot;`" />
        <div id="afscontainer1"> </div>
        <div id="relatedsearches1"> </div>
        <h3 class="title-h3">{{ searchTitle }}</h3>
        <section>
          <item-search-result v-for="(item, i) in searchResultNews" :key="i" :item="item">
          </item-search-result>
        </section>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="trendingNews && trendingNews.list || []" :trending-news="recNews && recNews.list || []" />
      </div>
    </main>
    <FooterSeo />
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, env }) {
    try {
      const [recNewsResponse, trendingNewsResponse] = await Promise.all([
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "rec"
          }
        }),
        $axios.$get("/api/article/get_all_articles", {
          params: {
            site_id: env.SITE_ID,
            size: 4,
            page: 1
          }
        })
      ]);
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        recNews: null,
        trendingNews: null
      };
    }
  },
  data() {
    return {
      searchResultNews: [],
      input: "",
      channelId: "",
      isShowResults: false
    };
  },
  computed: {
    searchTitle() {
      return this.isShowResults
        ? `Found ${this.searchResultNews.length} results for "${this.input}"`
        : "Searching...";
    }
  },
  mounted() {
    if (
      !window.getCookie("first") &&
      window.getCookie("mounted") &&
      window.getCookie("query_ad") &&
      window.getCookie("click_ad")
    ) {
      window.setCookie("first", 3, 1);
    }
    if (window.getDetailIsClickAc && window.getDetailIsClickAc()) {
      window.dataLayer && window.dataLayer.push({ event: "S_PL" });
    }

    const searchParams = new URLSearchParams(window.location.search);
    this.channelId = searchParams.has("channel") ? searchParams.get("channel") : "";

    this.input = this.$route.query.query || "";
    this.input && this.addAdSense();
    this.input && this.searchNews();
  },
  methods: {
    addAdSense() {
      setTimeout(() => {
        if (this.$route.query.from && this.$route.query.from.includes("detail")) {
          const buffer = window.getCookie && window.getCookie("first");
          if (buffer && buffer !== "ok") {
            window.pushEventParamsToGtm && window.pushEventParamsToGtm("Q_AR");
            window.trackEventToPixel && window.trackEventToPixel("Q_AR");
            this.addAdSenseScript();
            if (Number(buffer) > 1) {
              window.setCookie && window.setCookie("first", Number(buffer) - 1, 1);
            } else {
              window.setCookie && window.setCookie("first", "ok", 1);
            }
          }
        } else {
          if (window.pushEventParamsToGtm) window.pushEventParamsToGtm("Q_AR");
          if (window.trackEventToPixel) window.trackEventToPixel("Q_AR");
          this.addAdSenseScript();
        }
      }, 0);
    },
    async searchNews() {
      try {
        const response = await this.$axios.$post("/api/article/search", {
          site_id: process.env.SITE_ID,
          key: this.input
        });
        this.searchResultNews = response.list;
        this.isShowResults = true;
      } catch (error) {
        this.isShowResults = true;
        console.error("Error fetching data:", error);
      }
    },
    addAdSenseScript() {
      const queryString = this.input;
      const channelId = window.getParam && window.getParam("channel");
      const from = window.getParam && window.getParam("from");
      const hiSource = window.getParam && window.getParam("hi_source");
      const hiPc = window.getParam && window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl && window.getResultsPageUrl({
        channel: channelId,
        from,
        hi_source: hiSource,
        hi_pc: hiPc
      });
      const ttclid = (window.getParam && window.getParam("ttclid")) || (window.getCookie && window.getCookie("hi_ttclid"));
      const tblci = (window.getParam && window.getParam("tblci")) || (window.getCookie && window.getCookie("hi_tblci"));
      const dicbo = (window.getParam && window.getParam("dicbo")) || (window.getCookie && window.getCookie("hi_dicbo"));
      let scid = "unknown";
      if (hiSource === "tiktok") {
        scid = ttclid || "unknown";
      } else if (hiSource === "taboola") {
        scid = tblci || "unknown";
      } else if (hiSource === "outbrain") {
        scid = dicbo || "unknown";
      }

      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-1853000876464912",
        query: queryString,
        styleId: "3911226554",
        adsafe: "low",
        ivt: false,
        resultsPageBaseUrl,
        resultsPageQueryParam: "query"
      };

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
        clicktrackUrl: `https://api.tapmygame.com/api/ct/afsct?cid=${channelId}&hi_source=${hiSource}&scid=${scid}&cc=${window.youknowwho_ip_country || "unknown"}&site_id=searchofeeds`,
        adLoadedCallback: (loaded, e) => {
          if (e) {
            window.trackEventToPixel && window.trackEventToPixel("C_AR");
            window.pushEventParamsToGtm && window.pushEventParamsToGtm("C_AR");
            if (window.getDetailIsClickAc && window.getDetailIsClickAc()) {
              window.dataLayer && window.dataLayer.push({ event: "C_AR_C" });
            }
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
            // eslint-disable-next-line no-undef
            dataLayer.push({ event: "FF_AR", query: queryString });
          }
        }
      };

      const rsblock1 = {
        container: "relatedsearches1",
        relatedSearches: 5,
        adLoadedCallback: adLoadedCallback("C_AC", { query: queryString })
      };

      // eslint-disable-next-line no-undef
      _googCsa("ads", adSenseConfig, adblock1, rsblock1);
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.title-h3 {
  color: $font4;
}
@media screen and (max-width: 750px) {
  main {
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
  }
}
</style>
