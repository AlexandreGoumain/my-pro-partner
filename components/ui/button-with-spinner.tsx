import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { forwardRef } from "react";

interface ButtonWithSpinnerProps extends ButtonProps {
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
