<template>
  <div class="page">
    <Header />
    <main class="main">
      <h1>Contact Us</h1>
      <p>Please feel free to contact us at service@searchofeeds.com </p>
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  .main {
    flex: 1;
    text-align: center;
    h1 {
      font-size: 2rem;
      margin: 2rem 0;
      font-family: "rssb";
    }
    p {
      font-size: 1.2rem;
      margin: 1.2rem 0;
      font-family: "rssb";
    }
  }
}
</style>
