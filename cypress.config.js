import { defineConfig } from "cypress";
export default defineConfig({
    e2e: {
        setupNodeEvents: function (on, config) {
            // implement node event listeners here
        },
    },
});
