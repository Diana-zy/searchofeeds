<template>
  <div class="page">
    <Header />
    <main class="main">
      <div class="layout-left">
        <breadcrumb
          :info="{
            category_id: id,
            category_locale_name: categoryInfo && categoryInfo.seo_category && categoryInfo.seo_category.name
          }"
          isCategory
        ></breadcrumb>
        <common-page-label
          :title="`${capitalizeFirstLetter(categoryInfo && categoryInfo.seo_category && categoryInfo.seo_category.name)} - Articles`"
        />
        <section>
          <InfiniteLoadList
            api-endpoint="/api/article/get_seo_category_page"
            :initial-page="2"
            :page-size="10"
            :showMore="false"
            :query="{
              seo_category_id: id
            }"
            :initial-items="categoryInfo && categoryInfo.list"
            class="news-box-4"
          >
            <template #default="{ items }">
              <news-item-4
                v-for="(item, index) in items"
                :key="index"
                :index="index"
                :item="item"
              />
            </template>
          </InfiniteLoadList>
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
import { capitalizeFirstLetter } from "~/utils/utils";

export default {
  async asyncData({ $axios, params, env }) {
    const path = params.category;
    const lastDashIndex = path.lastIndexOf("-");
    const id = path.substring(lastDashIndex + 1, path.length);

    try {
      const [recNewsResponse, trendingNewsResponse, categoryInfoResponse] = await Promise.all([
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
        $axios.$get("/api/article/get_seo_category_page", {
          params: {
            site_id: env.SITE_ID,
            seo_category_id: id,
            size: 10,
            page: 1
          }
        })
      ]);
      return {
        recNews: recNewsResponse,
        trendingNews: trendingNewsResponse,
        categoryInfo: categoryInfoResponse,
        id
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        recNews: null,
        trendingNews: null,
        categoryInfo: null,
        id
      };
    }
  },
  head() {
    const categoryName = (this.categoryInfo && this.categoryInfo.seo_category && this.categoryInfo.seo_category.name) || "";
    return {
      title: `${categoryName} - Searchofeeds`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Browse the latest ${categoryName} articles on Searchofeeds.`
        }
      ],
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": "https://www.searchofeeds.com/",
                  name: "Home"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": `https://www.searchofeeds.com/category/${this.id}/`,
                  name: categoryName
                }
              }
            ]
          }
        }
      ]
    };
  },
  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style lang="scss" scoped>
::v-deep .news-box-4 {
  .load-list-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 28px;
  }
}
@media screen and (max-width: 750px) {
  ::v-deep .news-box-4 {
    padding-bottom: vw(32);
    .load-list-content {
      grid-template-columns: repeat(1, 1fr);
      gap: vw(52);
    }
  }
}
</style>
