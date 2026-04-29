console.log("controller loaded!")

function selectPage(page) {
  model.app.page = page;
  updateView()
}

function updateSearch(text) {
  model.inputs.searchQuery = text;
  updateView();
}

function updateNewErrorField(field, value) {
  //hvis det er personId - så må det parses om til et tall!
  if (field === 'personId') {
    model.inputs.newError[field] = value ? parseInt(value) : null; //spar på verdien hvis det er en verdi
  } else {
    model.inputs.newError[field] = value;
  }
}

function addNewError() {
  const inputs = model.inputs.newError;
  // Edge case: Sjekk at tittel er fylt ut
  if (!inputs.title) {
    alert("Feilen må ha en tittel!");
    return;
  }


  //nytt errorobjekt blir da:
  const newErrorObj = {
    id: model.data.errors.length + 1,
    title: inputs.title,
    description: inputs.description,
    severity: inputs.severity || 'low', // Default til low hvis ikke valgt noe
    personId: inputs.personId,
    status: 'open' // Alle nye starter som åpne !
  }

  // Push inn ny error i modellen
  model.data.errors.push(newErrorObj);

  // Nullstill modellen / new error skjema input
  model.inputs.newError = {
    title: '',
    description: '',
    severity: '',
    personId: null
  };

  // Oppdater og vis overview sida
  model.app.page = 'overview';
  updateView();
}

function changeStatus(id) {
  // Finn feilen i modellen ut fra ID'en og ta vare på den
  let error = null;
  for (let i = 0; i < model.data.errors.length; i++) {
    if (model.data.errors[i].id === id) {
      error = model.data.errors[i];
      break;
    }
  }

  // Endre statusen på erroren (hvis den er open, bli closed - og omvendt)

  if (error.status === 'open') {
    error.status = 'closed';
  } else {
    error.status = 'open';
  }

  updateView();
}

function deleteError(id) {
  model.app.errorMsg = '';
  // Finne indexen til erroren i lista og ta vare på den
  let index = -1; //ble krøll med "null" :(
  for (let i = 0; i < model.data.errors.length; i++) {
    if (model.data.errors[i].id == id) {
      index = i;
      break;
    }
  }

  // Sjekk om vi fant noe og index ble mer enn -1 OG at den er closed
  if (index > -1 && model.data.errors[index].status === 'closed') {
    model.data.errors.splice(index, 1);
    updateView();
  }
}

function setFilterStatus(status) {
  console.log("status filter satt: ", status)
  model.inputs.filterStatus = status;
  updateView();
}