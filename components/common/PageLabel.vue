<template>
  <h1 class="page-title"> {{ title }}</h1>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.page-title {
  padding-left: 12px;
  margin-bottom: 40px;
  font-size: 28px;
  line-height: 1.5;
  border-bottom: $font4 1px solid;
  border-left: solid 12px $color1;
}
@media screen and (max-width: 750px) {
  .page-title {
    font-size: vw(40);
    margin-bottom: vw(32);
    padding-left: vw(16);
    border-left: solid vw(16) $color1;
  }
}
</style>
