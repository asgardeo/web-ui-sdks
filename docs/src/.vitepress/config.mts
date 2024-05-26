/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/web-ui-sdks/",
  title: "Asgardeo Web SDKs",
  description: "Official Documentation for Asgardeo Web SDKs",
  head: [["link", { rel: "icon", href: "/web-ui-sdks/asgardeo-dark.svg" }]],
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
