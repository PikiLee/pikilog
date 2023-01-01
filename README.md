# My blog website.

- Write markdown
- Parse markdown to vue SFC
- Based on Nuxt3

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Run markdown parser

```bash
npm run watch
```

## Development Server

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

# How to write

Add markdown file in _docs_ directory

## Blog Group

- The blogs in the same child directory of _doc_ are consider a group.
- Blogs in a group share the same sidebar.

# Configuarations

In plog.config.ts

## SideBar

- Use `sidebar` property to set sidebar structure for every blog group.
- A group can contains nested sections and blogs.

### Example
```javascript
const appConfig: AppConfig = {
  sidebar: {
    // the directory name of blog group
    directoryName: {
      text: "Group1",
      items: [
        // first section
        {
          text: "Section1",
          items: [
            // the first blog in first section
            {
              text: "blog1",
              link: "/docs/groupName/hello",
            },
          ],
        },
        // second section
        {
          text: "Section2",
          items: [
            // the first blog in second section
            {
              text: "blog2",
              link: "/docs/groupName/bye",
            },
          ],
        },
      ],
    },
  },
};
```

## Home

Set list of blogs that would be displayed home page.

### Example
```javascript
const appConfig: AppConfig = {
  home: [
    {
      text: "blog1",
      link: "/docs/blog1",
      createdAt: "2023-1-1T18:40",
      cover: "/images/blog1.png",
    },
  ],
};
```
