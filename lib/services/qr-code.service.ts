import QRCode from "qrcode";

/**
 * Service de génération de QR Codes pour les paiements
 */
export class QRCodeService {
  /**
   * Générer un QR Code pour payer une facture
   * @param documentId - ID du document
   * @param baseUrl - URL de base de l'application
   * @returns Data URL du QR code (image base64)
   */
  static async generatePaymentQRCode(documentId: string, baseUrl: string): Promise<string> {
    const paymentUrl = `${baseUrl}/pay/${documentId}`;

    try {
      // Générer le QR code avec des options optimisées
      const qrCodeDataURL = await QRCode.toDataURL(paymentUrl, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error("[QR_CODE_ERROR]", error);
      throw new Error("Erreur lors de la génération du QR code");
    }
  }

  /**
   * Générer un QR Code pour un lien de paiement personnalisé
   * @param paymentLinkId - ID du lien de paiement
   * @param baseUrl - URL de base
   * @returns Data URL du QR code
   */
  static async generatePaymentLinkQRCode(paymentLinkId: string, baseUrl: string): Promise<string> {
    const paymentUrl = `${baseUrl}/payment-link/${paymentLinkId}`;

    try {
      const qrCodeDataURL = await QRCode.toDataURL(paymentUrl, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error("[QR_CODE_ERROR]", error);
      throw new Error("Erreur lors de la génération du QR code");
    }
  }

  /**
   * Générer un QR Code pour n'importe quelle URL
   * @param url - URL à encoder
   * @param size - Taille du QR code (défaut: 300)
   * @returns Data URL du QR code
   */
  static async generateQRCode(url: string, size: number = 300): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(url, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error("[QR_CODE_ERROR]", error);
      throw new Error("Erreur lors de la génération du QR code");
    }
  }

  /**
   * Générer un QR code au format SVG (pour impression haute qualité)
   * @param url - URL à encoder
   * @returns SVG string
   */
  static async generateQRCodeSVG(url: string): Promise<string> {
    try {
      const qrCodeSVG = await QRCode.toString(url, {
        type: "svg",
        errorCorrectionLevel: "M",
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return qrCodeSVG;
    } catch (error) {
      console.error("[QR_CODE_SVG_ERROR]", error);
      throw new Error("Erreur lors de la génération du QR code SVG");
    }
  }
}
