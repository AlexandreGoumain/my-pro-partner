import { format } from "date-fns";
import type { ExportData } from "@/lib/types/import-export";

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends ExportData>(
    data: T[],
    headers: string[],
    filename: string
): void {
    if (data.length === 0) {
        throw new Error("No data to export");
    }

    const rows = data.map((item) => [
        item.nom || "",
        item.prenom || "",
        item.email || "",
        item.telephone || "",
        item.adresse || "",
        item.codePostal || "",
        item.ville || "",
        item.pays || "",
        item.notes || "",
        format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss"),
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
            row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(",")
        ),
    ].join("\n");

    downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
}

/**
 * Export data to JSON format
 */
export function exportToJSON<T>(data: T[], filename: string): void {
    if (data.length === 0) {
        throw new Error("No data to export");
    }

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, "application/json");
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
