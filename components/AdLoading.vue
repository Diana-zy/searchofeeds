<template>
  <div id="ad-loading" class="mask-loading">
    <Loading />
  </div>
</template>

<style lang="scss" scoped>
.mask-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100001;
}
</style>
