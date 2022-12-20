import * as markdownToVue from "./markdownToVue";
import * as fs from "node:fs";

const mappings: markdownToVue.Mappings = {
  h1: "head1",
  h2: "head2",
};
const packageName = "plog";

// add packageName in front of mappings
for (let tag in mappings) {
  mappings[tag] = `${packageName}-${mappings[tag]}`;
}

const docsDirectory = "./docs";
const outputDirectory = "./pages/docs";
markdownToVue.render(docsDirectory, outputDirectory, mappings);
fs.watch(docsDirectory, () => {
  markdownToVue.render(docsDirectory, outputDirectory, mappings);
});
