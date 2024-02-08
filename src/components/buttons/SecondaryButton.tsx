import { Button, useColorModeValue, type ButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

const SecondaryButton = forwardRef<
  HTMLButtonElement,
  Exclude<ButtonProps, "bg" | "color" | "_hover" | "borderRadius" | "size">
>((props, ref) => {
  const borderColor = useColorModeValue(
    "var(--light-border)",
    "var(--dark-border)"
  );

  const borderColorHover = useColorModeValue(
    "var(--light-border-hover)",
    "var(--dark-border-hover)"
  );

  return (
    <Button
      ref={ref}
      fontFamily={"Inter-Regular"}
      color={useColorModeValue("var(--black-primary)", "var(--white-primary)")}
      bg={useColorModeValue("var(--white-primary)", "var(--dark-bg)")}
      border={"1px solid " + borderColor}
      borderRadius="lg"
      size="sm"
      px={4}
      py={5}
      _hover={{
        opacity: 0.8,
        borderColor: borderColorHover,
      }}
      _active={{
        bg: useColorModeValue("var(--white-primary)", "var(--dark-bg)"),
      }}
      {...props}
    ></Button>
  );
});
SecondaryButton.displayName = "SecondaryButton";
export default SecondaryButton;
