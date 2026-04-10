function updateView() {
  document.getElementById("app").innerHTML = /*HTML*/ `
        <h1>BugTracker</h1>
        ${createButtonsHtml()}
        ${renderPage()}
    `;
}

function overViewHtml() {
  let html = /*HTML*/ `
    <h2>Oversikt</h2>
    <div class="filter-group">
      <button>Alle</button>
      <button>Open</button>
      <button>Closed</button>
    </div>
  `;

  for (let error of model.data.errors) {
    const person = model.data.persons.find((p) => p.id == error.personId);
    html += /*HTML*/ `
        <div class="error-card">
          <h3>${error.title}</h3>
          <p>Description: ${error.description}</p>
          <p>
            Assigned: 
            <b>${person ? person.name : "Ikke satt"}</b>
          </p>
          <p class="severity-${error.severity}">
            Severity: ${error.severity}
          </p>
          <p>
            Status: ${error.status}
          </p>
          <button onclick="deleteError()">Slett</button>
          <button onclick="toggleStatus()">
           ${error.status === "open" ? "Merk som closed" : "Merk som open"}
        </button>
        </div>
      `;
  }

  return html;
}

function createButtonsHtml() {
  return /*HTML*/ `
  <div class="nav-buttons">
    <button ${isActive("overview")} onclick="selectPage('overview')">Oversikt</button>
    <button ${isActive("search")} onclick="selectPage('search')">Søk</button>
    <button ${isActive("addErrors")} onclick="selectPage('addErrors')">Legg til</button>
  </div>
  `;
}

function isActive(currentPage) {
  return model.app.page == currentPage ? "class='active'" : "";
}

function renderPage() {
  if (model.app.page == "overview") {
    return overViewHtml();
  } else if (model.app.page == "search") {
    return searchErrorsHtml();
  } else if (model.app.page == "addErrors") {
    return addErrorsHtml();
  }
}

function searchErrorsHtml() {
  let html = /*HTML*/ `
    <h2>Søk</h2>
    <input 
      type="text" 
      placeholder="Søk etter feil..." 
    />
  `;
  return html;
}

function addErrorsHtml() {
  return /*HTML*/ `
    <h2>Legg til en feil</h2>
    <div class="add-error-form">
      <input type="text" placeholder="Tittel"/>
      <textarea style="resize:none" placeholder="Beskriv feilen"></textarea>
      <label>Alvorlighetsgrad:</label>
      <select>
        <option value="">-- Velg --</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <label>Ansvarlig:</label>
      <select>
        <option value="">-- Ikke satt --</option>
        ${model.data.persons.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}
      </select>
      <button>Lagre</button>
    </div>
  `;
}

updateView();
