/**
 * Composant groupant tous les dialogs de la page personnel
 * Gère les dialogs de création, édition et suppression
 */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { UserForm } from "./user-form";
import { User, CreateUserInput, UpdateUserInput } from "@/hooks/personnel/use-personnel";
import { Spinner } from "@/components/ui/spinner";

export interface PersonnelDialogsProps {
    // Create dialog
    createDialogOpen: boolean;
    onCreateDialogChange: (open: boolean) => void;
    onCreateSubmit: (data: CreateUserInput) => Promise<boolean>;
    creating: boolean;

    // Edit dialog
    editDialogOpen: boolean;
    onEditDialogChange: (open: boolean) => void;
    onEditSubmit: (data: UpdateUserInput) => Promise<boolean>;
    updating: boolean;
    selectedUser: User | null;
    onEditCancel: () => void;

    // Delete dialog
    deleteDialogOpen: boolean;
    onDeleteDialogChange: (open: boolean) => void;
    onDeleteConfirm: () => void;
    deleting: boolean;
    onDeleteCancel: () => void;
}

export function PersonnelDialogs({
    createDialogOpen,
    onCreateDialogChange,
    onCreateSubmit,
    creating,
    editDialogOpen,
    onEditDialogChange,
    onEditSubmit,
    updating,
    selectedUser,
    onEditCancel,
    deleteDialogOpen,
    onDeleteDialogChange,
    onDeleteConfirm,
    deleting,
    onDeleteCancel,
}: PersonnelDialogsProps) {
    return (
        <>
            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={onCreateDialogChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-black/10">
                    <DialogHeaderSection
                        title="Ajouter un employé"
                        description="Créez un nouveau compte employé. Une invitation sera envoyée par email."
                        titleClassName="text-[20px] font-semibold tracking-[-0.01em] text-black"
                        descriptionClassName="text-[14px] text-black/60"
                    />
                    <UserForm
                        onSubmit={onCreateSubmit}
                        onCancel={() => onCreateDialogChange(false)}
                        loading={creating}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={onEditDialogChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-black/10">
                    <DialogHeaderSection
                        title="Modifier l'employé"
                        description="Mettez à jour les informations de l'employé"
                        titleClassName="text-[20px] font-semibold tracking-[-0.01em] text-black"
                        descriptionClassName="text-[14px] text-black/60"
                    />
                    <UserForm
                        user={selectedUser}
                        onSubmit={onEditSubmit}
                        onCancel={onEditCancel}
                        loading={updating}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={onDeleteDialogChange}
            >
                <AlertDialogContent className="border-black/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[18px] font-semibold text-black">
                            Êtes-vous sûr ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[14px] text-black/60">
                            Cette action est irréversible. L&apos;employé{" "}
                            <span className="font-medium text-black">
                                {selectedUser?.prenom}{" "}
                                {selectedUser?.name || selectedUser?.email}
                            </span>{" "}
                            sera définitivement supprimé.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={onDeleteCancel}
                            className="h-11 px-6 text-[14px] border-black/10 hover:bg-black/5"
                        >
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteConfirm}
                            className="h-11 px-6 text-[14px] bg-red-600 hover:bg-red-700 text-white"
                            disabled={deleting}
                        >
                            {deleting && (
                                <Spinner className="mr-2" />
                            )}
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
