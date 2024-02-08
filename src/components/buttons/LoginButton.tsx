import { Button, useColorModeValue, type ButtonProps } from "@chakra-ui/react";

const LoginButton = (
  props: Exclude<
    ButtonProps,
    "bg" | "color" | "_hover" | "borderRadius" | "size"
  >
) => {
  return (
    <Button
      fontFamily={"CalSans-SemiBold"}
      fontWeight={"bold"}
      color={useColorModeValue("var(--white-primary)", "var(--black-primary)")}
      bg={useColorModeValue("var(--dark-bg)", "var(--white-primary)")}
      borderRadius="lg"
      border={`3px solid transparent`}
      size="md"
      p={6}
      _hover={{
        bg: "transparent",
        color: useColorModeValue("var(--dark-bg)", "var(--white-primary)"),
        borderColor: useColorModeValue(
          "var(--dark-bg)",
          "var(--white-primary)"
        ),
      }}
      {...props}
    ></Button>
  );
};

export default LoginButton;
