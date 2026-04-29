function updateView() {
  document.getElementById("app").innerHTML = /*HTML*/ `
        <h1>BugTracker</h1>
        ${createButtonsHtml()}
        ${renderPage()}
    `;
}

function overViewHtml() {
  // lage en egen instanse av errorsene, så ikke vi klusser i selve modellen
  let listToShow = [...model.data.errors];

  // FILTRERE(Sjekke opp status)
  if (model.inputs.filterStatus !== 'alle') {
    listToShow = listToShow.filter(err => err.status === model.inputs.filterStatus);
  }

  // SORTERE (Hvis sortBy er satt til priority)
  if (model.inputs.sortBy === 'priority') {
    const val = { high: 3, medium: 2, low: 1 }; //"oppslags" objekt, for å gi prioriteringene en tallverdi å sortere etter
    listToShow.sort((errorA, errorB) => val[errorB.priority] - val[errorA.priority]); //trekke a sin verdi fra b - blir det positivt tall skal b stå foran a 
  }

  // GENERER HTML! yay
  let html = /*HTML*/ `
    <h2>Oversikt</h2>
    <div class="filter-group">
      <button onclick="setFilterStatus('alle')">Alle</button>
      <button onclick="setFilterStatus('open')">Open</button>
      <button onclick="setFilterStatus('closed')">Closed</button>
      <button onclick="sortByPriority()">
        ${model.inputs.sortBy === 'priority' ? 'Fjern sortering' : 'Sorter etter priority'}
      </button>
    </div>
  `;

  for (let error of listToShow) {
    html += errorCardHtml(error);
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

  //lage HTML (dratt ut i egen funksjon - litt mer DRY )
  for (let error of errorsToShow) {
    console.log("error filtered: ", error)
    html += errorCardHtml(error)

  }
  return html;
}

function errorCardHtml(error) {
  //Finn name på personen ut fra ID'en - finnes ingen så forblir navnet "uoppgitt"
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
            <p>Priority: ${error.priority}</p>  
            <p>Status: ${error.status}</p>     
           </div>

            <hr>
             <button ${slettDisabled} class="${error.status !== 'closed' ? 'delete-btn-disabled' : ''}" onclick="deleteError(${error.id})">Slett</button>
         
            <button onclick="changeStatus(${error.id})">
                ${error.status === 'open' ? 'Merk som closed' : 'Merk som open'}
            </button>
            <p class="severity-high">${model.app.errorMsg}</p>
        </div>
    `;
}

function addErrorsHtml() {
  return /*HTML*/ `
    <h2>Legg til en feil</h2>
    <div class="add-error-form">
      <input type="text" placeholder="Tittel"  
        oninput="updateNewErrorField('title', this.value)" 
        value="${model.inputs.newError.title || ''}"
      />
      <textarea style="resize:none" placeholder="Beskriv feilen" 
        oninput="updateNewErrorField('description', this.value)">
        ${model.inputs.newError.description || ''}
      </textarea>

      <label>Alvorlighetsgrad:</label>
      <select onchange="updateNewErrorField('severity', this.value)">
        <option value="">-- Velg --</option>
        <option value="low" ${model.inputs.newError.severity === 'low' ? 'selected' : ''}>Low</option>
        <option value="medium" ${model.inputs.newError.severity === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="high" ${model.inputs.newError.severity === 'high' ? 'selected' : ''}>High</option>
      </select>
       <label>Prioritering:</label>
      <select onchange="updateNewErrorField('priority', this.value)">
        <option value="">-- Velg --</option>
        <option value="low" ${model.inputs.newError.priority === 'low' ? 'selected' : ''}>Low</option>
        <option value="medium" ${model.inputs.newError.priority === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="high" ${model.inputs.newError.priority === 'high' ? 'selected' : ''}>High</option>
      </select>
      <label>Ansvarlig:</label>
      <select onchange="updateNewErrorField('personId', this.value)">
        <option value="">-- Ikke satt --</option>
        ${model.data.persons.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}
      </select>
      <button onclick="addNewError()">Lagre</button>
    </div>
  `;
}

updateView();
