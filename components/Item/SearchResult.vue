<template>
  <CustomLink class="item" :to="`/${item.path_v2 || item.path}/`">
    <p class="title">{{ item.name }}</p>
    <p class="path">{{ formattedPath }}</p>
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
  },
  computed: {
    formattedPath() {
      if (process.client) {
        return `${window.location.origin}/${this.item.path_v2 || this.item.path}/`;
      }
      return `/${this.item.path_v2 || this.item.path}/`;
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: block;
  border-bottom: 1px solid #ececee;
  margin-bottom: 24px;
  color: rgba($font3, 0.6);
  .title {
    font-family: "hem";
    font-size: 22px;
    line-height: 29px;
    color: $font3;
  }
  .path {
    line-height: 19px;
    margin-top: 8px;
    margin-bottom: 16px;
  }
  .desc {
    line-height: 19px;
    margin-bottom: 24px;
    @include ellipsis(7);
  }
  &:hover {
    .title {
      color: $color1;
      text-decoration: underline;
    }
  }
}
@media screen and (max-width: 750px) {
  .item {
    border-bottom: vw(2) solid #ececee;
    margin-bottom: vw(32);
    .title {
      font-size: vw(36);
      line-height: vw(48);
    }
    .path {
      line-height: vw(38);
      margin-top: vw(16);
      margin-bottom: vw(32);
    }
    .desc {
      line-height: vw(38);
      margin-bottom: vw(34);
    }
  }
}
</style>
