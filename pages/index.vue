<template>
  <div class="page home-page">
    <Header page-title="Global News &amp; Information" />
    <main class="main">
      <div class="layout-left">
        <section v-swiper:mySwiper="swiperOption" class="swiper-box">
          <div class="swiper-wrapper">
            <item-swiper-rec
              v-for="(item, i) in recNews && recNews.list"
              :key="i"
              class="swiper-slide"
              :item="item"
              :index="i"
            >
            </item-swiper-rec>
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </section>

        <h2 class="title-new-tag">Latest Articles</h2>
        <section class="news-box-new">
          <item-text-new v-for="(item, i) in trendingNews && trendingNews.list" :key="i" :item="item">
          </item-text-new>
        </section>

        <div v-for="(items, index) in categoryList" class="category-box" :key="items.id">
          <h2 class="title-h2">{{ items.seo_category && items.seo_category.name }}</h2>
          <section>
            <div class="news-box-2">
              <news-item-2 v-for="(item, i) in items && items.list" :key="i" :item="item" :index="index">
              </news-item-2>
            </div>
          </section>
        </div>
      </div>
      <div class="layout-right">
        <right-side-box :rec-news="trendingNews && trendingNews.list || []" :trending-news="recNews && recNews.list || []" />
      </div>
    </main>
    <FooterSeo />
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
      const [recNewsResponse, trendingNewsResponse, categoryResponse] =
        await Promise.all([
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
          }),
          $axios.$get("/api/article/get_all_seo_category", {
            params: {
              site_id: env.SITE_ID
            }
          }).catch(() => null)
        ]);
      let category = [];
      if (categoryResponse && categoryResponse.list) {
        categoryResponse.list.map((item) => {
          category.push(
            $axios.$get("/api/article/get_seo_category_page", {
              params: {
                site_id: env.SITE_ID,
                seo_category_id: item.id,
                size: 4,
                page: 1
              }
            })
          );
        });
      }
      let list = await Promise.all(category);
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        categoryList: list && list.filter((item) => item != null)
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        recNews: null,
        trendingNews: null,
        categoryList: []
      };
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      input: ""
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
  padding-bottom: 32px;
  border-bottom: 1px solid #ececee;
}
.category-box {
  display: flex;
  flex-direction: column;
  gap: 0px;
}
.swiper-box {
  position: relative;
  overflow: hidden;
  .swiper-button-prev {
    top: 209px;
    width: 50px;
    height: 50px;
    background-color: $color1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:after {
      content: "";
      display: block;
      width: 12px;
      height: 12px;
      border-top: 2px solid #fff;
      border-left: 2px solid #fff;
      transform: rotate(-45deg);
      margin-left: 4px;
    }
  }
  .swiper-button-next {
    top: 209px;
    width: 50px;
    height: 50px;
    background-color: $color1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:after {
      content: "";
      display: block;
      width: 12px;
      height: 12px;
      border-top: 2px solid #fff;
      border-right: 2px solid #fff;
      transform: rotate(45deg);
      margin-right: 4px;
    }
  }
}
.news-box-2 {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.swiper-slide {
  overflow: hidden;
}
.news-box-new {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media screen and (max-width: 750px) {
  .main {
    padding-bottom: vw(32);
    border-bottom: none;
  }
  .swiper-box {
    margin-top: vw(32);
    width: 100%;
    .swiper-button-prev {
      top: vw(186);
      width: vw(64);
      height: vw(64);
      background-color: $color1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:after {
        content: "";
        display: block;
        width: vw(16);
        height: vw(16);
        border-top: 2px solid #fff;
        border-left: 2px solid #fff;
        transform: rotate(-45deg);
        margin-left: vw(4);
      }
    }
    .swiper-button-next {
      top: vw(186);
      width: vw(64);
      height: vw(64);
      background-color: $color1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      &:after {
        content: "";
        display: block;
        width: vw(16);
        height: vw(16);
        border-top: 2px solid #fff;
        border-right: 2px solid #fff;
        transform: rotate(45deg);
        margin-right: vw(4);
      }
    }
  }
  .swiper-slide {
    width: 100%;
    height: vw(764);
  }
  .news-box-2 {
    gap: vw(28) vw(14);
  }
  .news-box-new {
    grid-template-columns: repeat(1, 1fr);
    gap: vw(20);
  }
}
</style>
