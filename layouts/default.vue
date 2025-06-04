<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    this.getTTClid();
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
