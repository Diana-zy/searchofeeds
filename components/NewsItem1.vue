<template>
  <CustomLink class="news-style-1" :to="`/detail/${item.path}/`">
    <NuxtImg
      format="auto"
      fit="cover"
      width="480"
      height="304"
      :src="item.cover"
      :alt="item.name"
      loading="lazy"
      class="img"
    />
    <p class="title">{{ item.name }}</p>
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
.news-style-1 {
  transition: border-color 0.2s;
  .img {
    width: 282px;
    height: 188px;
  }
  .title {
    font-size: 20px;
    font-family: "rssb";
    line-height: 28px;
    height: 84px;
    @include ellipsis(3);
    margin: 8px;
  }
  .desc {
    @include ellipsis(2);
    color: rgba($font1, 0.6);
    line-height: 24px;
    height: 44px;
    margin: 0px 8px 10px;
  }
  &:hover {
    // border-color: $color1;
    .title {
      // color: $color1;
      text-decoration: underline;
    }
  }
}
@media screen and (max-width: 750px) {
  .news-style-1 {
    .img {
      width: vw(480);
      height: vw(304);
    }
    .title {
      font-size: vw(40);
      line-height: vw(56);
      height: vw(168);
      margin: vw(16);
    }
    .desc {
      font-size: vw(32);
      line-height: vw(44);
      height: vw(88);
      margin: 0 vw(16) vw(20);
    }
    // &:hover {
    //   border-color: $color1;
    //   .title {
    //     color: $color1;
    //   }
    // }
  }
}
</style>
