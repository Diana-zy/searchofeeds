<template>
  <CustomLink class="swiper-rec" :to="`/detail/${item.path || item.path_v2}/`">
    <div class="swiper-rec-img">
      <NuxtImg
        format="auto"
        fit="cover"
        width="654"
        height="335"
        :src="item.cover"
        :alt="item.cover_seo_alt || item.name"
        :preload="index === 0"
        :loading="index === 0 ? 'eager' : 'lazy'"
        :fetchpriority="index === 0 ? 'high' : 'low'"
        class="img"
      />
    </div>
    <div class="swiper-rec-tag">
      <div
        v-if="item.seo_category_name || item.category_locale_name || item.category_name"
        class="rec-tag btn-tag"
        >{{ item.seo_category_name || item.category_locale_name || item.category_name }}</div
      >
    </div>
    <div class="swiper-rec-title">
      {{ item.name }}
    </div>
    <div class="swiper-rec-author">
      <div class="author-org">
        <div class="author-icon"></div>
        <div>{{ item.author && item.author.name }}</div>
      </div>
      <div class="edit-date">{{ item.updated_at }}</div>
    </div>
  </CustomLink>
</template>

<script>
export default {
  name: "SwiperRec",
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.swiper-rec {
  .swiper-rec-img {
    width: 100%;
    height: auto;
    .img {
      width: 100%;
      height: 418px;
      object-fit: cover;
    }
  }
  .swiper-rec-tag {
    width: 100%;
    display: flex;
    gap: 8px;
    margin: 16px 0 16px;
    .rec-tag {
      line-height: 19px;
      font-size: 16px;
      padding: 6px 8px;
      background: $tagColor1;
      color: #000;
    }
  }
  .swiper-rec-title {
    min-height: 60px;
    font-size: 24px;
    line-height: 30px;
    font-weight: 700;
    margin-bottom: 16px;
    @include ellipsis(2);
  }
  .swiper-rec-author {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .author-org {
      display: flex;
      align-items: center;
      .author-icon {
        margin-right: 8px;
        @include icon(24px, 24px, "logo2.png");
      }
    }
    .edit-date {
    }
  }
}
@media screen and (max-width: 750px) {
  .swiper-rec {
    padding: 0 0 vw(48);
    border-bottom: vw(1) solid rgba($font3, 0.35);
    .swiper-rec-img {
      margin-bottom: vw(24);
      .img {
        width: vw(686);
        height: vw(361);
      }
    }
    .swiper-rec-tag {
      font-size: vw(24);
      width: 100%;
      margin: vw(24) 0 vw(24);
      gap: vw(12);
      .rec-tag {
        font-size: vw(24);
        padding: vw(12) vw(16);
      }
    }
    .swiper-rec-title {
      @include ellipsis(3);
      font-size: vw(40);
      line-height: vw(60);
      margin-bottom: vw(20);
      min-height: vw(180);
    }
    .swiper-rec-author {
      height: vw(28);
      font-size: vw(28);
      line-height: vw(28);
      .author-org {
        height: vw(28);
        display: flex;
        align-items: center;
        .author-icon {
          margin-right: vw(6);
          @include icon(vw(28), vw(28), "logo2.png");
        }
        div {
          line-height: vw(28);
          font-size: vw(28);
        }
      }
      .edit-date {
        font-size: vw(24);
        line-height: vw(28);
      }
    }
  }
}
</style>
