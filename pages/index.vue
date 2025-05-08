<template>
  <div class="page home-page">
    <Header />
    <main class="main">
      <section class="home-search">
        <div class="search-group">
          <input
            v-model="input"
            placeholder="Search..."
            class="search"
            name="search"
            @keyup.enter="search"
          />
          <i v-show="input != ''" class="icon-clear" @click="clear"></i>
          <i class="icon-search" @click="search"></i>
        </div>
        <!-- <div class="rec-keywords">
          <p
            v-for="(item, i) in recKeywords"
            :key="i"
            @click="handleSearchRecKeyword(item)"
            class="keyword-item"
          >
            {{ item }}
          </p>
        </div> -->
      </section>

      <section v-swiper:mySwiper="swiperOption" class="swiper-box">
        <div class="swiper-wrapper">
          <news-item-1 v-for="(item, i) in recNews.list" :key="i" class="swiper-slide" :item="item">
          </news-item-1>
        </div>
      </section>

      <h2 class="title-h2">Trending</h2>
      <section class="news-box-2">
        <news-item-2 v-for="(item, i) in trendingNews.list" :key="i" :item="item"> </news-item-2>
      </section>

      <h2 class="title-h2">All Articles</h2>
      <InfiniteScrollList :initial-items="allNews.list" class="news-box-2">
        <template #default="{ items }">
          <news-item-2 v-for="(item, i) in items" :key="i" :item="item"> </news-item-2>
        </template>
      </InfiniteScrollList>
    </main>
    <Footer />
  </div>
</template>

<script>
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.min.css";
import { simulateAFSSearch } from "~/utils/utils";

export default {
  directives: {
    swiper: directive
  },
  async asyncData({ $axios, env }) {
    try {
      // 并行处理多个异步请求
      const [recNewsResponse, trendingNewsResponse, allNewsResponse] = await Promise.all([
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "rec"
          }
        }),
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "trending",
            size: 10
          }
        }),
        $axios.$get("/api/article/menu", {
          params: {
            site_id: env.SITE_ID,
            mod_id: "all",
            size: 10
          }
        })
      ]);

      // 返回多个接口的数据
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        allNews: allNewsResponse
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        autoplay: {
          delay: 3000
        }
      },
      input: "",
      recKeywords: this.$recKeywords // 站点推荐关键字
    };
  },

  methods: {
    search() {
      if (this.input.length < 1) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 1 characters",
          type: "warning"
        });
        return;
      }
      // try {
      //   bge("event", "ec_register", { configId: "904803718856417024" });
      // } catch (error) {
      //   console.error("Error tracking search event:", error);
      // }

      simulateAFSSearch(this.input);
    },
    clear() {
      this.input = "";
    }
    // handleSearchRecKeyword(keyword) {
    //   this.input = keyword;
    //   simulateAFSSearch(keyword);
    // }
  }
};
</script>
<style lang="scss" scoped>
.main {
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.home-search {
  width: 100%;
  height: 315px;
  background-image: url("~/assets/images/bg-pc.webp");
  background-size: cover;
  margin-bottom: 32px;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  .search-group {
    position: relative;
    margin: 119px 0 16px;
  }
  .search {
    width: 560px;
    height: 48px;
    background: rgba(#ffffff, 0.9);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0);
    border-radius: 48px 48px 48px 48px;
    padding-left: 16px;
    padding-right: 80px;
    font-size: 14px;
    &::placeholder {
      color: rgba($font1, 0.4);
    }
  }
  .icon-search {
    display: block;
    position: absolute;
    right: -1px;
    top: 0;
    cursor: pointer;
    border-radius: 0 48px 48px 0;
    @include btn-img(56px, 48px, "icon-search.png");
    background-size: 24px 24px;
    &::before {
      content: "";
      display: inline-block;
      width: 1px;
      height: 16px;
      background: rgba(#000, 0.1);
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .icon-clear {
    position: absolute;
    right: 66px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background-image: url("~/assets/images/icon-clear.png");
    width: 16px;
    height: 16px;
    background-size: cover;
  }
  .rec-keywords {
    width: 560px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    @include scroll;
  }
  .keyword-item {
    white-space: nowrap;
    margin-right: 16px;
    font-size: 12px;
    line-height: 16px;
    color: $font2;
    cursor: pointer;
    &:before {
      content: ">";
      color: rgba($font2, 0.5);
    }
  }
}
.swiper-slide {
  width: 282px;
  border-radius: 16px;
  border: 1px solid #ececee;
  margin-right: 24px;
  overflow: hidden;
}
.news-box-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media screen and (max-width: 1100px) {
  .news-box-2 {
    display: flex;
    flex-wrap: wrap;
  }
}
@media screen and (max-width: 750px) {
  .main {
    padding-bottom: vw(32);
    border-bottom: none;
  }

  .home-search {
    width: 100vw;
    height: vw(400);
    background-image: url("~/assets/images/bg-m.webp");
    margin-bottom: vw(48);
    margin-left: vw(-46);
    margin-top: vw(-1);
    .search-group {
      margin: vw(132) 0 vw(24);
    }
    .search {
      width: vw(658);
      height: vw(80);
      box-shadow: 0 0 vw(16) 0 rgba(0, 0, 0, 0);
      border-radius: vw(96);
      padding-left: vw(34);
      padding-right: vw(160);
      font-size: vw(28);
    }
    .icon-search {
      width: vw(112);
      height: vw(80);
      border-radius: 0 vw(96) vw(96) 0;
      background-size: vw(48);
      &::before {
        height: vw(32);
      }
    }
    .icon-clear {
      right: vw(132);
      width: vw(32);
      height: vw(32);
    }
    .rec-keywords {
      width: 100vw;
      padding-left: vw(46);
    }
    .keyword-item {
      margin-right: vw(32);
      font-size: vw(24);
      line-height: vw(28);
    }
  }
  .swiper-box {
    width: 100vw;
    margin-left: vw(-46);
    padding-left: vw(23);
  }
  .swiper-slide {
    width: vw(480);
    border-radius: vw(32);
    border: vw(2) solid #ececee;
    margin-right: vw(32);
  }
  .news-box-2 {
    gap: vw(32);
  }
}
</style>
