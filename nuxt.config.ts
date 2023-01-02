// https://nuxt.com/docs/api/configuration/nuxt-config

const lifecycle = process.env.npm_lifecycle_event;
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Piki's Blog",
      meta: [{ name: "description", content: "Piki's blog." }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/images/icon.jpg" }],
    },
  },
  pages: true,
  css: ["@/assets/css/index.scss", "@/assets/css/doc.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                    $bg-dark: #1D1D1D;
                    $bg-light: #E9E9E9;
                    $text-light: #E9E9E9;
                    $text-dark: #000000;
                    $line-light: #CDCDCD;
                    $line-dark: #6D6D6D;
                    $doc-link-light: greenyellow;
                    $doc-link-dark: green;
                    $bg-doc-quote: rgb(90, 133, 26);
                    $bg-home-card-light: #FFFFFF;
                    $bg-home-card-dark: #2D2D2D;
                    $app-header-height: 4rem;
                    `,
        },
      },
    },
  },

  // build
  build: {
    transpile: lifecycle === "build" ? ["element-plus"] : [],
  },
  // build modules
  buildModules: ["nuxt-windicss"],
});
