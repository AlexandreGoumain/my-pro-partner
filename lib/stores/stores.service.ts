/**
 * Service de gestion des magasins (multi-stores)
 * Handles CRUD for stores, registers, and stock transfers
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma";

// ============================================
// STORES
// ============================================

export async function getStores(entrepriseId: string) {
  return await prisma.store.findMany({
    where: { entrepriseId },
    include: {
      registers: true,
      _count: {
        select: { documents: true, stockItems: true },
      },
    },
    orderBy: [
      { isMainStore: "desc" },
      { createdAt: "asc" },
    ],
  });
}

export async function createStore(entrepriseId: string, data: Omit<Prisma.StoreCreateInput, 'entreprise'>) {
  return await prisma.store.create({
    data: {
      ...data,
      entreprise: { connect: { id: entrepriseId } },
    },
    include: { registers: true },
  });
}

export async function updateStore(storeId: string, data: Prisma.StoreUpdateInput) {
  return await prisma.store.update({
    where: { id: storeId },
    data,
  });
}

export async function deleteStore(storeId: string) {
  return await prisma.store.delete({
    where: { id: storeId },
  });
}

// ============================================
// REGISTERS
// ============================================

export async function getRegisters(storeId: string) {
  return await prisma.register.findMany({
    where: { storeId },
    include: {
      store: true,
      sessions: {
        take: 5,
        orderBy: { openedAt: "desc" },
      },
    },
  });
}

export async function createRegister(storeId: string, data: Omit<Prisma.RegisterCreateInput, 'store'>) {
  return await prisma.register.create({
    data: {
      ...data,
      store: { connect: { id: storeId } },
    },
  });
}

// ============================================
// TRANSFERS
// ============================================

export async function getTransfers(entrepriseId: string, filters?: Prisma.StockTransferWhereInput) {
  return await prisma.stockTransfer.findMany({
    where: {
      entrepriseId,
      ...filters,
    },
    include: {
      fromStore: true,
      toStore: true,
      items: {
        include: { article: true },
      },
    },
    orderBy: { requestedAt: "desc" },
  });
}

export async function createTransfer(
  entrepriseId: string,
  data: {
    fromStoreId: string;
    toStoreId: string;
    items: Prisma.StockTransferItemCreateWithoutTransferInput[];
    notes?: string;
    requestedBy: string;
  }
) {
  const { fromStoreId, toStoreId, items, notes, requestedBy } = data;

  return await prisma.stockTransfer.create({
    data: {
      entreprise: { connect: { id: entrepriseId } },
      fromStore: { connect: { id: fromStoreId } },
      toStore: { connect: { id: toStoreId } },
      numero: `TR-${Date.now()}`,
      notes,
      requestedBy,
      items: {
        create: items,
      },
    },
    include: {
      fromStore: true,
      toStore: true,
      items: { include: { article: true } },
    },
  });
}

export async function approveTransfer(transferId: string, approvedBy: string) {
  return await prisma.stockTransfer.update({
    where: { id: transferId },
    data: {
      status: "APPROVED",
      approvedBy,
      approvedAt: new Date(),
    },
  });
}

export async function receiveTransfer(transferId: string, receivedBy: string) {
  // Update transfer status
  const transfer = await prisma.stockTransfer.update({
    where: { id: transferId },
    data: {
      status: "RECEIVED",
      receivedBy,
      receivedAt: new Date(),
    },
    include: {
      items: { include: { article: true } },
      fromStore: true,
      toStore: true,
    },
  });

  // Update stock in both stores
  for (const item of transfer.items) {
    // Decrease stock in fromStore
    await prisma.storeStockItem.upsert({
      where: {
        storeId_articleId: {
          storeId: transfer.fromStoreId,
          articleId: item.articleId,
        },
      },
      update: {
        quantite: { decrement: item.quantiteSent },
      },
      create: {
        storeId: transfer.fromStoreId,
        articleId: item.articleId,
        quantite: -item.quantiteSent,
      },
    });

    // Increase stock in toStore
    await prisma.storeStockItem.upsert({
      where: {
        storeId_articleId: {
          storeId: transfer.toStoreId,
          articleId: item.articleId,
        },
      },
      update: {
        quantite: { increment: item.quantiteReceived },
      },
      create: {
        storeId: transfer.toStoreId,
        articleId: item.articleId,
        quantite: item.quantiteReceived,
      },
    });
  }

  return transfer;
}
