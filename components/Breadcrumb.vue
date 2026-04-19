<template>
  <div class="bread-crumb">
    <CustomLink to="/" class="type">Home</CustomLink>
    <span> / </span>
    <span>
      <CustomLink
        v-if="info && info.is_seo_category_on_site"
        :to="`/category/${info.seo_category_path}/`"
        class="type"
        >{{ info && (info.seo_category_name || info.category_locale_name) }}</CustomLink
      >
      <span v-else class="type">{{ info && (info.seo_category_name || info.category_locale_name) }}</span>
    </span>
    <span v-if="!isCategory"> / </span>
    <span v-if="!isCategory" class="type">{{ info && info.name }}</span>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    isCategory: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="scss">
.bread-crumb {
  font-weight: bold;
  color: $font1;
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  gap: 12px;
  margin-bottom: 20px;
  .type {
    max-width: 200px;
    @include ellipsis();
  }
}
@media screen and (max-width: 750px) {
  .bread-crumb {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    height: vw(80);
    font-size: vw(28);
    line-height: vw(60);
    gap: vw(10);
    margin-bottom: vw(20);
    .type {
      max-width: vw(150);
    }
  }
}
</style>
