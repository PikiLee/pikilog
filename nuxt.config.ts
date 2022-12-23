// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    pages: true,
    css: [
        '@/assets/css/index.scss',
        '@/assets/css/doc.scss',
    ],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                    $bg-dark: #2D2D2D;
                    $text-white: #FFFFFF;
                    $text-white-dark-1: #E9E9E9;
                    $line-dark: #6D6D6D;
                    $doc-link: greenyellow;
                    $bg-doc-quote: rgb(90, 133, 26);`
                }
            }
        }
    }
})
