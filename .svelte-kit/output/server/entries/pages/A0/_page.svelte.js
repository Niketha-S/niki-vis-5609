import { e as ensure_array_like } from "../../../chunks/index.js";
import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$payload) {
  let maxClick = 2;
  let cnt = maxClick;
  console.log("maxClick:", maxClick, "cnt:", cnt);
  const each_array = ensure_array_like([2, 4, 6]);
  $$payload.out += `<h1>A0</h1> <h1>Niketha Sabesan's VIS Site</h1> <img width="200px" src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1" alt="Coding Girl"> <div>You can click up to <select><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let optionNum = each_array[$$index];
    $$payload.out += `<option${attr("value", optionNum)}>${escape_html(optionNum)}</option>`;
  }
  $$payload.out += `<!--]--></select> times</div> <button${attr("disabled", cnt === 0, true)} class="svelte-1nypyey">Click Me</button> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p id="info">Remaining Number of Clicks: ${escape_html(cnt)}</p>`;
  }
  $$payload.out += `<!--]-->`;
}
export {
  _page as default
};
