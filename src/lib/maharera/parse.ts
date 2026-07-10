// -----------------------------------------------------------------------------
// HTML parsing for MahaRERA pages — dependency-free and layout-agnostic.
//
// The portal's markup is server-rendered and changes over time (tables in some
// vintages, definition lists / label-span pairs in others). Rather than pin to
// brittle CSS selectors we flatten the document into ordered text "cells" and
// read a field's value as the chunk that follows its label. This works for
// <td>Label</td><td>Value</td>, <th>/<td>, <dt>/<dd>, and <label>/<span>
// layouts alike, and degrades gracefully when a field is absent.
// -----------------------------------------------------------------------------

import type { LiveProject } from "./types";

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&[a-z]+;|&#39;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m);
}

/** Flatten HTML into an ordered list of visible, non-empty text chunks. */
export function textCells(html: string): string[] {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .split(/<[^>]+>/)
    .map((s) => decodeEntities(s).replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const norm = (s: string) => s.toLowerCase().replace(/[:*]+$/, "").replace(/\s+/g, " ").trim();

/**
 * Read the value for a field given one or more candidate labels.
 * Strategy 1: a single cell of the form "Label : value".
 * Strategy 2: the cell immediately after the label cell (skipping empties),
 *             provided that next cell is not itself one of the known labels.
 */
export function pick(
  cells: string[],
  labels: string[],
  knownLabels: Set<string>
): string | undefined {
  const wanted = labels.map(norm);

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const cn = norm(cell);

    // Strategy 1 — "Label: value" inside one chunk.
    for (const w of wanted) {
      if (cn.startsWith(w + " :") || cn === w || cn.startsWith(w + ":")) {
        const inline = cell.split(/:([\s\S]+)/)[1]?.trim();
        if (inline) return inline;
      }
    }

    // Strategy 2 — value is the next meaningful chunk.
    if (wanted.includes(cn)) {
      const next = cells[i + 1];
      if (next && !knownLabels.has(norm(next))) return next;
    }
  }
  return undefined;
}

// Every label we understand — used so a value lookup never returns another
// field's label as if it were a value.
const FIELD_LABELS: Record<keyof Omit<LiveProject, "rera" | "sourceUrl" | "extra">, string[]> = {
  name: ["Project Name", "Name of Project"],
  promoter: ["Promoter Name", "Promoter", "Name of Promoter", "Developer"],
  projectType: ["Project Type", "Type of Project", "Type"],
  status: ["Project Status", "Status"],
  registeredOn: ["Registration Date", "Date of Registration", "Registered On"],
  proposedCompletion: [
    "Proposed Date of Completion",
    "Proposed Completion Date",
    "Proposed Completion",
  ],
  revisedCompletion: [
    "Revised Proposed Date of Completion",
    "Revised Completion Date",
    "Extended Completion Date",
  ],
  district: ["District"],
  taluka: ["Taluka"],
  village: ["Village"],
  pincode: ["Pin Code", "Pincode", "PIN"],
  totalArea: ["Total Area", "Total Area Of Land", "Area of Land", "Total Land Area"],
  totalBuildings: ["Total Number of Buildings", "Number of Buildings", "Total Buildings"],
  totalApartments: [
    "Total Number of Apartments",
    "Number of Apartments",
    "Total Apartments",
    "Total Units",
  ],
  litigations: ["Litigations", "Litigation", "Cases"],
};

const ALL_KNOWN_LABELS = new Set<string>(
  Object.values(FIELD_LABELS).flat().map(norm)
);

/**
 * Parse a MahaRERA project detail (or search-result) page into a LiveProject.
 * Returns the fields it could confidently read; unread fields stay undefined.
 */
export function parseProjectDetail(
  html: string,
  rera: string,
  sourceUrl?: string
): LiveProject {
  const cells = textCells(html);
  const result: LiveProject = { rera, sourceUrl };

  for (const key of Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[]) {
    const val = pick(cells, FIELD_LABELS[key], ALL_KNOWN_LABELS);
    if (val) result[key] = val;
  }

  return result;
}

/**
 * From a search-results page, extract the best link to a project's detail page.
 * Best-effort: prefer an anchor whose href or text references the registration
 * number, otherwise the first anchor that looks like a project-details link.
 */
export function extractDetailUrl(
  html: string,
  rera: string,
  base: string
): string | undefined {
  const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const reraLc = rera.toLowerCase();

  const scored = anchors
    .map((m) => {
      const href = decodeEntities(m[1]);
      const text = textCells(m[2]).join(" ").toLowerCase();
      let score = 0;
      if (href.toLowerCase().includes(reraLc) || text.includes(reraLc)) score += 10;
      if (/project[-_]?detail|view[-_]?project|projectdetails|\/project\//i.test(href))
        score += 4;
      if (/\b(view|details|detail)\b/.test(text)) score += 1;
      return { href, score };
    })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = scored[0]?.href;
  if (!best) return undefined;
  try {
    return new URL(best, base).toString();
  } catch {
    return undefined;
  }
}

/** Heuristic: does this page look like it actually contains a project record? */
export function looksLikeProjectPage(project: LiveProject): boolean {
  return Boolean(project.name || project.promoter || project.district);
}
