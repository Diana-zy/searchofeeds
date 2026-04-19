<template>
  <CustomLink class="news-style-2" :to="`/${item.path_v2 || item.path}/`">
    <div class="m-hidden-block">
      <NuxtImg
        format="auto"
        fit="cover"
        width="380"
        height="214"
        :src="item.cover"
        :alt="item.cover_seo_alt || item.name"
        loading="lazy"
        class="img"
      />
      <p class="category btn-tag">{{
        capitalizeFirstLetter(item.seo_category_name || item.category_locale_name)
      }}</p>
      <p class="title">{{ item.name }}</p>
    </div>
    <div class="pc-hidden-flex m-news-style">
      <div class="m-news-left">
        <div class="m-news-title">{{ item.name }}</div>
        <div class="m-news-author">
          <div>{{ item.author && item.author.name }}</div>
          <div>{{ item.updated_at }}</div>
        </div>
      </div>
      <div class="m-news-right"> Read </div>
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
    margin: 16px 0 10px;
  }
  .title {
    font-size: 16px;
    font-family: "se3";
    line-height: 22px;
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
  .m-news-style {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 100%;
    overflow: hidden;
    border-bottom: vw(2) solid rgba($font3, 0.2);
    .m-news-left {
      flex: 1;
      max-width: vw(528);
      .m-news-title {
        width: 100%;
        font-size: vw(32);
        line-height: vw(36);
        @include ellipsis();
      }
      .m-news-author {
        display: flex;
        gap: vw(26);
        margin-top: vw(12);
        font-size: vw(26);
        font-weight: 300;
        padding-bottom: vw(10);
        @include author-icon(vw(26), vw(26));
      }
    }
    .m-news-right {
      flex-shrink: 0;
      font-size: vw(26);
      color: $color1;
    }
  }
}
</style>
