import FormButton from "../../buttons/FormButton";

interface SubmitButtonProps {
  dirty: boolean;
  isValid: boolean;
  isLoading: boolean;
  text: string;
  variant?: "red" | "black";
}

export default function SubmitButton({
  dirty,
  isValid,
  isLoading,
  text,
  variant = "red",
}: SubmitButtonProps) {
  return (
    <FormButton
      type="submit"
      disabled={!(dirty && isValid) || isLoading}
      isLoading={isLoading}
      className="w-full"
      variant={variant}
    >
      {isLoading ? "Надсилання..." : text}
    </FormButton>
  );
}
