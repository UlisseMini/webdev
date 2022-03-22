// ========== helpers
Node.prototype.on = Node.prototype.addEventListener;
function $(x) {
  return document.getElementById(x);
}

const zip = (a, b) => {
  if (a.length != b.length)
    throw Error(`length mismatch ${a.length} != ${b.length}`);
};

function escapeHTML(str) {
  const p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

// doesn't do anything, just for syntax highlighting
function html(template, ...args) {
  // template.length = args.length + 1
  const result = [template[0]];
  for (let i = 0; i < args.length; i++) {
    result.push(template[i + 1]);
    // TODO: escapeHTML in body, escapeATTR in attr
    result.push(args[i].toString());
  }
  console.log(result.join(""));
  return result.join("");
}
// TODO: why does this work but other doesn't
html = String.raw;

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
