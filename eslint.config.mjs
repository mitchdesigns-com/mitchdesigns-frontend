import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next 16 ships flat configs and dropped `next lint`; `pnpm lint` runs ESLint directly.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Compiler rules new in eslint-plugin-react-hooks 7 (with Next 16).
    // They flag patterns across existing components; warn until they're
    // worked through rather than failing lint.
    rules: {
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
    },
  },
  globalIgnores([".next/**", ".open-next/**", "out/**", "node_modules/**", "next-env.d.ts", "Case-studies/**", "public/**"]),
]);
