import { d as stringify } from "../../chunks/index.js";
import { b as base } from "../../chunks/paths.js";
import { a as attr } from "../../chunks/attributes.js";
function _page($$payload) {
  $$payload.out += `<h1>Niketha's Assignments</h1> <a${attr("href", `${stringify(base)}/A0`)}>A0</a> <br> <a${attr("href", `${stringify(base)}/A1`)}>A1</a> <br> <a${attr("href", `${stringify(base)}/A2`)}>A2</a> <br> <a${attr("href", `${stringify(base)}/A3`)}>A3</a> <br>`;
}
export {
  _page as default
};
