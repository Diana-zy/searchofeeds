<template>
  <div ref="googleAdStyle">
    <p class="title">Advertisement</p>
  </div>
</template>

<script>
export default {
  props: {
    adSlot: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      observer: null
    };
  },
  mounted() {
    this.observer = new IntersectionObserver(this.handleIntersection);
    this.observer.observe(this.$refs.googleAdStyle);
  },
  methods: {
    handleIntersection(entries) {
      if (entries[0].isIntersecting) {
        const adScript = document.createElement("script");
        adScript.innerHTML = `(adsbygoogle = window.adsbygoogle || []).push({});`;
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        // ins.style.display = "block";
        ins.setAttribute("style", "display: block;width: 100%;height: 100%;");
        ins.setAttribute("data-ad-client", "ca-pub-1853000876464912");
        ins.setAttribute("data-ad-slot", this.adSlot);
        // ins.setAttribute("data-ad-format", "rectangle");
        // ins.setAttribute("data-full-width-responsive", "true");
        this.$refs.googleAdStyle.appendChild(ins);
        this.$refs.googleAdStyle.appendChild(adScript);
        this.observer.unobserve(this.$refs.googleAdStyle);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  background: rgba($color1, 0.6);
  line-height: 24px;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
}
@media screen and (max-width: 879px) {
  .title {
    font-size: vw(24);
    line-height: vw(30);
  }
}
</style>
