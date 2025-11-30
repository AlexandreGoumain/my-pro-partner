import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

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
    infoRow: {
        fontSize: 9,
        color: "#666",
        marginBottom: 2,
    },
    section: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#fafafa",
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#000",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
        fontSize: 10,
    },
    rowLabel: {
        color: "#666",
    },
    rowValue: {
        fontWeight: "bold",
    },
    divider: {
        borderTop: "1 solid #ddd",
        marginVertical: 10,
    },
    totalSection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 14,
        fontWeight: "bold",
    },
    periodBadge: {
        backgroundColor: "#000",
        color: "#fff",
        padding: "6 12",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    attestation: {
        marginTop: 30,
        padding: 20,
        backgroundColor: "#fafafa",
        borderRadius: 4,
    },
    attestationTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    attestationText: {
        fontSize: 10,
        color: "#333",
        lineHeight: 1.6,
        textAlign: "justify",
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
    locataireSection: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#fff",
        border: "1 solid #e5e5e5",
        borderRadius: 4,
    },
    locataireInfo: {
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 4,
    },
    locataireDetails: {
        fontSize: 9,
        color: "#666",
        lineHeight: 1.4,
    },
});

const MOIS_LABELS: Record<number, string> = {
    1: "Janvier",
    2: "Février",
    3: "Mars",
    4: "Avril",
    5: "Mai",
    6: "Juin",
    7: "Juillet",
    8: "Août",
    9: "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
};

interface QuittancePdfRendererProps {
    quittance: {
        numero: string;
        dateGeneration: string;
        periode: {
            mois: number;
            annee: number;
        };
        bien?: {
            reference?: string;
            titre?: string;
            adresse?: string | null;
            codePostal?: string | null;
            ville?: string | null;
        } | null;
        locataire?: {
            nom: string;
            prenom?: string | null;
            adresse?: string | null;
            codePostal?: string | null;
            ville?: string | null;
        } | null;
        proprietaire?: {
            nom: string;
            prenom?: string | null;
        } | null;
        montants: {
            loyerHC: number;
            provisions: number;
            totalDu: number;
            montantPaye: number;
        };
        datePaiement?: Date | null;
    };
    company: {
        nom_entreprise?: string | null;
        siret?: string | null;
        adresse?: string | null;
        code_postal?: string | null;
        ville?: string | null;
    } | null;
}

export function QuittancePdfRenderer({
    quittance,
    company,
}: QuittancePdfRendererProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const locataireNom = quittance.locataire
        ? [quittance.locataire.prenom, quittance.locataire.nom].filter(Boolean).join(" ")
        : "Locataire";

    const locataireAdresse = quittance.locataire
        ? [
            quittance.locataire.adresse,
            quittance.locataire.codePostal && quittance.locataire.ville
                ? `${quittance.locataire.codePostal} ${quittance.locataire.ville}`
                : quittance.locataire.codePostal || quittance.locataire.ville,
        ].filter(Boolean).join(", ")
        : "";

    const bienAdresse = quittance.bien
        ? [
            quittance.bien.adresse,
            quittance.bien.codePostal && quittance.bien.ville
                ? `${quittance.bien.codePostal} ${quittance.bien.ville}`
                : quittance.bien.codePostal || quittance.bien.ville,
        ].filter(Boolean).join(", ")
        : "";

    const periodeLabel = `${MOIS_LABELS[quittance.periode.mois]} ${quittance.periode.annee}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>
                            {company?.nom_entreprise || "Gestionnaire"}
                        </Text>
                        <View style={styles.companyDetails}>
                            {company?.siret && <Text>SIRET : {company.siret}</Text>}
                            {company?.adresse && <Text>{company.adresse}</Text>}
                            {(company?.code_postal || company?.ville) && (
                                <Text>
                                    {company.code_postal} {company.ville}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.documentInfo}>
                        <Text style={styles.documentType}>Quittance de loyer</Text>
                        <Text style={styles.documentNumber}>{quittance.numero}</Text>
                        <Text style={styles.infoRow}>
                            Émise le {formatDate(quittance.dateGeneration)}
                        </Text>
                    </View>
                </View>

                {/* Période */}
                <View style={styles.periodBadge}>
                    <Text>Période : {periodeLabel}</Text>
                </View>

                {/* Locataire */}
                <View style={styles.locataireSection}>
                    <Text style={styles.sectionTitle}>Locataire</Text>
                    <Text style={styles.locataireInfo}>{locataireNom}</Text>
                    {locataireAdresse && (
                        <Text style={styles.locataireDetails}>{locataireAdresse}</Text>
                    )}
                </View>

                {/* Bien */}
                {quittance.bien && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Bien loué</Text>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Référence</Text>
                            <Text style={styles.rowValue}>{quittance.bien.reference || "-"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Désignation</Text>
                            <Text style={styles.rowValue}>{quittance.bien.titre || "-"}</Text>
                        </View>
                        {bienAdresse && (
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Adresse</Text>
                                <Text style={styles.rowValue}>{bienAdresse}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Détail du loyer */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Détail du loyer</Text>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Loyer hors charges</Text>
                        <Text style={styles.rowValue}>
                            {formatCurrency(quittance.montants.loyerHC)}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Provisions sur charges</Text>
                        <Text style={styles.rowValue}>
                            {formatCurrency(quittance.montants.provisions)}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Total dû</Text>
                        <Text style={styles.rowValue}>
                            {formatCurrency(quittance.montants.totalDu)}
                        </Text>
                    </View>
                </View>

                {/* Montant payé */}
                <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                        <Text>Montant acquitté</Text>
                        <Text>{formatCurrency(quittance.montants.montantPaye)}</Text>
                    </View>
                    {quittance.datePaiement && (
                        <Text style={{ fontSize: 9, color: "#666", marginTop: 6 }}>
                            Payé le {formatDate(quittance.datePaiement)}
                        </Text>
                    )}
                </View>

                {/* Attestation */}
                <View style={styles.attestation}>
                    <Text style={styles.attestationTitle}>Attestation</Text>
                    <Text style={styles.attestationText}>
                        Je soussigné(e) {company?.nom_entreprise || "le bailleur"}, propriétaire
                        du logement désigné ci-dessus, déclare avoir reçu de {locataireNom} la
                        somme de {formatCurrency(quittance.montants.montantPaye)} au titre du
                        paiement du loyer et des charges pour la période de {periodeLabel}.
                    </Text>
                    <Text style={[styles.attestationText, { marginTop: 10 }]}>
                        Cette quittance annule tous les reçus qui auraient pu être établis
                        précédemment en cas de paiement partiel du loyer.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        {company?.nom_entreprise || "Gestionnaire"}
                        {company?.siret && ` - SIRET : ${company.siret}`}
                    </Text>
                    <Text>
                        Document généré le {new Date().toLocaleDateString("fr-FR")}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
