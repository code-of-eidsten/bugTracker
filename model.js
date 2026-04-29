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
      personId: null,
      priority: ''
    },
    filterStatus: 'alle',
    sortBy: 'none'  //Ekstraoppgave - knapp som sorterer etter prioritet
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
        title: "Feil på bilde på profil",
        description: "Blir broken link på profilbildet mitt.",
        severity: "medium",
        status: "open",
        personId: 1,
        priority: "low"
      },
      {
        id: 2,
        title: "Login bug",
        description: "Error når du sender inn pålogging skjema",
        severity: "high",
        status: "open",
        personId: 1,
        priority: "high"
      },
      {
        id: 3,
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
