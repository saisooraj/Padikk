import type { JSONContent } from "@tiptap/react";

/** Note.content stores Tiptap's JSON doc as a string (see schema comment on Note.content). */

export function emptyNoteDoc(): JSONContent {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

export function parseNoteContent(content: string): JSONContent {
  if (!content) return emptyNoteDoc();
  return JSON.parse(content) as JSONContent;
}

/** API-boundary check: content, if non-empty, must be a Tiptap JSON doc string. */
export function isValidNoteContent(content: string): boolean {
  if (!content) return true;
  try {
    const parsed = JSON.parse(content);
    return !!parsed && typeof parsed === "object" && parsed.type === "doc";
  } catch {
    return false;
  }
}

/** Flattens a note's stored JSON doc to plain text, for list-view previews. */
export function noteContentToPlainText(content: string): string {
  if (!content) return "";
  const doc = parseNoteContent(content);
  const parts: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.type === "text" && node.text) parts.push(node.text);
    node.content?.forEach(walk);
    if (node.type === "paragraph" || node.type === "heading") parts.push(" ");
  };
  walk(doc);
  return parts.join("").replace(/\s+/g, " ").trim();
}
