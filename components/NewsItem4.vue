<template>
  <CustomLink class="news-style-4" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="328"
      height="218"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img m-hidden-block"
    />
    <NuxtImg
      format="auto"
      fit="cover"
      width="196"
      height="196"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img pc-hidden-block"
    />
    <p class="category">{{ capitalizeFirstLetter(item.category_name) }}</p>
    <p class="title">{{ item.name }}</p>
    <p class="desc">
      {{ item.first_paragraph }}
    </p>
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
.news-style-4 {
  position: relative;
  padding-left: 344px;
  margin-bottom: 24px;
  height: 243px;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: calc(100% - 344px);
    height: 1px;
    background: rgba($font1, 0.1);
  }
  .img {
    position: absolute;
    left: 0;
    top: 0;
    width: 328px;
    height: 218px;
    border-radius: 8px 8px 8px 8px;
  }
  .category {
    display: inline-block;
    padding: 0 4px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    font-family: "rssb";
    color: $color1;
    background: rgba($color1, 0.2);
    border-radius: 4px 4px 4px 4px;
    margin: 8px 0;
  }
  .title {
    font-size: 20px;
    font-family: "rssb";
    line-height: 28px;
    font-weight: 700;
    margin-bottom: 16px;
    @include ellipsis(2);
  }
  .desc {
    color: rgba($font1, 0.6);
    line-height: 26px;
    @include ellipsis(5);
  }
  &:hover {
    .title {
      // color: $color1;
      text-decoration: underline;
    }
  }
}
@media screen and (max-width: 750px) {
  .news-style-4 {
    padding-left: vw(212);
    margin-bottom: vw(32);
    height: vw(234);
    &::after {
      width: calc(100% - vw(212));
      height: vw(2);
    }
    .img {
      width: vw(196);
      height: vw(196);
      border-radius: vw(16);
    }
    .category {
      padding: 0 vw(8);
      height: vw(40);
      line-height: vw(40);
      font-size: vw(24);
      border-radius: vw(8);
      margin: 0 0 vw(8);
    }
    .title {
      font-size: vw(36);
      line-height: vw(50);
      margin-bottom: 0;
      @include ellipsis(3);
    }
    .desc {
      display: none;
    }
    &:hover {
      .title {
        color: $color1;
      }
    }
  }
}
</style>
