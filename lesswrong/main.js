// ========== helpers
Node.prototype.on = Node.prototype.addEventListener;
function $(x) {
  return document.getElementById(x);
}

function escapeHTML(str) {
  const p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

// TODO: Find shorter way to do this?
function escapeATTR(str) {
  const parent = document.createElement("div");
  const p = document.createElement("p");
  p.setAttribute("title", str);
  parent.appendChild(p);
  return parent.innerHTML.slice(10, -6);
}

// html template string with escaping
function html(template, ...args) {
  const result = [template[0]];
  for (let i = 0; i < args.length; i++) {
    const str = args[i].toString();
    const insideAttr =
      template[i].endsWith(`"`) && template[i + 1].endsWith(`"`);
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
