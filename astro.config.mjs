// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import glsl from "vite-plugin-glsl";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [glsl()],
  },
  devToolbar: {
    enabled: false,
  },
  fonts: [
    {
      cssVariable: "--font-neue-montreal",
      name: "Neue Montreal",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/NeueMontreal.woff2"],
            weight: "normal",
            style: "normal",
          },
        ],
      },
    },
  ],
});
