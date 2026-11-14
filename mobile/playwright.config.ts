import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    channel: "chrome",
    baseURL: "http://127.0.0.1:8091",
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx expo start --web --port 8091",
    url: "http://127.0.0.1:8091",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
