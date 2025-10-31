"use client";

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <>
                        {table.getFilteredSelectedRowModel().rows.length} sur{" "}
                        {table.getFilteredRowModel().rows.length} ligne(s)
                        sélectionnée(s).
                    </>
                )}
                {table.getFilteredSelectedRowModel().rows.length === 0 && (
                    <>
                        Affichage de {table.getFilteredRowModel().rows.length}{" "}
                        article(s)
                    </>
                )}
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Lignes par page
                    </span>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[60px] text-xs border-border/50">
                            <SelectValue
                                placeholder={
                                    table.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                    className="text-xs"
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} sur{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex border-border/50 hover:bg-muted/50"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">
                            Aller à la première page
                        </span>
                        <DoubleArrowLeftIcon className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 border-border/50 hover:bg-muted/50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Page précédente</span>
                        <ChevronLeftIcon className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 border-border/50 hover:bg-muted/50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Page suivante</span>
                        <ChevronRightIcon className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex border-border/50 hover:bg-muted/50"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">
                            Aller à la dernière page
                        </span>
                        <DoubleArrowRightIcon className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
