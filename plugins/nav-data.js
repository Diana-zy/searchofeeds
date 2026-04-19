// plugins/navData.js
export default async function ({ $axios, env, isServer }, inject) {
  try {
    const data = await $axios.$get("/api/article/get_all_seo_category", {
      params: {
        site_id: env.SITE_ID
      }
    });
    inject("navData", data);
    inject("sameAs", []);
  } catch (error) {
    console.error("Failed to fetch navigation data:", error);
    inject("navData", []);
    inject("sameAs", []);
  }
}
