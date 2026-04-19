<script>
export default {
  name: "InfiniteLoadList",
  props: {
    apiEndpoint: {
      type: String,
      required: true
    },
    initialPage: {
      type: Number,
      default: 2
    },
    pageSize: {
      type: Number,
      default: 12
    },
    initialItems: {
      type: Array,
      default: () => []
    },
    query: {
      type: Object,
      default: () => {}
    },
    responseListKey: {
      type: String,
      default: "list"
    },
    showMore: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "get"
    },
    modId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      endOfList: false,
      currentPage: this.initialPage,
      items: [...(this.initialItems || [])]
    };
  },
  watch: {
    query(val) {
      this.$emit("update:query", val);
    }
  },
  mounted() {},
  methods: {
    async loadMore() {
      if (this.loading || this.endOfList) return;
      this.loading = true;
      try {
        const params = {
          site_id: process.env.SITE_ID,
          page: this.currentPage,
          size: this.pageSize,
          mod_id: this.modId
        };
        if (this.query) {
          Object.assign(params, this.query);
        }
        const response = await this.$axios["$" + this.type](
          this.apiEndpoint,
          this.type === "get" ? { params } : params
        );
        const newData = response[this.responseListKey];
        this.items = this.items.concat(newData);
        if (newData.length === 0 || newData.length < this.pageSize) {
          this.endOfList = true;
        }
        this.currentPage++;
        this.$emit("updateNum", this.items.length);
      } catch (error) {
        console.error("Failed to load more data:", error);
      } finally {
        this.loading = false;
      }
    },
    reloadData(data) {
      this.items = [...data];
    }
  }
};
</script>

<template>
  <div class="load-list-layout">
    <div class="load-list-content">
      <slot :items="items"></slot>
    </div>
    <Loading v-if="loading" class="infinite-loading"></Loading>
    <footer v-show="showMore">
      <div
        v-show="!(this.loading || this.endOfList)"
        class="more-btn color-tip-theme"
        @click="loadMore"
        >Load More</div
      ></footer
    >
  </div>
</template>

<style scoped lang="scss">
.load-list-layout {
  width: 100%;
  .load-list-content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  .more-btn {
    margin: 20px auto;
    width: 272px;
    height: 48px;
    color: $color1;
    cursor: pointer;
    border: 2px solid $color2;
    border-radius: 24px;
    line-height: 48px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    transition: 0.6s;
    &:hover {
      color: #fff;
      background: $color1;
      border: none;
    }
  }
}
@media screen and (max-width: 750px) {
  .load-list-layout {
    footer {
      padding: 0 vw(32);
    }
    .load-list-content {
      gap: vw(64) vw(14);
    }
    .more-btn {
      width: 100%;
      margin: vw(24) auto;
      line-height: vw(88);
      background: $color1;
      color: #ffffff !important;
      border: none;
      border-radius: vw(44);
      font-size: vw(28);
    }
  }
}
</style>
