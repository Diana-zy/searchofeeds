<template>
  <footer class="footer" :class="{ sm: ['de'].indexOf(lang) !== -1 }">
    <div class="footer-info">
      <div class="icon-logo">
        <img :src="icon" alt="Searchofeeds" />
      </div>
      <div class="website-info">
        <div>Searchofeeds is your trusted source for the latest global news and information across politics, economy, technology, culture, sports, and more.</div>
        <div>We are committed to delivering comprehensive, accurate, and timely coverage of world events to keep you informed and engaged.</div>
      </div>
      <div class="link-info">
        <ul>
          <li class="link-item">
            <CustomLink :to="'/cookies.html'" target="_blank">Privacy Policy</CustomLink>
          </li>
          <li class="link-item">
            <CustomLink :to="'/eula.html'" target="_blank">Terms of Service</CustomLink>
          </li>
          <li class="link-item">
            <a href="mailto:service@searchofeeds.com">Contact</a>
          </li>
        </ul>
      </div>
      <div class="bottom-info">Copyright &copy; 2024 Searchofeeds &nbsp; All rights reserved</div>
    </div>
    <Notification v-if="showNotification" :message="notificationMessage" />
  </footer>
</template>

<script>
import { validateEmail } from "~/utils/utils";

export default {
  props: {
    lang: {
      type: String,
      default: "en"
    },
    channelId: {
      type: String,
      default: ""
    },
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      input: "",
      icon: require("@/assets/images/logo.png")
    };
  },
  computed: {
    showNotification() {
      return this.$globalData.notification.show;
    },
    notificationMessage() {
      return this.$globalData.notification.message;
    }
  },
  methods: {
    async submitEmail() {
      if (validateEmail(this.input)) {
        await this.$axios.$post("/api/game/subscribe", {
          site_id: process.env.SITE_ID,
          email: this.input
        });
        this.$globalMethod.showNotification({
          message: "Thank you for subscribing!",
          type: "success"
        });
      } else {
        this.$globalMethod.showNotification({
          message: "Please enter a valid email address",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  margin-top: 32px;
  color: rgba(#000, 0.65);
  .icon-logo {
    width: 212px;
    height: 32px;
    margin-bottom: 20px;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .website-info {
    font-size: 16px;
    line-height: 21px;
    margin-bottom: 10px;
    div:first-child {
      margin-bottom: 28px;
    }
  }
  .link-item {
    cursor: pointer;
  }
  .link-info {
    display: flex;
    align-items: center;
    li {
      padding: 8px 0;
      display: inline-block;
      margin-right: 20px;
    }
    a {
      color: rgba(#000, 0.65);
    }
  }
  .bottom-info {
    margin-top: 72px;
    transform: translateX(calc((1200px - 100vw) / 2));
    left: 0;
    width: 100vw;
    height: 44px;
    font-size: 14px;
    text-align: center;
    line-height: 44px;
    color: #fff;
    background: $color1;
  }
}
@media screen and (max-width: 1100px) {
  .footer {
    .bottom-info {
      transform: none;
      width: 100vw;
    }
  }
}
@media screen and (max-width: 750px) {
  .footer {
    position: relative;
    margin-top: vw(32);
    .icon-logo {
      margin-left: vw(32);
      width: vw(320);
      height: vw(48);
    }
    .website-info {
      padding: 0 vw(32);
      line-height: 1.5;
      font-size: vw(28);
      div:first-child {
        margin-bottom: vw(24);
      }
    }
    .link-info {
      padding: vw(48) vw(32) 0;
      ul,
      .link-item {
        width: 100%;
      }
      li {
        padding: 0;
        display: block;
        line-height: vw(66);
        font-size: vw(24);
        color: rgba(#000, 0.65);
        border-bottom: vw(1) solid rgba($font3, 0.35);
      }
    }
    .bottom-info {
      transform: none;
      width: 100%;
      height: vw(70);
      font-size: vw(28);
      line-height: vw(70);
      margin-top: vw(64);
    }
  }
}
</style>
