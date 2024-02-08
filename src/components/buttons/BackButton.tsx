import { Button, useColorModeValue, type ButtonProps } from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";

const BackButton = (
  props: Exclude<ButtonProps, "bg" | "color" | "_hover" | "_active">
) => {
  return (
    <Button
      fontFamily={"Inter-Regular"}
      color={useColorModeValue("var(--black-primary)", "var(--white-primary)")}
      opacity={0.8}
      bg={"transparent"}
      size="md"
      _hover={{
        opacity: 1,
      }}
      _active={{
        bg: "transparent",
      }}
      p={0}
      leftIcon={<FiChevronLeft />}
      {...props}
    ></Button>
  );
};

export default BackButton;
