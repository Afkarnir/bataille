import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    baseUrl: 'http://localhost:4200',

    env: {
      apiUrl: '/api/v1',
      waitBetweenTurns: 2000,
    },
  },
});
