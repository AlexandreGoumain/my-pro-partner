/**
 * Common dialog-related types
 * Standardizes dialog props across all dialog components
 */

export interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export type CreateDialogProps = BaseDialogProps;

export interface EditDialogProps<T> extends BaseDialogProps {
  item: T;
}

export interface ViewDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: T | null;
}

export interface DeleteDialogProps extends BaseDialogProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}
