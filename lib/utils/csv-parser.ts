/**
 * CSV Parser utility for import functionality
 */

import type { ParsedCSVRow } from "@/lib/types";

export interface CSVParseResult {
  headers: string[];
  rows: ParsedCSVRow[];
  errors: string[];
}

/**
 * Parse CSV file content
 */
export function parseCSV(content: string): CSVParseResult {
  const errors: string[] = [];
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return { headers: [], rows: [], errors: ["Le fichier CSV est vide"] };
  }

  // Parse headers
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  if (headers.length === 0) {
    return { headers: [], rows: [], errors: ["Aucune colonne détectée dans le fichier"] };
  }

  // Parse rows
  const rows: ParsedCSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = parseCSVLine(line);

    // Skip empty lines
    if (values.every((v) => !v || v.trim() === "")) {
      continue;
    }

    const row: ParsedCSVRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || null;
    });

    rows.push(row);
  }

  return { headers, rows, errors };
}

/**
 * Parse a single CSV line, handling quotes and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Convert object array to CSV
 */
export function objectsToCSV<T extends Record<string, unknown>>(
  objects: T[],
  headers?: string[]
): string {
  if (objects.length === 0) return "";

  const keys = headers || Object.keys(objects[0]);
  const headerRow = keys.join(",");

  const rows = objects.map((obj) => {
    return keys
      .map((key) => {
        const value = obj[key];
        const stringValue = value === null || value === undefined ? "" : String(value);

        // Escape quotes and wrap in quotes if contains comma or quote
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });

  return [headerRow, ...rows].join("\n");
}
