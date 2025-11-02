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
import type { PaginationInfo } from "./index";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
}

export function DataTablePagination<TData>({
    table,
    pagination,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps<TData>) {
    const isServerSide = !!pagination;

    const currentPage = isServerSide ? pagination.page : table.getState().pagination.pageIndex + 1;
    const pageSize = isServerSide ? pagination.limit : table.getState().pagination.pageSize;
    const totalPages = isServerSide ? pagination.totalPages : table.getPageCount();
    const totalItems = isServerSide ? pagination.total : table.getFilteredRowModel().rows.length;
    const canPreviousPage = isServerSide ? currentPage > 1 : table.getCanPreviousPage();
    const canNextPage = isServerSide ? currentPage < totalPages : table.getCanNextPage();

    const handlePageSizeChange = (value: string) => {
        const newSize = Number(value);
        if (isServerSide && onPageSizeChange) {
            onPageSizeChange(newSize);
        } else {
            table.setPageSize(newSize);
        }
    };

    const handleFirstPage = () => {
        if (isServerSide && onPageChange) {
            onPageChange(1);
        } else {
            table.setPageIndex(0);
        }
    };

    const handlePreviousPage = () => {
        if (isServerSide && onPageChange) {
            onPageChange(currentPage - 1);
        } else {
            table.previousPage();
        }
    };

    const handleNextPage = () => {
        if (isServerSide && onPageChange) {
            onPageChange(currentPage + 1);
        } else {
            table.nextPage();
        }
    };

    const handleLastPage = () => {
        if (isServerSide && onPageChange) {
            onPageChange(totalPages);
        } else {
            table.setPageIndex(table.getPageCount() - 1);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-black/40">
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <>
                        {table.getFilteredSelectedRowModel().rows.length} sur{" "}
                        {totalItems} ligne(s) sélectionnée(s).
                    </>
                )}
                {table.getFilteredSelectedRowModel().rows.length === 0 && (
                    <>
                        Affichage de {totalItems} devis
                    </>
                )}
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] text-black/60">
                        Lignes par page
                    </span>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="h-9 w-[65px] text-[13px] border-black/10">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem
                                    key={size}
                                    value={`${size}`}
                                    className="text-[13px]"
                                >
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-1 text-[13px] text-black/60">
                    Page {currentPage} sur {totalPages}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex border-black/10 hover:bg-black/5"
                        onClick={handleFirstPage}
                        disabled={!canPreviousPage}
                    >
                        <span className="sr-only">
                            Aller à la première page
                        </span>
                        <DoubleArrowLeftIcon className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 border-black/10 hover:bg-black/5"
                        onClick={handlePreviousPage}
                        disabled={!canPreviousPage}
                    >
                        <span className="sr-only">Page précédente</span>
                        <ChevronLeftIcon className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 border-black/10 hover:bg-black/5"
                        onClick={handleNextPage}
                        disabled={!canNextPage}
                    >
                        <span className="sr-only">Page suivante</span>
                        <ChevronRightIcon className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex border-black/10 hover:bg-black/5"
                        onClick={handleLastPage}
                        disabled={!canNextPage}
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
