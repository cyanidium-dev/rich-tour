import FormButton from "../../buttons/FormButton";
interface SubmitButtonProps {
    isLoading: boolean;
    text: string;
    variant?: "red" | "black";
    className?: string;
}

export default function SubmitButton({
                                         isLoading,
                                         text,
                                         variant = "red",
                                         className = "w-full",
                                     }: SubmitButtonProps) {
    return (
        <FormButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className={className}
            variant={variant}
        >
            {isLoading ? "Надсилання..." : text}
        </FormButton>
    );
}

