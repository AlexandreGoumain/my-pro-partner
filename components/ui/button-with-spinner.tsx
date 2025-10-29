import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

interface ButtonWithSpinnerProps extends ComponentPropsWithoutRef<typeof Button> {
    isLoading?: boolean;
    loadingText?: string;
}

const ButtonWithSpinner = forwardRef<HTMLButtonElement, ButtonWithSpinnerProps>(
    ({ children, isLoading, loadingText, disabled, ...props }, ref) => {
        return (
            <Button ref={ref} disabled={isLoading || disabled} {...props}>
                {isLoading ? (
                    <>
                        <Spinner className="mr-2" />
                        {loadingText || children}
                    </>
                ) : (
                    children
                )}
            </Button>
        );
    }
);

ButtonWithSpinner.displayName = "ButtonWithSpinner";

export { ButtonWithSpinner };
