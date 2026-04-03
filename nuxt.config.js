import TerserPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

export default {
  target: "static",
  server: {
    host: "0.0.0.0"
  },
  env: {
    SITE_ID: process.env.SITE_ID
  },
  generate: {
    crawler: false,
    concurrency: 10,
    interval: 100,
    async routes() {
      const pathData = await fetch(
        `${process.env.PROD_API_URL}/api/article/get_all_path?site_id=${process.env.SITE_ID}`
      );
      const path = await pathData.json();
      const categoryPaths = path.data.category.map((item) => `/category/${item}/`);
      const detailPaths = path.data.detail.map((item) => `/detail/${item}/`);

      const pathV2Data = await fetch(
        `${process.env.PROD_API_URL}/api/article/get_all_path_v2?site_id=${process.env.SITE_ID}`
      );
      const pathV2 = await pathV2Data.json();
      const slugPaths = (pathV2.data.detail || []).map((item) => `/${item}/`);

      return [...categoryPaths, ...detailPaths, ...slugPaths];
    }
  },
  axios: {
    baseURL:
      process.env.NODE_ENV === "production" ? process.env.PROD_API_URL : process.env.TEST_API_URL
  },
  router: {
    trailingSlash: true
  },
  head: {
    title: "Searchofeeds - Global News at Your Fingertips!",
    meta: [
      {
        name: "version",
        content: process.env.APP_VERSION || "1.0"
      },
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui"
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes"
      },
      {
        name: "mobile-web-app-capable",
        content: "yes"
      },
      {
        hid: "description",
        name: "description",
        content:
          "We are committed to delivering you the latest developments in various fields, including politics, economy, technology, culture, sports, and more.!"
      },
      {
        hid: "keywords",
        name: "keywords",
        content:
          "news, Frontier news, latest news, IT news, sports news, fashion news, car news, healthy news"
      },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: "Searchofeeds"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  image: {
    provider: "cloudflare",
    cloudflare: {
      baseURL: "https://bunchthings.com"
    }
  },
  plugins: [
    { src: "~/plugins/vue-infinite-scroll", ssr: false },
    "~/plugins/axios",
    "~/plugins/global-data",
    "~/plugins/nav-data"
  ],
  components: true,
  buildModules: ["@nuxtjs/style-resources", "@nuxt/image", "@nuxtjs/pwa", "@nuxtjs/sitemap"],
  css: ["@/assets/css/fonts.css", "@/assets/css/reset.css", "@/assets/css/common.scss"],
  styleResources: {
    scss: ["~/assets/css/_mixins.scss"]
  },
  modules: ["@nuxtjs/axios"],
  sitemap: {
    hostname: "https://searchofeeds.com/"
  },
  pwa: {
    manifest: {
      name: "Searchofeeds",
      short_name: "Searchofeeds",
      description:
        "We are committed to delivering you the latest developments in various fields, including politics, economy, technology, culture, sports, and more.!"
    },
    icon: {
      src: "static/icon.png",
      sizes: [32, 64, 120, 144, 152, 192, 512] // 自定义生成的图标尺寸
    }
  },
  build: {
    html: {
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    },
    extractCSS: {
      ignoreOrder: true
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: ".",
        name: true,
        minSize: 10000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            maxSize: 244000,
            priority: -10
          },
          styles: {
            name: "styles",
            test: /\.(css|vue)$/,
            chunks: "all",
            enforce: true
          }
        }
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            },
            output: {
              comments: false
            }
          }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: { inline: false },
            discardComments: { removeAll: true }
          }
        })
      ]
    }
  }
};
