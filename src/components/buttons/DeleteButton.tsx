import { Button, type ButtonProps } from "@chakra-ui/react";

const DeleteButton = (
  props: Exclude<
    ButtonProps,
    "bg" | "color" | "_hover" | "borderRadius" | "size" | "size"
  >
) => {
  return (
    <Button
      fontFamily={"Visby"}
      bg={"red.500"}
      color={"white"}
      _hover={{
        bg: "red.900",
      }}
      borderRadius="2xl"
      size="md"
      {...props}
    ></Button>
  );
};

export default DeleteButton;
