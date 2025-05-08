<template>
  <div class="page">
    <main class="main">
      <!-- <google-ad-small class="small-ad-1" ad-slot="1809420083" /> -->
      <section class="home-search">
        <div class="search-group">
          <input
            v-model="input"
            placeholder="Search Anything"
            class="search"
            name="search"
            @keyup.enter="search"
          />
          <i v-show="input != ''" class="icon-clear" @click="clear"></i>
          <i class="icon-search" @click="search"></i>
        </div>
      </section>
      <div id="relatedsearches1"> </div>
      <!-- <google-ad ad-slot="2955836717" /> -->
    </main>
    <Footer />
  </div>
</template>

<script>
import { simulateAFSSearch } from "~/utils/utils";

export default {
  data() {
    return {
      input: "" // 搜索输入
    };
  },
  mounted() {
    this.input = this.$route.query.userInput || "";
    this.input && this.searchTerms();
  },
  methods: {
    searchTerms() {
      try {
        this.addAdSenseScript(); // 添加 AdSense 脚本
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    addAdSenseScript() {
      // 获取 URL 查询参数
      const searchParams = new URLSearchParams(window.location.search);
      const channelId = searchParams.has("channel") ? searchParams.get("channel") : null;
      const clickId = searchParams.has("click_id") ? searchParams.get("click_id") : "";

      // 配置 AdSense 参数
      const adSenseConfig = {
        channel: channelId,
        pubId: "partner-pub-1853000876464912",
        styleId: "3911226554",
        adsafe: "low",
        resultsPageBaseUrl: `${
          window.location.origin
        }/search/?afs&from=content&partner_param=param&channel=${channelId}${
          clickId && `&click_id=${clickId}`
        }`,
        resultsPageQueryParam: "query",
        query: `${this.input}`,
        ivt: false,
        adtest: "off"
      };

      // 初始化 _googCsa 并加载相关搜索广告
      // eslint-disable-next-line no-undef
      _googCsa("relatedsearch", adSenseConfig, {
        container: "relatedsearches1", // 广告容器 ID
        relatedSearches: 18, // 相关搜索广告数量
        adLoadedCallback: function (loaded, response, isExperimentVariant, callbackOptions) {
          console.log("Ad loaded:", loaded, response, isExperimentVariant, callbackOptions);
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
    },
    search() {
      if (this.input.length < 1) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 1 characters",
          type: "warning"
        });
        return;
      }

      simulateAFSSearch(this.input);
    },
    clear() {
      this.input = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
}
.home-search {
  width: 100%;
  margin-bottom: 32px;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .search-group {
    position: relative;
  }
  .search {
    width: 560px;
    height: 48px;
    background: #ffffff;
    box-shadow: 14px 10px 28px -2px rgba(7, 51, 82, 0.36);
    // border: 1px solid #a3a3a3;
    border: 1px solid $color1;

    border-radius: 4px 4px 4px 4px;
    padding-left: 16px;
    padding-right: 126px;
    font-size: 12px;
    &::placeholder {
      color: rgba($font1, 0.6);
    }
  }
  .icon-search {
    display: block;
    position: absolute;
    top: 0px;
    right: -1px;
    width: 64px;
    height: 48px;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    // background-color: #ff9a22;
    background-image: url("~/assets/images/icon-search.png");
    background-size: 30px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .icon-clear {
    position: absolute;
    right: 76px;
    top: 12px;
    cursor: pointer;
    background-image: url("~/assets/images/icon-clear.png");
    width: 24px;
    height: 24px;
    background-size: cover;
  }

  .words-container {
    margin-top: 24px;
    width: 560px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
  }

  .marquee {
    display: flex;
    overflow: hidden;
    user-select: none;
    gap: 12px;
  }

  .marquee-group {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 12px;
    min-width: 100%;
    // animation: scrollLeft 40s linear infinite;
    justify-content: center;
  }
  .marquee:nth-child(even) {
    margin-left: calc(vw(176) / -2);
  }
  .hot-words {
    background: rgba(23, 23, 23, 0.35);
    border-radius: 4px 4px 4px 4px;
    padding: 6px 8px;
    font-family: "se3";
    font-size: 12px;
    color: #ffffff;
    text-align: left;
    cursor: pointer;
  }
}
.small-ad-1 {
  height: 100px;
  max-width: 980px;
  width: 100%;
  margin-bottom: 2em;
}
@media screen and (max-width: 750px) {
  .home-search {
    width: 100vw;
    margin-bottom: vw(38);
    margin-left: vw(-46);
    .search {
      width: vw(658);
      height: vw(80);
      border-radius: vw(8);
      padding-left: vw(34);
      font-size: vw(24);
      padding-right: vw(210);
    }
    .icon-search {
      width: vw(128);
      height: vw(80);
      border-radius: 0 vw(8) vw(8) 0;
      background-size: vw(48);
    }
    .icon-clear {
      top: vw(24);
      right: vw(144);
      width: vw(32);
      height: vw(32);
    }
    .words-container {
      margin-top: vw(16);
      width: 100%;
    }
    .hot-words {
      border-radius: vw(8);
      padding: vw(12) vw(16);
      font-size: vw(24);
    }
  }
  .small-ad-1 {
    display: block;
    height: vw(180);
    max-width: 100%;
    min-height: vw(180);
  }
}
</style>
