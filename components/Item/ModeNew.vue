<template>
  <CustomLink :to="`/detail/${item.path || item.path_v2}/`">
    <div class="mode-new">
      <div>
        <div class="img-box">
          <NuxtImg
            format="auto"
            fit="cover"
            width="140"
            :src="item.cover"
            :alt="item.cover_seo_alt || item.name"
            loading="lazy"
            class="img"
          />
        </div>
        <div class="news-author">
          <div>{{ item.author && item.author.name }}</div>
        </div>
      </div>
      <div class="right-info">
        <p class="title">{{ item.name }}</p>
        <div class="tag">{{ capitalizeFirstLetter(item.seo_category_name || item.category_locale_name) }}</div>
        <div class="date"> {{ item.updated_at }}</div>
      </div>
    </div>
  </CustomLink>
</template>

<script>
import { capitalizeFirstLetter } from "~/utils/utils";
export default {
  name: "ModeNew",
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

<style scoped lang="scss">
.mode-new {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 10px;
  &:hover {
    .img {
      transform: scale(1.2);
    }
  }
  .img-box {
    flex-shrink: 0;
    width: 140px;
    height: 80px;
    overflow: hidden;
  }
  .img {
    width: 140px;
    height: 80px;
    object-fit: cover;
    transition: 0.6s;
  }
  .right-info {
    flex: 1;
    .title {
      line-height: 20px;
      font-size: 16px;
      margin-bottom: 4px;
      @include ellipsis(2);
    }
    .tag {
      width: fit-content;
      font-size: 14px;
      padding: 4px 6px;
      color: #000;
      background: $tagColor2;
    }
    .date {
      margin-top: 20px;
      font-size: 14px;
    }
  }
}
.news-author {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  @include author-icon(16px, 16px);
}
</style>
