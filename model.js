const model = {
  app: {
    page: "overview",
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
      },
    ],
  },
};
