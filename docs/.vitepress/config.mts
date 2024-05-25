import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/web-ui-sdks/",
  title: "Asgardeo Web SDKs",
  description: "Official Documentation for Asgardeo Web SDKs",
  themeConfig: {
    search: {
      provider: "local",
    },
    logo: {
      light: "/asgardeo-light.svg",
      dark: "/asgardeo-dark.svg",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "JS", link: "/js/introduction" },
      { text: "React", link: "/react/introduction" },
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
              {
                text: "SignIn",
                link: "/react/components/sign-in",
              },
              {
                text: "SignOutButton",
                link: "/react/components/sign-out-button",
              },
              {
                text: "SignedIn",
                link: "/react/components/signed-in",
              },
              {
                text: "SignedOut",
                link: "/react/components/signed-out",
              },
            ],
          },
          {
            text: "Custom Hooks",
            items: [
              {
                text: "useAuthentication",
                link: "/react/hooks/use-authentication",
              },
              {
                text: "useOn",
                link: "/react/hooks/use-on",
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/asgardeo/web-ui-sdks" },
    ],
  },
});
