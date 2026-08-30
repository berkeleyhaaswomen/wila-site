import type { StructureResolver } from "sanity/structure";

/**
 * Custom Studio structure — pins siteSettings as a singleton and groups the
 * rest of the content types with friendly labels.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      S.divider(),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("alumnaSpotlight").title("Alumna spotlights"),
      S.documentTypeListItem("boardMember").title("Board members")
    ]);
