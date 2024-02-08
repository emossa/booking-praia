import { Button, type ButtonProps } from "@chakra-ui/react";

const CancelButton = (
  props: Exclude<
    ButtonProps,
    "bg" | "color" | "_hover" | "borderRadius" | "size" | "size"
  >
) => {
  return (
    <Button
      fontFamily={"Visby"}
      fontWeight={"bold"}
      bg={"transparent"}
      color={"black"}
      _hover={{
        bg: "gray.300",
      }}
      borderRadius="2xl"
      size="md"
      {...props}
    ></Button>
  );
};

export default CancelButton;
