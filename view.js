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
    html += `${errorCardHtml(error)}`
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
      onchange = "updateSearch(this.value)"
    />
    ${createFilteredErrorList()}
  `;
  console.log(model.inputs.searchQuery)
  return html;
}

function createFilteredErrorList() {
  let html = '';
  let errorsToShow = [];
  for (let i = 0; i < model.data.errors.length; i++) {
    let error = model.data.errors[i];

    //matcher søketekst?
    let searchMatch = error.title.toLowerCase().includes(
      model.inputs.searchQuery.toLowerCase()) || error.description.toLowerCase().includes(model.inputs.searchQuery.toLowerCase());

    //Matcher status?
    let statusMatch = model.inputs.filterStatus === 'all' || error.status === model.inputs.filterStatus;

    if (searchMatch && statusMatch) {
      errorsToShow.push(error)
    }

  }

  //lage HTML (dra ut i egen funksjon?)
  for (let error of errorsToShow) {
    console.log("error filtered: ", error)
    html += errorCardHtml(error)

  }
  return html;
}

function errorCardHtml(error) {
  //Finn name på personen ut fra ID'en
  let personName = 'Uoppgitt';
  for (let i = 0; i < model.data.persons.length; i++) {
    if (model.data.persons[i].id === error.personId) {
      personName = model.data.persons[i].name;
      break;
    }
  }

  //sjekke status for å bestemme om delete knappen skal være aktiv eller ikke
  const slettDisabled = error.status !== 'closed' ? 'disabled' : '';
  //spytt ut HTML

  return `
        <div class="error-card">
            <h3>${error.title}</h3>
            <p>${error.description}</p>
            
         <div>
            <p><strong>Assigned: ${personName}</strong></p>
            <p class="severity-${error.severity}">
            <strong>Severity: ${error.severity}</strong>
            </p>
            <p>Status: ${error.status}</p>     
           </div>

            <hr>
             <button ${slettDisabled} onclick="deleteError()">Slett</button>
         
            <button onclick="toggleStatus(${error.id})">
                ${error.status === 'open' ? 'Merk som closed' : 'Merk som open'}
            </button>

        </div>
    `;
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
