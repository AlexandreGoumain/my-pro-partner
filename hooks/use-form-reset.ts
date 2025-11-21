/**
 * Reusable hook for form reset logic
 * Eliminates repetitive useEffect patterns in dialog components
 */

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

/**
 * Automatically resets form to default values when dialog opens
 *
 * @param form - React Hook Form instance
 * @param open - Dialog open state
 * @param defaultValues - Values to reset to
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>({ defaultValues });
 * useFormReset(form, open, defaultValues);
 * ```
 */
export function useFormReset<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  open: boolean,
  defaultValues: T
) {
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
    // defaultValues is intentionally omitted from dependencies to prevent infinite loops
    // when defaultValues is an object literal created in the parent component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, form]);
}
