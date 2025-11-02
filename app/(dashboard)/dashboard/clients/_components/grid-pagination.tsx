"use client";

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}

interface GridPaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function GridPagination({
    pagination,
    onPageChange,
    onPageSizeChange,
}: GridPaginationProps) {
    const { page, limit, total, totalPages } = pagination;
    const canPreviousPage = page > 1;
    const canNextPage = page < totalPages;

    const handlePageSizeChange = (value: string) => {
        onPageSizeChange(Number(value));
    };

    const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between border-t border-black/8 pt-4 mt-6">
            <div className="flex-1 text-[13px] text-black/40">
                Affichage de {startItem} à {endItem} sur {total} client(s)
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] text-black/60">
                        Clients par page
                    </span>
                    <Select
                        value={`${limit}`}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="h-9 w-[65px] text-[13px] border-black/10">
                            <SelectValue placeholder={limit} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[12, 24, 36, 48].map((size) => (
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
                    Page {page} sur {totalPages}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex border-black/10 hover:bg-black/5"
                        onClick={() => onPageChange(1)}
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
                        onClick={() => onPageChange(page - 1)}
                        disabled={!canPreviousPage}
                    >
                        <span className="sr-only">Page précédente</span>
                        <ChevronLeftIcon className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 border-black/10 hover:bg-black/5"
                        onClick={() => onPageChange(page + 1)}
                        disabled={!canNextPage}
                    >
                        <span className="sr-only">Page suivante</span>
                        <ChevronRightIcon className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex border-black/10 hover:bg-black/5"
                        onClick={() => onPageChange(totalPages)}
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
