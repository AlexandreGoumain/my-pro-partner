/**
 * Centralized repository exports
 * Import all repositories from this file
 */

import { prisma } from "@/lib/prisma";

// Export base repository
export {
    BaseRepository,
    type PaginatedResult,
    type PaginationParams,
} from "./base.repository";

// Import repository classes
import { ArticleRepository } from "./article.repository";
import { AutomationRepository } from "./automation.repository";
import { CampaignRepository } from "./campaign.repository";
import { ClientRepository } from "./client.repository";
import { DocumentRepository } from "./document.repository";
import { LoyaltyLevelRepository } from "./loyalty-level.repository";
import { PaymentLinkRepository } from "./payment-link.repository";
import { SegmentRepository } from "./segment.repository";
import { StoreRepository } from "./store.repository";
import { TerminalRepository } from "./terminal.repository";
import { UserRepository } from "./user.repository";

// Export repository classes
export {
    ArticleRepository,
    AutomationRepository,
    CampaignRepository,
    ClientRepository,
    DocumentRepository,
    LoyaltyLevelRepository,
    PaymentLinkRepository,
    SegmentRepository,
    StoreRepository,
    TerminalRepository,
    UserRepository,
};

export const clientRepository = new ClientRepository(prisma);
export const articleRepository = new ArticleRepository(prisma);
export const segmentRepository = new SegmentRepository(prisma);
export const documentRepository = new DocumentRepository(prisma);
export const campaignRepository = new CampaignRepository(prisma);
export const loyaltyLevelRepository = new LoyaltyLevelRepository(prisma);
export const storeRepository = new StoreRepository(prisma);
export const terminalRepository = new TerminalRepository(prisma);
export const paymentLinkRepository = new PaymentLinkRepository(prisma);
export const userRepository = new UserRepository(prisma);
export const automationRepository = new AutomationRepository(prisma);
