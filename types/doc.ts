export interface Heading {
    title: string;
    slug: string;
    tag: string;
  }

export interface DocSideBarSectionConfig {
  text: string;
  items: { text: string; link: string }[];
}

export type DocSideBarConfig = DocSideBarSectionConfig[];