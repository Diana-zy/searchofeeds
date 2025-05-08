<template>
  <a :href="customLink || to">
    <slot></slot>
  </a>
</template>

<script>
import { generateCustomPath } from "~/utils/utils";

export default {
  props: {
    to: {
      type: String || Number,
      required: true
    }
  },
  data() {
    return {
      customLink: ""
    };
  },
  mounted() {
    setTimeout(() => {
      this.customLink = generateCustomPath(this.to);
    }, 10);
  }
};
</script>
