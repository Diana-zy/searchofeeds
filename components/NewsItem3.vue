<template>
  <CustomLink class="news-style-3" :to="`/${item.path_v2 || item.path}/`">
    <p class="title">{{ item.name }}</p>
    <p class="path">/{{ item.path_v2 || item.path }}/</p>
    <p class="desc">{{ item.first_paragraph }}</p>
  </CustomLink>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.news-style-3 {
  display: block;
  border-bottom: 1px solid #ececee;
  margin-bottom: 24px;
  .title {
    font-family: "rssb";
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    color: rgba($font1, 0.6);
  }
  .path {
    font-size: 14px;
    line-height: 16px;
    margin-top: 8px;
    margin-bottom: 16px;
    color: rgba($font1, 0.6);
  }
  .desc {
    font-size: 16px;
    line-height: 26px;
    color: rgba($font1, 0.6);
    margin-bottom: 24px;
    @include ellipsis(4);
  }
  &:hover {
    .title {
      // color: $color1;
      text-decoration: underline;
      color: $font1;
    }
  }
}
@media screen and (max-width: 750px) {
  .news-style-3 {
    border-bottom: vw(2) solid #ececee;
    margin-bottom: vw(32);
    .title {
      font-size: vw(40);
      line-height: vw(56);
    }
    .path {
      font-size: vw(28);
      line-height: vw(38);
      margin-top: vw(16);
      margin-bottom: vw(32);
    }
    .desc {
      font-size: vw(32);
      line-height: vw(52);
      margin-bottom: vw(34);
    }
  }
}
</style>
