// https://nuxt.com/docs/api/configuration/nuxt-config
import { md2 } from "vuetify/blueprints";
import yaml from "@rollup/plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { zhCN } from "date-fns/locale/zh-CN";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [//  '@nuxtjs/tailwindcss',
  "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt", "vuetify-nuxt-module", "@nuxt/icon"],
  runtimeConfig: {
    // 仅服务端可用
    apiSecret: "your-secret",
    public: {
      // 客户端和服务端都可以用
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:9920",
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:9920",
        changeOrigin: true,
      },
    },
  },
  css: ["~/assets/css/main.css", "@/assets/css/globals.scss"],
  vite: {
    plugins: [yaml(), tailwindcss()],
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
      disableVuetifyStyles: true,
      styles: {
        configFile: "assets/css/settings.scss",
      },
    },
    vuetifyOptions: {
      date: {
        adapter: "vuetify",
        locale: {
          zh: zhCN,
        },
      },
      locale: {
        locale: "zhHans",
      },
   
      /* vuetify options */
     blueprint: md2, // 可以基于 material3
  theme: {
    defaultTheme: 'myTheme',
    themes: {
      myTheme: {
        dark: false, // 开启暗色风格
        colors: {
          background: '#fff',
          surface: '#fff',
          primary: '#8c57ff', // 主色（按钮/选中）
          secondary: '#9CA3AF',
          accent: '#F472B6',
          error: '#ff4c51',
        }
      }
    }
  },
      defaults: {
        VBtn: {
          height: 38,
          rounded: 'rounded-lg',
        },
      },
    },
  },
  devtools: { enabled: true },
  imports: {
    dirs: [
      // Scan top-level composables
      "~/composables",
      // ... or scan composables nested one level deep with a specific name and file extension
      "~/composables/*/index.{ts,js,mjs,mts}",
      // ... or scan all composables within given directory
      "~/composables/**",
    ],
  },
});