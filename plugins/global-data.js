// plugins/global-data.js
import Vue from "vue";

export default ({ app }, inject) => {
  // 创建一个响应式的全局数据对象
  const globalData = Vue.observable({
    isNavigationVisible: false,
    notification: {
      show: false,
      message: "",
      type: ""
    }
  });
  // 注入响应式的 globalData 对象
  inject("globalData", globalData);

  // 创建一个全局方法对象并注入
  inject("globalMethod", {
    toggleNavigation: () => {
      globalData.isNavigationVisible = !globalData.isNavigationVisible;
    },
    // 显示通知
    showNotification: ({ message, type }) => {
      globalData.notification.show = true;
      globalData.notification.message = message;
      globalData.notification.type = type;
      // 在 3 秒后调用 hideNotification
      setTimeout(() => {
        app.$globalMethod.hideNotification();
      }, 3000);
    },
    // 隐藏通知
    hideNotification: () => {
      globalData.notification.show = false;
      globalData.notification.message = "";
      globalData.notification.type = "";
    }
  });
};
