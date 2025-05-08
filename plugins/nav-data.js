// plugins/navData.js
export default async function ({ $axios, env, isServer }, inject) {
  // if (!isServer) return;

  try {
    const data = await $axios.$get("/api/article/get_all_category", {
      params: {
        site_id: env.SITE_ID
      }
    });
    // const recKeywordsData = await $axios.$get("/api/article/search_recommend_words", {
    //   params: {
    //     site_id: env.SITE_ID
    //   }
    // });
    inject("navData", data);
    // inject("recKeywords", recKeywordsData.list);
    // inject("recKeywords", ["test"]);
  } catch (error) {
    console.error("Failed to fetch navigation data:", error);
    inject("navData", []);
    // inject("recKeywords", []);
  }
}
