"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useDocuments } from "@/hooks/use-documents";
import { useDocumentListHandlers } from "@/hooks/use-document-list-handlers";

export default function CreditsPage() {
    const router = useRouter();
    const { data: documents = [], isLoading, refetch } = useDocuments("AVOIR");

    const { handleDelete } = useDocumentListHandlers({
        documentType: "AVOIR",
        onDeleteSuccess: refetch,
    });

    const handleView = (id: string) => {
        router.push(`/dashboard/documents/credits/${id}`);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Avoirs"
                description="Gérez vos avoirs et remboursements clients"
                actions={
                    <Button
                        onClick={() => router.push("/dashboard/documents/credits/new")}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Nouvel avoir
                    </Button>
                }
            />

            <DataTable
                columns={columns}
                data={documents}
                isLoading={isLoading}
                meta={{
                    onView: handleView,
                    onDelete: handleDelete,
                }}
            />
        </div>
    );
}
