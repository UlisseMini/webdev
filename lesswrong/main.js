// ========== helpers
Node.prototype.on = Node.prototype.addEventListener;
function $(x) {
  return document.getElementById(x);
}

function h(tag, attrs, children) {
  const el = document.createElement(tag);
  for (const attr in attrs || {}) {
    el.setAttribute(attr, attrs[attr]);
  }
  el.append(...(children || []));
  return el;
}

const escapeHTML = (str) => h("p", {}, [str]).innerHTML;
const escapeATTR = (str) =>
  h("div", {}, [h("p", { title: str })]).innerHTML.slice(10, -6);

// html template string with escaping
function html(template, ...args) {
  const result = [template[0]];
  for (let i = 0; i < args.length; i++) {
    const str = args[i].toString();
    // NOTE: only works for "${x}" NOT more complex exprs like "${x} ${y}"
    const insideAttr =
      template[i].endsWith(`"`) && template[i + 1].startsWith(`"`);
    const escaped = insideAttr ? escapeATTR(str) : escapeHTML(str);
    result.push(escaped);
    result.push(template[i + 1]);
  }
  return result.join("");
}

// ========== code

const recommendations = fetch("recommendations.json").then((r) => r.json());

document.addEventListener("DOMContentLoaded", () => {
  $("sidebar-icon").on("click", (e) => {
    if ($("sidebar").style.transform == "translateX(-100%)") {
      // show
      $("sidebar").style.transform = "translateX(0px)";
    } else {
      // hide
      $("sidebar").style.transform = "translateX(-100%)";
    }
  });

  $("search-icon").on("click", (e) => {
    $("search-form").style.display = "block";
    $("search-form").children[0].focus();
  });

  recommendations.then((arr) => {
    let htmls = [];
    arr.forEach((rec) => {
      // TODO: Fix escaping description
      // TODO: Fix xss
      htmls.push(html`
        <article class="card" title="${rec.description}">
          <img src="${rec.img}" />
          <div class="meta">
            <div class="title">${rec.title}</div>
            <div class="author">${rec.author}</div>
          </div>
        </article>
      `);
    });
    $("recommendations").innerHTML = htmls.join("\n");
  });
});
