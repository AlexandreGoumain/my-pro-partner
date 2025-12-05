import { prisma } from "@/lib/prisma";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";

/**
 * DELETE /api/admin/delete-entire-db
 * EXTREME DANGER - This deletes the ENTIRE database
 * Only available in development mode + requires authentication
 */
export async function DELETE() {
    return withErrorHandling(
        async () => {
            // Only allow in development
            if (process.env.NODE_ENV !== "development") {
                return NextResponse.json(
                    { message: "Cette action est uniquement disponible en développement" },
                    { status: 403 }
                );
            }

            // Require authentication even in development
            await requireTenantAuth();

            // Delete all data in the correct order (respecting foreign key constraints)
            // Start with child tables and work up to parent tables

            // ===== COPROPRIETE =====
            await prisma.membreConseilSyndical.deleteMany();
            await prisma.compteCopropriete.deleteMany();
            await prisma.travauxCopropriete.deleteMany();
            await prisma.resolutionAG.deleteMany();
            await prisma.assembleeGenerale.deleteMany();
            await prisma.ligneAppelCharges.deleteMany();
            await prisma.appelCharges.deleteMany();
            await prisma.ecritureComptableCopro.deleteMany();
            await prisma.lotCopropriete.deleteMany();
            await prisma.copropriete.deleteMany();

            // ===== LOCATION / BAIL =====
            await prisma.incidentLocatif.deleteMany();
            await prisma.etatDesLieux.deleteMany();
            await prisma.appelLoyer.deleteMany();
            await prisma.bailLocatif.deleteMany();

            // ===== IMMOBILIER =====
            await prisma.rechercheAcquereur.deleteMany();
            await prisma.leadPortail.deleteMany();
            await prisma.diffusionAnnonce.deleteMany();
            await prisma.configurationPortail.deleteMany();
            await prisma.offreAchat.deleteMany();
            await prisma.estimationBien.deleteMany();
            await prisma.visiteImmobilier.deleteMany();
            await prisma.mandatImmobilier.deleteMany();
            await prisma.bienImmobilier.deleteMany();

            // ===== JURIDIQUE =====
            await prisma.diligence.deleteMany();
            await prisma.echeanceProcedurale.deleteMany();
            await prisma.partieAdverse.deleteMany();
            await prisma.affaire.deleteMany();

            // ===== COMPTABLE =====
            await prisma.echeanceFiscale.deleteMany();
            await prisma.entreeTemps.deleteMany();
            await prisma.mission.deleteMany();

            // ===== FITNESS =====
            await prisma.presenceFitness.deleteMany();
            await prisma.salleFitness.deleteMany();
            await prisma.reservationCours.deleteMany();
            await prisma.seanceCours.deleteMany();
            await prisma.coursCollectif.deleteMany();
            await prisma.abonnementFitness.deleteMany();
            await prisma.typeAbonnementFitness.deleteMany();
            await prisma.cabine.deleteMany();

            // ===== RENDEZ-VOUS / EMPLOYES =====
            await prisma.rendezVous.deleteMany();
            await prisma.disponibiliteEmploye.deleteMany();
            await prisma.employe.deleteMany();
            await prisma.prestation.deleteMany();

            // ===== RESTAURANT =====
            await prisma.menuItem.deleteMany();
            await prisma.reservation.deleteMany();
            await prisma.tableRestaurant.deleteMany();

            // ===== CONTRATS / ENTRETIENS =====
            await prisma.certificatEntretien.deleteMany();
            await prisma.equipementClient.deleteMany();
            await prisma.entretienPrevu.deleteMany();
            await prisma.contratEntretien.deleteMany();

            // ===== STOCK CAMIONNETTE =====
            await prisma.mouvementStockCamionnette.deleteMany();
            await prisma.stockCamionnette.deleteMany();
            await prisma.entretienVehicule.deleteMany();
            await prisma.camionnette.deleteMany();

            // ===== INTERVENTIONS =====
            await prisma.interventionHistorique.deleteMany();
            await prisma.interventionTimeLog.deleteMany();
            await prisma.interventionMateriel.deleteMany();
            await prisma.intervention.deleteMany();

            // ===== REPARATIONS =====
            await prisma.reparationHistorique.deleteMany();
            await prisma.reparationPhoto.deleteMany();
            await prisma.reparationIntervention.deleteMany();
            await prisma.reparationLignePiece.deleteMany();
            await prisma.reparation.deleteMany();

            // ===== EMPLOYEE =====
            await prisma.employee.deleteMany();

            // ===== BANK / TERMINAL =====
            await prisma.bankTransaction.deleteMany();
            await prisma.terminal.deleteMany();

            // ===== PAYMENT LINKS =====
            await prisma.paymentLink.deleteMany();

            // ===== CHATBOT =====
            await prisma.chatbotActionToken.deleteMany();
            await prisma.chatbotAuditLog.deleteMany();
            await prisma.message.deleteMany();
            await prisma.conversation.deleteMany();

            // ===== CAMPAIGNS / AUTOMATIONS =====
            await prisma.automationExecution.deleteMany();
            await prisma.automation.deleteMany();
            await prisma.campaign.deleteMany();

            // ===== FIDELITE =====
            await prisma.mouvementPoints.deleteMany();
            await prisma.niveauFidelite.deleteMany();

            // ===== DOCUMENTS =====
            await prisma.serieDocument.deleteMany();
            await prisma.parametresEntreprise.deleteMany();
            await prisma.mouvementStock.deleteMany();
            await prisma.paiement.deleteMany();
            await prisma.ligneDocument.deleteMany();
            await prisma.document.deleteMany();

            // ===== ARTICLES =====
            await prisma.demontageArticle.deleteMany();
            await prisma.rachatArticle.deleteMany();
            await prisma.ressourceAtelier.deleteMany();
            await prisma.article.deleteMany();
            await prisma.champPersonnalise.deleteMany();
            await prisma.categorie.deleteMany();

            // ===== SEGMENTS =====
            await prisma.segment.deleteMany();

            // ===== CLIENTS =====
            await prisma.clientNotification.deleteMany();
            await prisma.client.deleteMany();

            // ===== TOKENS =====
            await prisma.userInvitationToken.deleteMany();
            await prisma.invitationToken.deleteMany();
            await prisma.passwordResetToken.deleteMany();

            // ===== USER RELATED =====
            await prisma.timeEntry.deleteMany();
            await prisma.userSchedule.deleteMany();
            await prisma.userActivity.deleteMany();
            await prisma.userPermissions.deleteMany();

            // ===== STORE / STOCK =====
            await prisma.stockTransferItem.deleteMany();
            await prisma.stockTransfer.deleteMany();
            await prisma.storeStockItem.deleteMany();
            await prisma.registerSession.deleteMany();
            await prisma.register.deleteMany();
            await prisma.store.deleteMany();

            // ===== SUBSCRIPTION / USAGE =====
            await prisma.usageCounter.deleteMany();
            await prisma.subscription.deleteMany();

            // ===== WAITLIST / CONTACT =====
            await prisma.waitlist.deleteMany();
            await prisma.contactMessage.deleteMany();

            // ===== USERS =====
            await prisma.user.deleteMany();

            // ===== ENTERPRISES (last) =====
            await prisma.entreprise.deleteMany();

            return NextResponse.json({
                message: "Toute la base de données a été supprimée avec succès",
                success: true,
            });
        },
        { resourceName: "Database", operation: "delete-entire" }
    );
}
