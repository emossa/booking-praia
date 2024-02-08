import { Button, useColorModeValue, type ButtonProps } from "@chakra-ui/react";

const PrimaryButton = (
  props: Exclude<
    ButtonProps,
    "bg" | "color" | "_hover" | "borderRadius" | "size"
  >
) => {
  return (
    <Button
      fontFamily={"Inter-Regular"}
      color={useColorModeValue("var(--white-primary)", "var(--black-primary)")}
      bg={useColorModeValue("var(--dark-bg)", "var(--white-primary)")}
      borderRadius="lg"
      size="sm"
      px={4}
      py={5}
      _hover={{
        opacity: 0.8,
      }}
      _active={{
        bg: useColorModeValue("var(--dark-bg)", "var(--white-primary)"),
      }}
      {...props}
    ></Button>
  );
};

export default PrimaryButton;
