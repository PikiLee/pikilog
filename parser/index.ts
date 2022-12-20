import * as markdownToVue from "./markdownToVue"
import * as fs from "node:fs"

const mappings = {
  h1: "head1",
  h2: "head2",
};

const docsDirectory = "./docs";
const outputDirectory = './pages/docs'
markdownToVue.render(docsDirectory, outputDirectory, mappings);
fs.watch(docsDirectory, () => {
  markdownToVue.render(docsDirectory, outputDirectory, mappings);
});