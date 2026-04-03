<template>
  <header class="header">
    <div class="header-top">
      <CustomLink to="/" class="logo"></CustomLink>
      <h1 v-if="pageTitle" class="site-h1">{{ pageTitle }}</h1>
      <div class="search-box m-hidden-block">
        <input v-model="input" placeholder="Search..." class="search" @keyup.enter="search" />
        <i v-show="input != ''" class="icon-clear" @click="clear"></i>
        <i class="icon-search" @click="search"></i>
      </div>
    </div>
    <div class="menu">
      <div class="category">
        <ul class="dropdown">
          <li v-for="(item, i) in navData && navData.list && navData.list.slice(0, 6)" :key="i"
            ><CustomLink :to="`/category/${item.path}/`">{{
              capitalizeFirstLetter(item.name)
            }}</CustomLink></li
          >
        </ul>
      </div>

      <div class="search-m-box pc-hidden-flex">
        <i class="icon-search" :class="{ 'show-close': showSearch }" @click="handleOpenSearch"></i>
        <div class="pc-hidden-block">
          <div class="icon-sidebar" :class="{ 'show-close': isSidebarOpen }" @click="toggleSidebar">
          </div>
        </div>
        <transition name="opacity">
          <div class="mask" @click="handleClickMask" v-show="isSidebarOpen || showSearch">
            <transition name="slide">
              <div class="menu-nav-list" v-show="isSidebarOpen">
                <ul>
                  <li v-for="item in navData && navData.list" :key="item.path">
                    <CustomLink :to="`/category/${item.path}/`">{{
                      capitalizeFirstLetter(item.name)
                    }}</CustomLink>
                  </li>
                </ul>
              </div>
            </transition>
            <transition name="slide">
              <div class="menu-nav-list" v-show="showSearch">
                <div class="search-box-nav" @click.stop="handleClick">
                  <input
                    v-model="input"
                    placeholder="Search..."
                    class="search-nav"
                    @keyup.enter="search"
                  />
                  <i v-show="input != ''" class="icon-clear-nav" @click="clear"></i>
                  <i class="icon-search-nav" @click="search"></i>
                </div>
              </div> </transition
          ></div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { simulateAFSSearch, capitalizeFirstLetter } from "~/utils/utils";

export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    pageTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      input: "",
      deferredPrompt: null,
      showInstallButton: false,
      isSidebarOpen: false,
      showSearch: false,
      navData: this.$root.$options.navData || this.$navData
    };
  },
  mounted() {
    this.input = this.$route.query.query || "";
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
  methods: {
    capitalizeFirstLetter,
    handleOpenSearch() {
      this.isSidebarOpen = false;
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
    handleClickMask() {
      this.showSearch = false;
      this.isSidebarOpen = false;
      document.body.classList.remove("no-scroll");
    },
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
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(() => {
          this.deferredPrompt = null;
        });
      }
    },
    toggleSidebar() {
      this.showSearch = false;
      this.isSidebarOpen = !this.isSidebarOpen;
      if (this.isSidebarOpen) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    handleClick() {},
    clear() {
      this.input = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  max-width: 1200px;
  height: 147px;
  margin-bottom: 0px;
  z-index: 11;
  .header-top {
    width: 100%;
    height: 66px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    .logo {
      display: block;
      width: 265px;
      height: 40px;
      @include bg("logo.png");
      margin-right: 0;
    }
    .site-h1 {
      font-size: 11px !important;
      font-weight: 700;
      color: $font1;
      white-space: nowrap;
      line-height: 1;
    }
  }
}
.menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .category {
    width: 100%;
    overflow: hidden;
    font-size: 16px;
    line-height: 72px;
    cursor: pointer;
    position: relative;
    z-index: 2;
    .dropdown {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 40px;
      overflow-x: auto;
    }
    li {
      white-space: nowrap;
      flex: 1;
      a {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
.search-box {
  position: absolute;
  top: 9px;
  right: 0;
  width: 380px;
  height: 48px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0);
  border-radius: 8px;
  border: 1px solid $font3;
  margin: 0 0 0 24px;
  padding-left: 16px;
  padding-right: 120px;
}
.search {
  position: absolute;
  top: 0;
  left: 16px;
  width: 60%;
  height: 100%;
  font-family: "rs";
  &::placeholder {
    font-family: "rs";
    color: rgba($font1, 0.4);
  }
}
.icon-clear {
  position: absolute;
  right: 94px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-image: url("~/assets/images/icon-clear.png");
  width: 16px;
  height: 16px;
  background-size: cover;
}
.icon-search {
  position: absolute;
  right: 13px;
  top: 8px;
  display: block;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  @include icon(32px, 32px, "icon-search4.png");
  background-size: 32px 32px;
}

.dropdown li:hover {
  color: $color1;
}
@media screen and (max-width: 1100px) {
  .search-box {
    width: 240px;
  }
}
@media screen and (max-width: 750px) {
  .header {
    width: 100%;
    padding: 0 vw(32);
    max-width: 100vw;
    height: vw(114);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: vw(2) solid rgba($font3, 0.35);
    z-index: 11;
    .header-top {
      height: auto;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: vw(4);
      .logo {
        width: vw(320);
        height: vw(48);
        @include bg("logo.png");
        margin-right: 0;
      }
      .site-h1 {
        font-size: 14px !important;
        font-weight: 700;
        color: $font1;
        max-width: vw(460);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 1;
      }
    }
  }
  .menu-nav-list {
    position: absolute;
    top: 0;
    left: 0;
    padding: vw(40) vw(32);
    height: auto;
    width: 100vw;
    transition: all 0.6s;
    overflow: hidden;
    background-color: #fff;
    z-index: 12;
    font-family: "rs";
    font-size: vw(32);
    li {
      padding: vw(16) 0;
      line-height: vw(48);
      border-bottom: vw(2) solid rgba($font3, 0.2);
    }
    a {
      display: inline-block;
      width: 100%;
    }
  }
  .contact,
  .category {
    display: none;
  }
  .icon-sidebar {
    @include icon(vw(48), vw(48), "icon-sidebar.png");
    cursor: pointer;
  }
  .pc-hidden {
    margin-left: auto;
  }
  .menu {
    height: 100%;
    width: auto;
  }
  .search-m-box {
    width: auto;
    height: vw(64);
    display: flex;
    align-items: center;
    gap: vw(20);
  }
  .search {
    position: relative;
    width: 100%;
    height: 100%;
    font-family: "rs";
    &::placeholder {
      font-family: "rs";
      color: rgba($font1, 0.4);
    }
  }
  .icon-clear {
    position: absolute;
    right: vw(100);
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    background-image: url("~/assets/images/icon-clear.png");
    width: vw(28);
    height: vw(28);
    background-size: cover;
  }
  .icon-search {
    top: 0;
    right: 0;
    position: relative;
    display: block;
    border-radius: vw(8);
    @include icon(vw(48), vw(48), "icon-search4.png");
    background-size: vw(48) vw(48);
    background-color: transparent;
  }
  .search-box-nav {
    position: relative;
    width: 100%;
    height: vw(80);
    display: flex;
    flex-wrap: nowrap;
    .search-nav {
      width: 100%;
      border: vw(2) solid $font3;
      border-radius: vw(12);
      padding-left: vw(32);
    }
    .icon-clear-nav {
      position: absolute;
      right: vw(100);
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      background-image: url("~/assets/images/icon-clear.png");
      width: vw(28);
      height: vw(28);
      background-size: cover;
    }
    .icon-search-nav {
      position: absolute;
      right: vw(32);
      top: 50%;
      transform: translateY(-50%);
      display: block;
      @include btn-img(vw(48), vw(48), "icon-search4.png");
    }
  }
  .show-close {
    @include icon(vw(48), vw(48), "icon-close.png");
  }
  .mask {
    position: absolute;
    top: vw(114);
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    background: rgba(#111, 0.7);
    overflow: hidden;
    pointer-events: all;
  }
}
</style>
