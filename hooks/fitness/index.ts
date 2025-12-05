/**
 * Fitness Hooks - Barrel Export
 *
 * This module re-exports all fitness-related hooks organized by domain:
 * - Types d'abonnements
 * - Abonnements
 * - Cours collectifs
 * - Salles fitness
 * - Séances de cours
 * - Réservations
 * - Présences / Check-in
 * - Statistiques
 */

// Types d'abonnements
export {
    useTypesAbonnements,
    useTypeAbonnement,
    useCreateTypeAbonnement,
    useUpdateTypeAbonnement,
    useDeleteTypeAbonnement,
} from "./types-abonnements";

// Abonnements
export {
    useAbonnements,
    useAbonnement,
    useCreateAbonnement,
    useUpdateAbonnement,
    useDeleteAbonnement,
} from "./abonnements";

// Cours collectifs
export {
    useCours,
    useCoursDetails,
    useCreateCours,
    useUpdateCours,
    useDeleteCours,
} from "./cours";

// Salles fitness
export {
    useSallesFitness,
    useSalleFitness,
    useCreateSalleFitness,
    useUpdateSalleFitness,
    useDeleteSalleFitness,
} from "./salles";

// Séances de cours
export {
    useSeances,
    useSeance,
    useCreateSeance,
    useUpdateSeance,
    useDeleteSeance,
} from "./seances";

// Réservations
export {
    useReservations,
    useReservation,
    useCreateReservation,
    useUpdateReservation,
    useDeleteReservation,
} from "./reservations";

// Présences / Check-in
export {
    usePresences,
    usePresence,
    useCreatePresence,
    useCheckIn,
    useUpdatePresence,
} from "./presences";

// Statistiques
export { useFitnessStats } from "./stats";
