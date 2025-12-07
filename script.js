let names = [];
let groups = {};

function addName() {
  const name = document.getElementById("nameInput").value.trim();
  if (!name || names.includes(name)) return;
  names.push(name);
  renderNames();
  document.getElementById("nameInput").value = "";
}

function addGroup() {
  const group = document.getElementById("groupInput").value.trim();
  if (!group || groups[group]) return;
  groups[group] = [];
  renderGroups();
  document.getElementById("groupInput").value = "";
}

function renderNames() {
  const ul = document.getElementById("nameList");
  ul.innerHTML = "";
  names.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n;
    ul.appendChild(li);
  });
}

function renderGroups() {
  const ul = document.getElementById("groupList");
  ul.innerHTML = "";
  Object.keys(groups).forEach(g => {
    const li = document.createElement("li");
    li.textContent = g + ": " + (groups[g].join(", ") || "(empty)");
    const select = document.createElement("select");
    names.forEach(n => {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = n;
      select.appendChild(opt);
    });
    const btn = document.createElement("button");
    btn.textContent = "Add member";
    btn.onclick = () => {
      const member = select.value;
      if (!groups[g].includes(member)) groups[g].push(member);
      renderGroups();
    };
    li.appendChild(select);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function generateMatches() {
  let receivers = [...names];
  let result = {};

  function isValidPair(giver, receiver) {
    if (giver === receiver) return false;
    for (const g of Object.keys(groups)) {
      if (groups[g].includes(giver) && groups[g].includes(receiver)) {
        return false;
      }
    }
    return true;
  }

  for (const giver of names) {
    const options = receivers.filter(r => isValidPair(giver, r));
    if (options.length === 0) {
      alert("No valid matching exists. Try adjusting groups.");
      return;
    }
    const receiver = options[Math.floor(Math.random() * options.length)];
    result[giver] = receiver;
    receivers = receivers.filter(r => r !== receiver);
  }

  const ul = document.getElementById("results");
  ul.innerHTML = "";
  Object.keys(result).forEach(g => {
    const li = document.createElement("li");
    li.textContent = g + " → " + result[g];
    ul.appendChild(li);
  });
}
