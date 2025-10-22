// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import { groq } from 'next-sanity';

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});


/** Optional convenience queries — adjust type name to your schema */
export const queries = {
  allPosts: groq`*[_type in ["post","blogPost"]] | order(publishedAt desc){
    _id, title, slug, excerpt, coverImage, publishedAt, views, tags
  }`,
  postBySlug: groq`*[_type in ["post","blogPost"] && slug.current == $slug][0]{
    _id, title, slug, excerpt, coverImage, publishedAt, views, tags, body
  }`,
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
  views?: number;
  tags?: string[];
};


export const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: true,
  perspective: "published",
});

/** Write/admin client (server-only: API route, server actions) */
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});


export { groq };

