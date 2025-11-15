import { DocumentClient } from "@/lib/types/document.types";

export interface DocumentClientSectionProps {
    client: DocumentClient;
    clientName: string;
}

/**
 * Reusable component for displaying client information in document detail pages
 */
export function DocumentClientSection({
    client,
    clientName,
}: DocumentClientSectionProps) {
    return (
        <div>
            <h3 className="text-[14px] font-semibold text-black mb-3">Client</h3>
            <div className="space-y-1 text-[14px]">
                <p className="font-medium">{clientName}</p>
                {client.email && (
                    <p className="text-black/60">{client.email}</p>
                )}
                {client.telephone && (
                    <p className="text-black/60">{client.telephone}</p>
                )}
                {client.adresse && (
                    <p className="text-black/60">{client.adresse}</p>
                )}
            </div>
        </div>
    );
}
