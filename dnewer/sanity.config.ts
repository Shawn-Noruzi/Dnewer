// sanity.config.ts (root)
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: 'Factory Optical CMS',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
