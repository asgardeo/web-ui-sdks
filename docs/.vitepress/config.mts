import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Asgardeo Web SDKs",
  description: "Official Documentation for Asgardeo Web SDKs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "JS",
        items: [
          { text: "Introduction", link: "/js/introduction" },
          { text: "APIs", link: "/js/apis" },
        ],
      },
      {
        text: "React",
        items: [
          {
            text: "Introduction",
            link: "/react/introduction",
          },
          {
            text: "Components",
            link: "/react/components",
            items: [
              {
                text: "Asgardeo Provider",
                link: "/react/components/asgardeo-provider",
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
