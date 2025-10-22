// src/lib/sanityImage.ts
import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "../../lib/sanity";

const builder = imageUrlBuilder(sanity);
export function urlFor(src: any) {
  return builder.image(src);
}