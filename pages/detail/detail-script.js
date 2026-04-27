import { shuffleArray } from "../../utils/utils";
import Breadcrumb from "../../components/Breadcrumb";
import { processHtmlWithToc, generateNestedToc } from "../../utils/cheerio-toc.js";

export default {
  components: { Breadcrumb },
  async asyncData({ $axios, params, env, redirect, query }) {
    const slug = params.detail;
    const lastDashIndex = slug.lastIndexOf("-");
    const id = slug.substring(lastDashIndex + 1, slug.length);

    try {
      let data = null;
      try {
        data = await $axios.$get("/api/article/detail", {
          params: {
            site_id: env.SITE_ID,
            article_id: id,
            related_num: 3
          }
        });
        if (data && data.path_v2) {
          const qs = Object.keys(query || {}).length
            ? "?" + new URLSearchParams(query).toString()
            : "";
          redirect(301, `/${data.path_v2}/${qs}`);
          return {};
        }
      } catch (detailError) {
        console.error(`Failed to fetch detail for ID ${id}:`, detailError);
        return {
          newInfo: null,
          floatArray: [],
          toc: [],
          id,
          htmlWithAnchor: "",
          recNews: [],
          trendingNews: [],
          articleFaqs: []
        };
      }

      if (!data || !data.content) {
        return {
          newInfo: null,
          floatArray: [],
          toc: [],
          id,
          htmlWithAnchor: "",
          recNews: [],
          trendingNews: [],
          articleFaqs: []
        };
      }

      let recNewsResponse = null;
      let trendingNewsResponse = null;
      let allResponse = null;

      try {
        [recNewsResponse, trendingNewsResponse, allResponse] = await Promise.all([
          $axios.$get("/api/article/menu", {
            params: { site_id: env.SITE_ID, mod_id: "rec" }
          }).catch(() => null),
          $axios.$get("/api/article/get_all_articles", {
            params: { site_id: env.SITE_ID, size: 4, page: 1 }
          }).catch(() => null),
          $axios.$get("/api/article/menu", {
            params: { site_id: env.SITE_ID, mod_id: "all", page: 1, size: 20 }
          }).catch(() => null)
        ]);
      } catch (error) {
        console.error("Parallel fetch error:", error);
      }

      const extractList = (response) => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (response.list) return response.list;
        if (response.data && response.data.list) return response.data.list;
        if (response.data && Array.isArray(response.data)) return response.data;
        if (response.items) return response.items;
        if (response.result) return response.result;
        return [];
      };

      data.content = data.content.replace(/font-family:\s*['"\s]*宋体['"\s]*;/g, "");
      data.content = data.content.replace(/<\/h4><p><br><br>|<br><br><\/p><h4>/g, (match) => {
        return match.includes("</h4><p>") ? "</h4><p>" : "</p><h4>";
      });

      const { toc: flatToc, htmlWithAnchor } = processHtmlWithToc(data.content, [2]);
      const toc = generateNestedToc(flatToc);

      const articleFaqs = data.faqs || [
        {
          question: "Want to learn more about this topic?",
          answer: "Searchofeeds covers the latest news and information across politics, economy, technology, culture, sports, and more."
        },
        {
          question: "Where can I find more related articles?",
          answer: "Browse our category pages to find more articles on topics that interest you."
        }
      ];

      return {
        newInfo: data,
        floatArray: shuffleArray((allResponse && allResponse.list && allResponse.list.slice()) || []),
        toc,
        id,
        htmlWithAnchor,
        recNews: extractList(recNewsResponse),
        trendingNews: extractList(trendingNewsResponse),
        articleFaqs
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        newInfo: null,
        floatArray: [],
        toc: [],
        id,
        htmlWithAnchor: "",
        recNews: [],
        trendingNews: [],
        articleFaqs: []
      };
    }
  },
  data() {
    return {
      channelId: ""
    };
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.newInfo && this.newInfo.language
      },
      title: this.newInfo && this.newInfo.name ? this.newInfo.name + " - Searchofeeds" : "Searchofeeds",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.newInfo && this.newInfo.seo_desc
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.newInfo && this.newInfo.terms
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.newInfo && this.newInfo.seo_title
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.newInfo && this.newInfo.seo_desc
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `https://searchofeeds.com/detail/${this.newInfo && this.newInfo.path}/`
        },
        {
          hid: "og:locale",
          property: "og:locale",
          content: this.newInfo && this.newInfo.language
        },
        {
          hid: "og:image",
          property: "og:image",
          content: `https://bunchthings.com/cdn-cgi/image/w=600,f=auto,fit=cover/${this.newInfo && this.newInfo.cover}`
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "article"
        }
      ],
      link: [
        {
          rel: "canonical",
          href: `https://searchofeeds.com/detail/${this.newInfo && this.newInfo.path}/`
        }
      ]
    };
  },
  mounted() {
    window.setCookie && window.setCookie("mounted", 1);
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("channel")) {
      this.channelId = searchParams.get("channel");
    } else {
      this.channelId = (this.newInfo && this.newInfo.channel) || "";
      if (this.channelId !== "") {
        searchParams.set("channel", this.channelId);
        const newUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }
    this.$nextTick(() => {
      this.newInfo && this.newInfo.no_entry !== 1 && this.addAdSenseScript();
    });
  },
  methods: {
    scrollToAnchor(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    addAdSenseScript() {
      const searchParams = new URLSearchParams(window.location.search);
      let terms = searchParams.has("terms") ? searchParams.get("terms") : "";
      terms = terms.replace(/[，]/g, ",");
      let headline = searchParams.has("headline") ? searchParams.get("headline") : "";
      if (headline === "{title}" || headline === "{{ad_title}}") {
        headline = "";
      }

      const paramKeys = [];
      for (const param of searchParams) {
        paramKeys.push(param[0]);
      }
      const ignoredPageParams = paramKeys.join(",");

      const hiSource = window.getParam && window.getParam("hi_source");
      const hiPc = window.getParam && window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl && window.getResultsPageUrl({
        channel: this.channelId,
        from: "detail",
        hi_source: hiSource,
        hi_pc: hiPc
      });
      const adSenseConfig = {
        channel: this.channelId,
        pubId: "partner-pub-1853000876464912",
        styleId: "3911226554",
        adsafe: "low",
        ignoredPageParams,
        relatedSearchTargeting: "content",
        resultsPageBaseUrl,
        resultsPageQueryParam: "query",
        terms: terms || (this.newInfo && this.newInfo.terms),
        referrerAdCreative: headline || terms || (this.newInfo && this.newInfo.referrer_ad_creative),
        ivt: false,
        adtest: "off"
      };
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1",
        relatedSearches: 10,
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          console.log("adLoadedCallback", loaded, response, isExperimentVariant, callbackOptions);
          if (response) {
            window.trackEventToPixel && window.trackEventToPixel("D_C_AC");
            window.pushEventParamsToGtm && window.pushEventParamsToGtm("C_AC");
            window.setCookie && window.setCookie("query_ad", 1);
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
              });
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    }
  }
};
