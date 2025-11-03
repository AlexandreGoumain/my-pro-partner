"use client";

import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "./view-options";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    columnLabels?: Record<string, string>;
}

export function DataTableToolbar<TData>({
    table,
    columnLabels,
}: DataTableToolbarProps<TData>) {
    return (
        <div className="flex items-center justify-end">
            <DataTableViewOptions table={table} columnLabels={columnLabels} />
        </div>
    );
}
