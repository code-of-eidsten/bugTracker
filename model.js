const model = {
  app: {
    page: "overview",
    errorMsg: '',
  },
  inputs: {
    searchQuery: '',
    newError: {
      title: '',
      description: '',
      priority: '',
      personId: null
    },
    filterStatus: 'alle',
    sortBy: 'priority'  //Ekstraoppgave - knapp som sorterer etter prioritet
  },

  data: {
    persons: [
      { id: 1, name: "Per" },
      { id: 2, name: "Pål" },
      { id: 3, name: "Espen" },
    ],
    errors: [
      {
        id: 1,
        title: "Login bug",
        description: "Error når du sender inn pålogging skjema",
        severity: "high",
        status: "open",
        personId: 1,
      },
      {
        id: 2,
        title: "Layout på mobilen",
        description: "Layout funker ikke på mobilen",
        severity: "low",
        status: "closed",
        personId: 2,
        priority: "low"
      },
    ],
  },
};
