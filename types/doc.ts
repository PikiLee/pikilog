export interface Heading {
  title: string;
  slug: string;
  tag: string;
}

export interface DocSideBarConfigItemList {
  text: string;
  items: (DocSideBarConfigItemList | DocSideBarConfigItem)[];
}

export interface DocSideBarConfigItem {
  text: string;
  link: string;
}

export type  DocSideBarConfig = DocSideBarConfigItem | DocSideBarConfigItemList 