import { AppConfig } from "./types/app";
const appConfig: AppConfig = {
  sidebar: {
    guide: {
      text: "Guide",
      items: [
        { text: "Introduction", link: "/docs/guide/introduction" },
        { text: "part1 and good one", link: "/docs/guide/part1" },
        {
          text: "coll",
          items: [
            { text: "gool", link: "/docs/guide/coll/goll" },
            { text: "why it is so good", link: "/docs/guide/coll/why" },
          ],
        },
      ],
    },
  },
  home: [
    {
      text: "Guide",
      link: "/docs/guide/introduction",
      createdAt: "2022-12-23T12:00",
      cover: "/images/icon1.jpg",
    },
    {
      text: "Guide-part1",
      link: "/docs/guide/part1",
      createdAt: "2022-12-23T12:00",
      cover: "/images/f.jpg",
    },
  ],
};

export default appConfig;
