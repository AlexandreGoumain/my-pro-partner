/**
 * Fitness Hooks - Re-export from modular structure
 *
 * This file maintains backwards compatibility by re-exporting
 * all hooks from the organized hooks/fitness/ directory.
 *
 * For new code, prefer importing directly from '@/hooks/fitness'
 *
 * @example
 * // Recommended for new code:
 * import { useAbonnements, useCheckIn } from '@/hooks/fitness';
 *
 * // Still works for backwards compatibility:
 * import { useAbonnements, useCheckIn } from '@/hooks/use-fitness';
 */

"use client";

export * from "./fitness";
