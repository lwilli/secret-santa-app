let names = [];
let groups = {};

document.getElementById("bulkAddBtn").onclick = bulkAdd;
document.getElementById("addGroupBtn").onclick = addGroup;
document.getElementById("generateBtn").onclick = generate;

function bulkAdd() {
  const text = document.getElementById("bulkNames").value.trim();
  if (!text) return;
  const newNames = text.split(/\n+/).map(n => n.trim()).filter(n => n.length);
  newNames.forEach(n => { if (!names.includes(n)) names.push(n); });
  document.getElementById("bulkNames").value = "";
  renderGroups();
}

function addGroup() {
  const g = document.getElementById("newGroupName").value.trim();
  if (!g || groups[g]) return;
  groups[g] = [];
  document.getElementById("newGroupName").value = "";
  renderGroups();
}

function createUngrouped(parent) {
  const box = document.createElement("div");
  box.className = "group-members ungrouped";
  box.dataset.group = "";
  parent.prepend(box);
  return box;
}

function renderGroups() {
  const container = document.getElementById("groups");
  container.innerHTML = "";

  let ungrouped = createUngrouped(container);

  Object.keys(groups).forEach(g => {
    const div = document.createElement("div");
    div.className = "group";

    div.innerHTML = `
      <h3>${g}
        <button class="delete-group" data-group="${g}">Delete</button>
      </h3>
      <div class="group-members"
           data-group="${g}"
           ondragover="dragOver(event)"
           ondrop="drop(event, '${g}')"></div>
    `;

    div.querySelector(".delete-group").onclick = () => {
      delete groups[g];
      renderGroups();
    };

    container.appendChild(div);
  });

  names.forEach(n => {
    const span = document.createElement("span");
    span.className = "member";
    span.draggable = true;
    span.textContent = n;
    span.id = "member-" + n;
    span.ondragstart = dragStart;

    const group = Object.keys(groups).find(g => groups[g].includes(n));
    const target = group
      ? container.querySelector(`.group-members[data-group="${group}"]`)
      : ungrouped;

    target.appendChild(span);
  });
}

let dragItem = null;
function dragStart(e) { dragItem = e.target.textContent; }
function dragOver(e) { e.preventDefault(); }

function drop(e, groupName) {
  e.preventDefault();
  Object.keys(groups).forEach(g => {
    groups[g] = groups[g].filter(n => n !== dragItem);
  });
  if (groupName) groups[groupName].push(dragItem);
  renderGroups();
}

function generate() {
  let receivers = [...names];
  let result = {};

  const valid = (giver, receiver) => {
    if (giver === receiver) return false;
    return !Object.values(groups).some(grp => grp.includes(giver) && grp.includes(receiver));
  };

  for (const giver of names) {
    const options = receivers.filter(r => valid(giver, r));
    if (!options.length) {
      alert("No valid match exists. Adjust exclusion groups.");
      return;
    }
    const pick = options[Math.floor(Math.random() * options.length)];
    result[giver] = pick;
    receivers = receivers.filter(r => r !== pick);
  }

  const ul = document.getElementById("results");
  ul.innerHTML = "";
  Object.keys(result).forEach(g => {
    const li = document.createElement("li");
    li.textContent = g + " → " + result[g];
    ul.appendChild(li);
  });
}
