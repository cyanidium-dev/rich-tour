import FormButton from "../../buttons/FormButton";

interface SubmitButtonProps {
  isValid: boolean;
  isLoading: boolean;
  text: string;
  variant?: "red" | "black";
  className?: string;

  requireDirty?: boolean;
  dirty?: boolean;
}

export default function SubmitButton({
                                       isValid,
                                       isLoading,
                                       text,
                                       variant = "red",
                                       className = "w-full",
                                       requireDirty = false,
                                       dirty = false,
                                     }: SubmitButtonProps) {
  const isDisabled =
      isLoading ||
      !isValid ||
      (requireDirty && !dirty);

  return (
      <FormButton
          type="submit"
          disabled={isDisabled}
          isLoading={isLoading}
          className={className}
          variant={variant}
      >
        {isLoading ? "Надсилання..." : text}
      </FormButton>
  );
}
