<template>
  <CustomLink class="news-style-2" :to="`/detail/${item.path || item.path_v2}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="658"
      height="440"
      :src="item.cover"
      :alt="item.cover_seo_alt || item.name"
      loading="lazy"
      class="img"
    />
    <p class="category btn-tag" v-if="item.seo_category_name || item.category_locale_name || item.category_name">{{
      capitalizeFirstLetter(item.seo_category_name || item.category_locale_name || item.category_name)
    }}</p>
    <p class="title">{{ item.name }}</p>
    <div class="m-news-author pc-hidden-flex">
      <div>{{ item.author && item.author.name }}</div>
      <div>{{ item.updated_at }}</div>
    </div>
  </CustomLink>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style lang="scss" scoped>
.news-style-2 {
  padding-right: 16px;
  .img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px 8px 8px 8px;
  }
  .category {
    display: inline-block;
    padding: 4px 8px;
    line-height: 18px;
    font-size: 13px;
    font-family: "hem";
    color: #000;
    background: $tagColor2;
    border-radius: 4px 4px 4px 4px;
    margin: 16px 0 0;
  }
  .title {
    margin-top: 10px;
    font-size: 16px;
    line-height: 22px;
    font-weight: bold;
    @include ellipsis(3);
    transition: color 0.2s;
  }
  &:hover {
    .title {
      color: $color1;
      text-decoration: underline;
    }
  }
}
@media screen and (max-width: 1100px) {
  .news-style-2 {
    width: 100%;
  }
}
@media screen and (max-width: 750px) {
  .news-style-2 {
    padding-right: 0;
    width: 100%;
    .img {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 0;
      margin-right: 0;
    }
    .category {
      font-size: vw(24);
      line-height: vw(44);
      padding: vw(8) vw(16);
      border-radius: 0;
      margin: vw(20) 0 0;
    }
    .title {
      font-family: "Noto Sans SC";
      margin-top: vw(16);
      font-size: vw(36);
      line-height: vw(48);
      min-height: vw(96);
      @include ellipsis(2)
    }
    .m-news-author {
      display: flex;
      justify-content: space-between;
      margin-top: vw(12);
      font-weight: 300;
      font-size: vw(26);
      padding-bottom: vw(10);
      @include author-icon(vw(26), vw(26));
      div:first-child {
        max-width: vw(256);
        @include ellipsis();
      }
      div:last-child {
        max-width: vw(220);
        font-size: vw(26);
        @include ellipsis();
      }
    }
  }
}
</style>
