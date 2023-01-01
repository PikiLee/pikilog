import { HomeCard } from "./home";
import { DocSideBarConfig } from "./doc";
export interface AppConfig {
  sidebar: {
    [index: string]: DocSideBarConfig;
  };
  home: HomeCard[];
}
