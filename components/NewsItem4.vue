<template>
  <CustomLink class="news-style-4" :to="`/detail/${item.path || item.path_v2}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="658"
      height="440"
      :src="item.cover"
      :alt="item.cover_seo_alt || item.name"
      :loading="index === 0 ? 'eager' : 'lazy'"
      :preload="index === 0"
      :fetchpriority="index === 0 ? 'high' : 'low'"
      class="img"
    />
    <p class="category btn-tag" v-if="item.seo_category_name || item.category_locale_name || item.category_name">{{
      capitalizeFirstLetter(item.seo_category_name || item.category_locale_name || item.category_name)
    }}</p>
    <p class="title">{{ item.name }}</p>
    <div class="news-author">
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
    },
    index: {
      type: Number,
      default: 0
    }
  },

  methods: {
    capitalizeFirstLetter
  }
};
</script>

<style lang="scss" scoped>
.news-style-4 {
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
    color: $font5;
    background: $tagColor3;
    border-radius: 4px 4px 4px 4px;
    margin: 16px 0 10px;
  }
  .title {
    font-size: 16px;
    line-height: 24px;
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
  .news-author {
    display: flex;
    justify-content: space-between;
    margin-top: 13px;
    font-size: 14px;
    padding-bottom: 16px;
    @include author-icon(25px, 25px);
  }
}
@media screen and (max-width: 1100px) {
  .news-style-4 {
    width: 100%;
  }
}
@media screen and (max-width: 750px) {
  .news-style-4 {
    padding-right: 0;
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
    .img {
      width: 100%;
      height: auto;
      border-radius: vw(16);
    }
    .category {
      font-size: vw(24);
      line-height: vw(44);
      padding: vw(8) vw(16);
      border-radius: 0;
      margin: vw(24) 0 vw(24);
    }
    .title {
      font-size: vw(26);
      line-height: vw(36);
      font-weight: normal;
      height: vw(108);
      @include ellipsis(3);
    }
    .news-author {
      display: flex;
      gap: vw(12);
      font-size: vw(22);
      font-weight: 300;
      margin: vw(6) 0 0;
      @include author-icon(vw(22), vw(22));
    }
  }
}
</style>
