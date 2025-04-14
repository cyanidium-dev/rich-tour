import FormButton from "../../buttons/FormButton";

interface SubmitButtonProps {
  dirty: boolean;
  isValid: boolean;
  isLoading: boolean;
  text: string;
  variant?: "red" | "black";
  className?: string;
}

export default function SubmitButton({
  dirty,
  isValid,
  isLoading,
  text,
  variant = "red",
  className = "w-full",
}: SubmitButtonProps) {
  return (
    <FormButton
      type="submit"
      disabled={!(dirty && isValid) || isLoading}
      isLoading={isLoading}
      className={className}
      variant={variant}
    >
      {isLoading ? "Надсилання..." : text}
    </FormButton>
  );
}
