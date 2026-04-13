<template>
  <div class="page">
    <Header />
    <main class="main">
      <div class="layout-left">
        <div class="page-layout">
          <breadcrumb :info="newInfo"></breadcrumb>
          <article class="article" v-if="newInfo">
            <h1 class="article-title">{{ newInfo.name }}</h1>
            <div class="news-author">
              <div>{{ newInfo.author && newInfo.author.name }}</div>
              <div>{{ newInfo.updated_at }}</div>
            </div>
            <div class="news-detail first_paragraph">{{ newInfo.first_paragraph }}</div>

            <!-- Article Summary Box -->
            <div class="article-summary" v-if="newInfo.seo_desc">
              <div class="summary-header">
                <div class="summary-icon">📋</div>
                <h3 class="summary-title">Article Summary</h3>
              </div>
              <p class="summary-text">{{ newInfo.seo_desc }}</p>
            </div>

            <aside class="toc-container" v-if="toc.length">
              <h3 class="toc-title">Table of Contents</h3>
              <nav class="toc-nav">
                <ul class="toc-list">
                  <li
                    v-for="item in toc"
                    :key="item.id"
                    :class="['toc-item', `toc-level-${item.level}`]"
                    @click="scrollToAnchor(item.id)"
                  >
                    {{ item.text }}
                  </li>
                </ul>
              </nav>
            </aside>
            <div id="relatedsearches1"> </div>
            <NuxtImg
              format="auto"
              fit="cover"
              width="600"
              :src="newInfo.cover"
              :alt="newInfo.cover_seo_alt || newInfo.name"
              class="article-img"
              preload
            />
            <!-- eslint-disable vue/no-v-html -->
            <div class="news-detail" v-html="htmlWithAnchor"></div>
            <!--eslint-enable-->

            <!-- FAQ Section -->
            <section class="faq-section" v-if="articleFaqs && articleFaqs.length">
              <h2 class="faq-title">Related Questions</h2>
              <div class="faq-list">
                <div v-for="(faq, index) in articleFaqs" :key="index" class="faq-item">
                  <h3 class="faq-question">{{ faq.question }}</h3>
                  <p class="faq-answer">{{ faq.answer }}</p>
                </div>
              </div>
            </section>
          </article>
          <section v-if="newInfo && newInfo.related_articles && newInfo.related_articles.length">
            <h3 class="title-h2">Related Articles</h3>
            <div class="related-articles">
              <news-item-5 v-for="(item, i) in newInfo.related_articles" :key="i" :item="item">
              </news-item-5>
            </div>
          </section>
        </div>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="recNews" :trending-news="trendingNews" />
      </div>
    </main>
    <footer-seo :info="newInfo || {}" />
  </div>
</template>

<script>
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
        // 301 redirect to SEO URL /{category}/{slug}/
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

      data.content = data.content.replace(/font-family:\s*['"]? 宋体 ['"]?;/g, "");
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
    setTimeout(() => {
      this.newInfo && this.newInfo.no_entry !== 1 && this.addAdSenseScript();
    }, 0);
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

      const channelId = window.getParam && window.getParam("channel");
      const hiSource = window.getParam && window.getParam("hi_source");
      const hiPc = window.getParam && window.getParam("hi_pc");
      const resultsPageBaseUrl = window.getResultsPageUrl && window.getResultsPageUrl({
        channel: channelId,
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
</script>

<style lang="scss" scoped>
.article-img {
  width: 100%;
  margin-bottom: 1em;
}
.article {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.article-title {
  font-size: 26px;
  font-family: "rssb";
  font-weight: bold;
  line-height: 30px;
  margin-bottom: 24px;
}
.news-author {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: rgba($font1, 0.6);
}
.article-summary {
  margin: 24px 0 8px;
  padding: 16px 20px;
  background: rgba($color1, 0.05);
  border-left: 4px solid $color1;
  border-radius: 4px;
  .summary-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    .summary-icon {
      font-size: 18px;
    }
    .summary-title {
      font-size: 16px;
      font-weight: bold;
      color: $font1;
    }
  }
  .summary-text {
    font-size: 15px;
    line-height: 1.6;
    color: rgba($font1, 0.8);
  }
}
.toc-container {
  margin: 8px 0 24px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  .toc-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
    color: $font1;
  }
  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .toc-item {
    padding: 4px 0;
    cursor: pointer;
    font-size: 14px;
    color: $color1;
    line-height: 1.5;
    &:hover {
      text-decoration: underline;
    }
    &.toc-level-2 {
      padding-left: 0;
    }
    &.toc-level-3 {
      padding-left: 16px;
    }
  }
}
.related-articles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media screen and (max-width: 750px) {
  .article {
    line-height: vw(38);
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
  }
  .article-title {
    font-size: vw(40);
    line-height: vw(56);
    margin-bottom: vw(32);
  }
  .related-articles {
    grid-template-columns: repeat(1, 1fr);
    gap: vw(32);
  }
}
</style>
