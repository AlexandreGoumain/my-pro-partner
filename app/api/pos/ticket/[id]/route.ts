import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/pos/ticket/[id]
 * Générer un ticket de caisse en HTML pour impression
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        entreprise: true,
        lignes: {
          include: {
            article: true,
          },
          orderBy: {
            ordre: "asc",
          },
        },
        paiements: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
    }

    const paiement = document.paiements[0];

    // Générer le HTML du ticket
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket - ${document.numero}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      padding: 20px;
      max-width: 300px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px dashed #000;
    }

    .company-name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .ticket-info {
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #000;
    }

    .info-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }

    .items {
      margin-bottom: 15px;
    }

    .item {
      margin-bottom: 8px;
    }

    .item-name {
      font-weight: bold;
      margin-bottom: 2px;
    }

    .item-details {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }

    .totals {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 2px dashed #000;
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }

    .total-line.final {
      font-size: 14px;
      font-weight: bold;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #000;
    }

    .payment {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px dashed #000;
      text-align: center;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 2px dashed #000;
      text-align: center;
      font-size: 11px;
    }

    .merci {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    @media print {
      body {
        padding: 0;
      }

      @page {
        size: 80mm auto;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">${document.entreprise.nom}</div>
    ${document.entreprise.adresse ? `<div>${document.entreprise.adresse}</div>` : ""}
    ${document.entreprise.telephone ? `<div>Tél: ${document.entreprise.telephone}</div>` : ""}
    ${document.entreprise.siret ? `<div>SIRET: ${document.entreprise.siret}</div>` : ""}
  </div>

  <div class="ticket-info">
    <div class="info-line">
      <span>Ticket:</span>
      <span>${document.numero}</span>
    </div>
    <div class="info-line">
      <span>Date:</span>
      <span>${new Date(document.dateEmission).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}</span>
    </div>
    ${
      document.client.nom !== "Vente comptoir"
        ? `<div class="info-line">
      <span>Client:</span>
      <span>${document.client.nom} ${document.client.prenom || ""}</span>
    </div>`
        : ""
    }
  </div>

  <div class="items">
    ${document.lignes
      .map(
        (ligne) => `
    <div class="item">
      <div class="item-name">${ligne.article?.nom || ligne.designation}</div>
      <div class="item-details">
        <span>${ligne.quantite} x ${Number(ligne.prix_unitaire_ht).toFixed(2)}€</span>
        <span>${Number(ligne.montant_ttc).toFixed(2)}€</span>
      </div>
    </div>
    `
      )
      .join("")}
  </div>

  <div class="totals">
    <div class="total-line">
      <span>Total HT:</span>
      <span>${Number(document.total_ht).toFixed(2)}€</span>
    </div>
    <div class="total-line">
      <span>TVA:</span>
      <span>${Number(document.total_tva).toFixed(2)}€</span>
    </div>
    <div class="total-line final">
      <span>TOTAL TTC:</span>
      <span>${Number(document.total_ttc).toFixed(2)}€</span>
    </div>
  </div>

  ${
    paiement
      ? `
  <div class="payment">
    <div>PAYÉ - ${paiement.moyen_paiement}</div>
  </div>
  `
      : ""
  }

  <div class="footer">
    <div class="merci">Merci de votre visite !</div>
    <div>À bientôt</div>
  </div>

  <script>
    // Auto-print on load
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error: any) {
    console.error("[TICKET_GENERATION_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération du ticket" },
      { status: 500 }
    );
  }
}
