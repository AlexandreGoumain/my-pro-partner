"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DocumentLine {
    designation: string;
    description?: string | null;
    quantite: number;
    prix_unitaire_ht: number;
    tva_taux: number;
    remise_pourcent: number;
    montant_ht: number;
    montant_tva: number;
    montant_ttc: number;
}

interface DocumentTemplateProps {
    type: "DEVIS" | "FACTURE" | "AVOIR";
    numero: string;
    dateEmission: Date;
    dateEcheance?: Date | null;
    client: {
        nom: string;
        prenom?: string | null;
        email?: string | null;
        telephone?: string | null;
        adresse?: string | null;
        code_postal?: string | null;
        ville?: string | null;
    };
    company: {
        nom_entreprise: string;
        siret?: string | null;
        tva_intra?: string | null;
        adresse?: string | null;
        code_postal?: string | null;
        ville?: string | null;
        telephone?: string | null;
        email?: string | null;
        site_web?: string | null;
        logo_url?: string | null;
    };
    lignes: DocumentLine[];
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    notes?: string | null;
    conditions_paiement?: string | null;
    mentions_legales?: string | null;
}

export function DocumentTemplate({
    type,
    numero,
    dateEmission,
    dateEcheance,
    client,
    company,
    lignes,
    total_ht,
    total_tva,
    total_ttc,
    notes,
    conditions_paiement,
    mentions_legales,
}: DocumentTemplateProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const clientName = client.prenom ? `${client.nom} ${client.prenom}` : client.nom;

    const typeLabel = {
        DEVIS: "DEVIS",
        FACTURE: "FACTURE",
        AVOIR: "AVOIR",
    }[type];

    return (
        <div className="bg-white p-12 max-w-[210mm] mx-auto" style={{ fontFamily: "system-ui" }}>
            {/* Header with company info */}
            <div className="flex justify-between mb-12">
                <div>
                    {company.logo_url ? (
                        <img src={company.logo_url} alt={company.nom_entreprise} className="h-16 mb-4" />
                    ) : (
                        <h1 className="text-2xl font-bold mb-4">{company.nom_entreprise}</h1>
                    )}
                    <div className="text-sm text-gray-600 space-y-1">
                        {company.adresse && <p>{company.adresse}</p>}
                        {(company.code_postal || company.ville) && (
                            <p>
                                {company.code_postal} {company.ville}
                            </p>
                        )}
                        {company.telephone && <p>Tél: {company.telephone}</p>}
                        {company.email && <p>Email: {company.email}</p>}
                        {company.site_web && <p>{company.site_web}</p>}
                        {company.siret && <p>SIRET: {company.siret}</p>}
                        {company.tva_intra && <p>TVA: {company.tva_intra}</p>}
                    </div>
                </div>

                <div className="text-right">
                    <div className="bg-black text-white px-6 py-3 inline-block mb-4">
                        <h2 className="text-2xl font-bold">{typeLabel}</h2>
                    </div>
                    <div className="text-sm space-y-1">
                        <p className="font-bold">N° {numero}</p>
                        <p>Date: {format(new Date(dateEmission), "dd/MM/yyyy")}</p>
                        {dateEcheance && (
                            <p>Échéance: {format(new Date(dateEcheance), "dd/MM/yyyy")}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Client info */}
            <div className="mb-8 border border-gray-200 p-4">
                <h3 className="font-bold mb-2">Client</h3>
                <div className="text-sm space-y-1">
                    <p className="font-semibold">{clientName}</p>
                    {client.email && <p>{client.email}</p>}
                    {client.telephone && <p>{client.telephone}</p>}
                    {client.adresse && <p>{client.adresse}</p>}
                    {(client.code_postal || client.ville) && (
                        <p>
                            {client.code_postal} {client.ville}
                        </p>
                    )}
                </div>
            </div>

            {/* Line items table */}
            <table className="w-full mb-8 text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-b-2 border-black">
                        <th className="text-left py-2 px-2">Désignation</th>
                        <th className="text-right py-2 px-2 w-20">Qté</th>
                        <th className="text-right py-2 px-2 w-24">P.U. HT</th>
                        <th className="text-right py-2 px-2 w-16">TVA</th>
                        <th className="text-right py-2 px-2 w-20">Remise</th>
                        <th className="text-right py-2 px-2 w-24">Total HT</th>
                    </tr>
                </thead>
                <tbody>
                    {lignes.map((ligne, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-3 px-2">
                                <div className="font-medium">{ligne.designation}</div>
                                {ligne.description && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        {ligne.description}
                                    </div>
                                )}
                            </td>
                            <td className="text-right py-3 px-2">{ligne.quantite}</td>
                            <td className="text-right py-3 px-2">{formatCurrency(ligne.prix_unitaire_ht)}</td>
                            <td className="text-right py-3 px-2">{ligne.tva_taux}%</td>
                            <td className="text-right py-3 px-2">{ligne.remise_pourcent}%</td>
                            <td className="text-right py-3 px-2 font-medium">
                                {formatCurrency(ligne.montant_ht)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
                <div className="w-64">
                    <div className="flex justify-between py-2 text-sm">
                        <span>Total HT</span>
                        <span className="font-medium">{formatCurrency(total_ht)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                        <span>TVA</span>
                        <span className="font-medium">{formatCurrency(total_tva)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-black font-bold text-lg">
                        <span>Total TTC</span>
                        <span>{formatCurrency(total_ttc)}</span>
                    </div>
                </div>
            </div>

            {/* Notes and conditions */}
            {(notes || conditions_paiement) && (
                <div className="mb-8 space-y-4 text-sm">
                    {conditions_paiement && (
                        <div>
                            <h4 className="font-bold mb-1">Conditions de paiement</h4>
                            <p className="text-gray-600">{conditions_paiement}</p>
                        </div>
                    )}
                    {notes && (
                        <div>
                            <h4 className="font-bold mb-1">Notes</h4>
                            <p className="text-gray-600">{notes}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Legal mentions */}
            {mentions_legales && (
                <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
                    <p>{mentions_legales}</p>
                </div>
            )}
        </div>
    );
}
