import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/course-progress-tracker/",
    build: { sourcemap: false },
    plugins: [react()],
});
