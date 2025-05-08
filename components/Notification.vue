<!-- Notification.vue -->
<template>
  <transition name="slide">
    <div v-if="show" class="notification" :class="{ success: type === 'success' }" @click="hide">
      {{ message }}
    </div>
  </transition>
</template>
<script>
export default {
  computed: {
    show() {
      return this.$globalData.notification.show;
    },
    message() {
      return this.$globalData.notification.message;
    },
    type() {
      return this.$globalData.notification.type;
    }
  },
  methods: {
    hide() {
      this.$globalMethod.hideNotification();
    }
  }
};
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  max-width: 400px;
  bottom: 40px;
  left: 20px;
  padding: 14px 24px;
  border-radius: 8px;
  color: #ffffff;
  line-height: 24px;
  display: flex;
  align-items: center;
  transition: transform 0.5s ease; /* 添加过渡效果 */
  z-index: 999;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    background: #fba36a;
    border-radius: 8px;
    z-index: -1;
  }
}
.slide-leave-to {
  transform: translateX(-130%); /* 进入时从左侧滑入，离开时向左侧滑出 */
}
</style>
