<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      maxScrollPercentage: 0
    };
  },
  head() {
    return {
      htmlAttrs: {
        lang: "en"
      },
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Searchofeeds",
            url: "https://www.searchofeeds.com/",
            logo: "https://bunchthings.com/site-logo/searchofeeds/searchofeeds-logo-144.png",
            sameAs: this.$sameAs || [],
            ContactPoint: [],
            parentOrganization: {}
          }
        },
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Searchofeeds",
            url: "https://www.searchofeeds.com/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.searchofeeds.com/search/?query={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        }
      ],
      link: [
        {
          rel: "canonical",
          hid: "canonical",
          href: `https://www.searchofeeds.com${this.$nuxt.context.route.path}`
        }
      ]
    };
  },
  mounted() {
    this.getTTClid();
    this.handleListenerScroll();
  },
  methods: {
    getTTClid() {
      try {
        const ttclid = this.$route.query.ttclid;
        if (ttclid) {
          window.setCookie && window.setCookie("hi_ttclid", ttclid);
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleListenerScroll() {
      const self = this;
      window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const currentScrollPercentage =
          scrollHeight > clientHeight
            ? Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100).toFixed(0)
            : 0;
        if (Number(currentScrollPercentage) > Number(self.maxScrollPercentage)) {
          self.maxScrollPercentage = currentScrollPercentage;
        }
      });
      window.addEventListener("beforeunload", () => {
        const hi_user_source =
          window.getValueByURLOrCookie && window.getValueByURLOrCookie("hi_source");
        if (hi_user_source === "unknown") {
          this.handleFormatSEO(this.maxScrollPercentage);
        }
        if (window.dataLayer) {
          window.dataLayer.push({
            event: "scroll_depth",
            hi_depth: this.handleFormat(this.maxScrollPercentage)
          });
        }
      });
    },
    handleFormat(val) {
      if (val === 0) {
        return "0%";
      } else if (val <= 20 && val > 0) {
        return "1_20%";
      } else if (val >= 80) {
        return "81_100%";
      } else {
        return `${Math.floor(val / 20) * 2}1_${Math.floor(val / 20) * 2 + 2}0%`;
      }
    },
    handleFormatSEO(val) {
      if (!window.dataLayer) return;
      if (val < 25) {
        window.dataLayer.push({ event: "Scroll_Depth_Less_25%_SEO" });
      } else if (val >= 25 && val < 50) {
        window.dataLayer.push({ event: "Scroll_Depth_25%_SEO" });
      } else if (val >= 50 && val < 75) {
        window.dataLayer.push({ event: "Scroll_Depth_50%_SEO" });
      } else {
        window.dataLayer.push({ event: "Scroll_Depth_75%_SEO" });
      }
    }
  }
};
</script>
