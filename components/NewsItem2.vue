<template>
  <CustomLink class="news-style-2" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="658"
      height="440"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img"
    />
    <p class="category">{{ capitalizeFirstLetter(item.category_name) }}</p>
    <p class="title">{{ item.name }}</p>
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
    width: 240px;
    height: 160px;
    border-radius: 8px 8px 8px 8px;
    float: left;
    margin-right: 16px;
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
    margin: 18px 0 10px;
  }
  .title {
    font-size: 26px;
    font-family: "rssb";
    line-height: 36px;
    @include ellipsis(3);
  }
  &:hover {
    .title {
      // color: $color1;
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
    display: flex;
    flex-direction: column-reverse;
    padding-right: 0;
    padding-bottom: vw(32);
    border-bottom: vw(2) solid #ececee;
    .img {
      width: vw(658);
      height: vw(440);
      border-radius: vw(16);
      float: unset;
      margin-right: 0;
    }
    .category {
      display: none;
    }
    .title {
      margin: 0 0 vw(16);
      font-size: vw(52);
      line-height: vw(72);
    }
  }
}
</style>
