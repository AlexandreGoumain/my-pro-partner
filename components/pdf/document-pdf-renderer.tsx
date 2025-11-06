import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";

// Register fonts (optional - using default fonts for now)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: "#1a1a1a",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    companyInfo: {
        maxWidth: "45%",
    },
    companyName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    companyDetails: {
        fontSize: 9,
        color: "#666",
        lineHeight: 1.4,
    },
    documentInfo: {
        textAlign: "right",
        maxWidth: "45%",
    },
    documentType: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    documentNumber: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 8,
    },
    statusBadge: {
        backgroundColor: "#f0f0f0",
        padding: "4 8",
        borderRadius: 4,
        fontSize: 8,
        textAlign: "center",
        marginBottom: 8,
    },
    infoRow: {
        fontSize: 9,
        color: "#666",
        marginBottom: 2,
    },
    clientSection: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: "#fafafa",
        borderRadius: 4,
    },
    clientTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#000",
    },
    clientName: {
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 4,
    },
    clientDetails: {
        fontSize: 9,
        color: "#666",
        lineHeight: 1.4,
    },
    table: {
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f5f5f5",
        padding: 8,
        fontWeight: "bold",
        fontSize: 9,
        borderBottom: "1 solid #ddd",
    },
    tableRow: {
        flexDirection: "row",
        padding: 8,
        borderBottom: "0.5 solid #e5e5e5",
        fontSize: 9,
    },
    col1: { width: "40%" },
    col2: { width: "12%", textAlign: "right" },
    col3: { width: "12%", textAlign: "right" },
    col4: { width: "12%", textAlign: "right" },
    col5: { width: "12%", textAlign: "right" },
    col6: { width: "12%", textAlign: "right" },
    itemDescription: {
        fontSize: 8,
        color: "#666",
        marginTop: 2,
    },
    totalsSection: {
        marginTop: 20,
        marginLeft: "auto",
        width: "40%",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
        fontSize: 10,
    },
    totalRowFinal: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 8,
        borderTop: "1 solid #000",
        fontSize: 12,
        fontWeight: "bold",
    },
    notesSection: {
        marginTop: 30,
        padding: 15,
        backgroundColor: "#fafafa",
        borderRadius: 4,
    },
    notesTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 8,
    },
    notesText: {
        fontSize: 9,
        color: "#666",
        lineHeight: 1.4,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 8,
        color: "#999",
        borderTop: "0.5 solid #ddd",
        paddingTop: 10,
    },
});

interface DocumentPdfRendererProps {
    document: {
        numero: string;
        type: "DEVIS" | "FACTURE" | "AVOIR";
        statut: string;
        dateEmission: Date;
        dateEcheance?: Date | null;
        validite_jours: number;
        client: {
            nom: string;
            prenom?: string | null;
            email?: string | null;
            telephone?: string | null;
            adresse?: string | null;
            code_postal?: string | null;
            ville?: string | null;
        };
        lignes: Array<{
            designation: string;
            description?: string | null;
            quantite: number;
            prix_unitaire_ht: number;
            tva_taux: number;
            remise_pourcent: number;
            montant_ht: number;
            montant_tva: number;
            montant_ttc: number;
        }>;
        total_ht: number;
        total_tva: number;
        total_ttc: number;
        acompte_montant?: number;
        reste_a_payer: number;
        notes?: string | null;
        conditions_paiement?: string | null;
    };
    company: {
        nom_entreprise: string;
        siret?: string | null;
        adresse?: string | null;
        code_postal?: string | null;
        ville?: string | null;
        telephone?: string | null;
        email?: string | null;
    };
}

export function DocumentPdfRenderer({
    document,
    company,
}: DocumentPdfRendererProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const documentTypeLabel = {
        DEVIS: "Devis",
        FACTURE: "Facture",
        AVOIR: "Avoir",
    }[document.type];

    const statutLabel = {
        BROUILLON: "Brouillon",
        ENVOYE: "Envoyé",
        ACCEPTE: "Accepté",
        REFUSE: "Refusé",
        PAYE: "Payé",
        ANNULE: "Annulé",
    }[document.statut as keyof typeof statutLabel] || document.statut;

    const clientName = document.client.prenom
        ? `${document.client.nom} ${document.client.prenom}`
        : document.client.nom;

    const clientAddress = [
        document.client.adresse,
        document.client.code_postal && document.client.ville
            ? `${document.client.code_postal} ${document.client.ville}`
            : document.client.code_postal || document.client.ville,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>
                            {company.nom_entreprise}
                        </Text>
                        <View style={styles.companyDetails}>
                            {company.siret && (
                                <Text>SIRET : {company.siret}</Text>
                            )}
                            {company.adresse && <Text>{company.adresse}</Text>}
                            {(company.code_postal || company.ville) && (
                                <Text>
                                    {company.code_postal} {company.ville}
                                </Text>
                            )}
                            {company.telephone && (
                                <Text>Tél : {company.telephone}</Text>
                            )}
                            {company.email && <Text>{company.email}</Text>}
                        </View>
                    </View>

                    <View style={styles.documentInfo}>
                        <Text style={styles.documentType}>
                            {documentTypeLabel}
                        </Text>
                        <Text style={styles.documentNumber}>
                            {document.numero}
                        </Text>
                        <View style={styles.statusBadge}>
                            <Text>{statutLabel}</Text>
                        </View>
                        <Text style={styles.infoRow}>
                            Date d'émission : {formatDate(document.dateEmission)}
                        </Text>
                        {document.dateEcheance && (
                            <Text style={styles.infoRow}>
                                Date d'échéance :{" "}
                                {formatDate(document.dateEcheance)}
                            </Text>
                        )}
                        <Text style={styles.infoRow}>
                            Validité : {document.validite_jours} jours
                        </Text>
                    </View>
                </View>

                {/* Client section */}
                <View style={styles.clientSection}>
                    <Text style={styles.clientTitle}>Client</Text>
                    <Text style={styles.clientName}>{clientName}</Text>
                    <View style={styles.clientDetails}>
                        {clientAddress && <Text>{clientAddress}</Text>}
                        {document.client.email && (
                            <Text>{document.client.email}</Text>
                        )}
                        {document.client.telephone && (
                            <Text>{document.client.telephone}</Text>
                        )}
                    </View>
                </View>

                {/* Items table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.col1}>Désignation</Text>
                        <Text style={styles.col2}>Qté</Text>
                        <Text style={styles.col3}>P.U. HT</Text>
                        <Text style={styles.col4}>TVA</Text>
                        <Text style={styles.col5}>Remise</Text>
                        <Text style={styles.col6}>Total HT</Text>
                    </View>

                    {document.lignes.map((ligne, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.col1}>
                                <Text>{ligne.designation}</Text>
                                {ligne.description && (
                                    <Text style={styles.itemDescription}>
                                        {ligne.description}
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.col2}>
                                {Number(ligne.quantite)}
                            </Text>
                            <Text style={styles.col3}>
                                {formatCurrency(Number(ligne.prix_unitaire_ht))}
                            </Text>
                            <Text style={styles.col4}>
                                {Number(ligne.tva_taux)}%
                            </Text>
                            <Text style={styles.col5}>
                                {Number(ligne.remise_pourcent)}%
                            </Text>
                            <Text style={styles.col6}>
                                {formatCurrency(Number(ligne.montant_ht))}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text>Total HT</Text>
                        <Text>{formatCurrency(Number(document.total_ht))}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text>TVA</Text>
                        <Text>
                            {formatCurrency(Number(document.total_tva))}
                        </Text>
                    </View>
                    <View style={styles.totalRowFinal}>
                        <Text>Total TTC</Text>
                        <Text>
                            {formatCurrency(Number(document.total_ttc))}
                        </Text>
                    </View>
                    {document.type === "FACTURE" &&
                        Number(document.acompte_montant || 0) > 0 && (
                            <>
                                <View style={[styles.totalRow, { marginTop: 8 }]}>
                                    <Text>Acompte versé</Text>
                                    <Text>
                                        - {formatCurrency(
                                            Number(document.acompte_montant)
                                        )}
                                    </Text>
                                </View>
                                <View style={[styles.totalRow, { fontWeight: "bold" }]}>
                                    <Text>Reste à payer</Text>
                                    <Text>
                                        {formatCurrency(
                                            Number(document.reste_a_payer)
                                        )}
                                    </Text>
                                </View>
                            </>
                        )}
                </View>

                {/* Notes and conditions */}
                {(document.conditions_paiement || document.notes) && (
                    <View style={styles.notesSection}>
                        {document.conditions_paiement && (
                            <>
                                <Text style={styles.notesTitle}>
                                    Conditions de paiement
                                </Text>
                                <Text style={styles.notesText}>
                                    {document.conditions_paiement}
                                </Text>
                            </>
                        )}
                        {document.notes && (
                            <>
                                <Text
                                    style={[
                                        styles.notesTitle,
                                        document.conditions_paiement && {
                                            marginTop: 12,
                                        },
                                    ]}
                                >
                                    Notes
                                </Text>
                                <Text style={styles.notesText}>
                                    {document.notes}
                                </Text>
                            </>
                        )}
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        {company.nom_entreprise}
                        {company.siret && ` - SIRET : ${company.siret}`}
                    </Text>
                    <Text>
                        Document généré le{" "}
                        {new Date().toLocaleDateString("fr-FR")}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
