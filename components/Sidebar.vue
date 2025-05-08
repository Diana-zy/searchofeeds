<template>
  <div>
    <div v-if="isOpen" class="overlay" @click="closeSidebar"></div>
    <div class="sidebar" :class="{ 'sidebar-hidden': !isOpen }">
      <div class="close" @click="closeSidebar"></div>

      <div class="search-box">
        <input
          v-model="input"
          :placeholder="searchText[lang] || searchText[en]"
          class="search"
          name="search"
          @keyup.enter="search"
        />
        <i v-show="input != ''" class="icon-clear" @click="clear"></i>
        <i class="icon-search" @click="search"></i>
      </div>

      <!-- <div class="rec-keywords">
        <p
          v-for="(item, i) in recKeywords"
          :key="i"
          @click="handleSearchRecKeyword(item)"
          class="keyword-item"
        >
          {{ item }}
        </p>
      </div> -->

      <h2 class="title-h2">{{ categoryText[lang] || categoryText[en] }}</h2>
      <ul class="categories">
        <li v-for="(item, i) in navData.list" :key="i">
          <CustomLink :to="`/category/${item.path}/`">{{
            lang === "en"
              ? capitalizeFirstLetter(item.name)
              : item.locale_name[lang] || item.locale_name[en]
          }}</CustomLink>
        </li>
      </ul>

      <div v-if="showInstallButton" class="btn-download" @click="installPWA">
        <i class="icon-pwa"></i>
        <span>{{ downloadText[lang] || downloadText[en] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { simulateAFSSearch, capitalizeFirstLetter } from "~/utils/utils";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    navData: {
      type: Object,
      default: () => ({})
    },
    // detailKeyword: {
    //   type: Array,
    //   default: () => []
    // },
    lang: {
      type: String,
      default: "en"
    }
  },
  data() {
    return {
      input: "",
      deferredPrompt: null,
      showInstallButton: false,
      recKeywords: this.$recKeywords,
      searchText: {
        en: "Search...",
        ja: "検索けんさく..."
      },
      categoryText: {
        en: "Categories",
        ja: "カテゴリ"
      },
      downloadText: {
        en: "Download",
        ja: "ダウンロード"
      }
    };
  },

  mounted() {
    this.checkCanInstallPwa();
  },
  methods: {
    capitalizeFirstLetter,
    search() {
      if (this.input.length < 1) {
        this.$globalMethod.showNotification({
          message: "Please enter at least 1 characters",
          type: "warning"
        });
        return;
      }
      simulateAFSSearch(this.input);
    },
    closeSidebar() {
      this.$emit("close");
    },
    clear() {
      this.input = "";
    },

    handleSearchRecKeyword(keyword) {
      this.input = keyword;
      simulateAFSSearch(keyword);
    },

    checkCanInstallPwa() {
      // 判断是否支持 PWA
      if ("serviceWorker" in navigator && "PushManager" in window) {
        if (window.deferredPrompt) {
          this.deferredPrompt = window.deferredPrompt;
          this.showInstallButton = true;
        } else {
          window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton = true;
          });
        }
      }
    },
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(() => {
          this.deferredPrompt = null;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 40;
}
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: vw(670);
  background: #fff;
  transition: transform 0.3s ease;
  z-index: 50;
  &::before {
    content: "";
    display: block;
    width: 100%;
    height: vw(2);
    background: #ececee;
    position: absolute;
    top: vw(96);
  }
}
.sidebar-hidden {
  transform: translateX(-100%);
}
.close {
  position: absolute;
  top: vw(24);
  left: vw(46);
  @include icon(vw(48), vw(48), "icon-close.png");
}

.rec-keywords {
  width: vw(670);
  padding-left: vw(46);
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  @include scroll;
}
.keyword-item {
  white-space: nowrap;
  margin-right: vw(32);
  font-size: vw(24);
  line-height: vw(28);
  color: $font1;
  cursor: pointer;
  &:before {
    content: ">";
    color: rgba($font1, 0.5);
  }
}

.title-h2 {
  margin-left: vw(46);
}
.categories {
  li a {
    font-family: "rs";
    font-size: vw(32);
    height: vw(80);
    display: flex;
    align-items: center;
    padding-left: vw(46);
    cursor: pointer;
    &:hover {
      font-family: "rssb";
      background: rgba($color1, 0.2);
      color: $color1;
    }
  }
}
.btn-download {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: vw(96);
  border-top: 1px solid #ececee;
  padding-left: vw(46);
  display: flex;
  align-items: center;
  i {
    @include icon(vw(40), vw(40), "icon-pwa-m.png");
    margin-right: vw(12);
  }
  span {
    font-family: "rssb";
    font-size: vw(32);
    color: $color1;
  }
}
.search-box {
  visibility: visible;
  position: relative;
  max-width: vw(578);
  height: vw(80);
  box-shadow: 0 0 vw(16) 0 rgba(0, 0, 0, 0);
  border-radius: vw(40);
  border: vw(2) solid $color1;
  margin: vw(144) auto vw(24);
  padding-left: vw(20);
  padding-right: vw(192);
}
.search {
  width: 100%;
  height: 100%;
  font-size: vw(24);
  font-family: "rs";
  &::placeholder {
    font-family: "rs";
    color: rgba($font1, 0.4);
  }
}
.icon-search {
  position: absolute;
  right: vw(-2);
  top: vw(-2);
  display: block;
  background: $color1;
  border-radius: 0 vw(40) vw(40) 0;
  @include btn-img(vw(128), vw(80), "icon-search-white.png");
  background-size: vw(48) vw(48);
}
.icon-clear {
  position: absolute;
  right: vw(152);
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-image: url("~/assets/images/icon-clear.png");
  width: vw(28);
  height: vw(28);
  background-size: cover;
}
</style>
