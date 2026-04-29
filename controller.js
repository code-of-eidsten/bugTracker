console.log("controller loaded!")

function selectPage(page) {
  model.app.page = page;
  updateView()
}

function updateSearch(text) {
  model.inputs.searchQuery = text;
  updateView();
}

function addError() {

}

function changeStatus() {

}

function deleteIt() {

}