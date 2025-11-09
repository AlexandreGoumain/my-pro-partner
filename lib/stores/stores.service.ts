/**
 * Service de gestion des magasins (multi-stores)
 * Handles CRUD for stores, registers, and stock transfers
 */

import { prisma } from "@/lib/prisma";

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

export async function createStore(entrepriseId: string, data: any) {
  return await prisma.store.create({
    data: {
      ...data,
      entrepriseId,
    },
    include: { registers: true },
  });
}

export async function updateStore(storeId: string, data: any) {
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

export async function createRegister(storeId: string, data: any) {
  return await prisma.register.create({
    data: {
      ...data,
      storeId,
    },
  });
}

// ============================================
// TRANSFERS
// ============================================

export async function getTransfers(entrepriseId: string, filters?: any) {
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

export async function createTransfer(entrepriseId: string, data: any) {
  const { fromStoreId, toStoreId, items, ...rest } = data;

  return await prisma.stockTransfer.create({
    data: {
      entrepriseId,
      fromStoreId,
      toStoreId,
      numero: `TR-${Date.now()}`,
      ...rest,
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
