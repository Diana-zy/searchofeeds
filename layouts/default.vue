<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
export default {
  mounted() {
    this.getTTClid();
    // try {
    //   let userId = sessionStorage.getItem("userId");
    //   if (!userId) {
    //     userId = uuidv4().replace(/-/g, "");
    //     sessionStorage.setItem("userId", userId);
    //   }
    //   window.dataLayer = window.dataLayer || []
    //   window.dataLayer.push({
    //     'user_id': userId
    //   });
    // } catch (e) {}
  },
  methods: {
    getTTClid() {
      try {
        const ttclid = this.$route.query.ttclid;
        if (ttclid) {
          window.setCookie("hi_ttclid", ttclid);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
