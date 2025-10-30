import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      clean: true,
      cleanOnRerun: true,
      enabled: false,
      provider: "v8",
      include: ["source/*.ts", "source/**/*.ts"],
    },
    printConsoleTrace: true,
    reporters: ["verbose"],
    silent: false,
    typecheck: {
      include: ["source/*.ts", "source/**/*.ts"],
    },
    watch: false,
  },
});
