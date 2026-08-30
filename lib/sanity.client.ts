import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
import { projectId, dataset, apiVersion, readToken } from "@/sanity/env";

/**
 * Sanity read client. Returns null if the project ID isn't set — callers
 * fall back to hardcoded content so the site still builds in a fresh clone.
 */
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      token: readToken || undefined,
      perspective: "published"
    })
  : null;

export const imageUrlFor = (source: any) =>
  projectId
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
