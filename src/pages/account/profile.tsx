import Header from "@/components/headers/Main";
import { Box, Flex, Text } from "@chakra-ui/react";
import { type ReactElement } from "react";

function Card({
  title,
  label,
}: {
  title: string;
  label: string;
}): ReactElement {
  return (
    <Flex
      maxW={"500px"}
      justifyContent={"space-between"}
      py={8}
      borderBottom={"1px solid"}
      borderColor={"inherit"}
    >
      <Box>
        <Text variant={"title"} fontFamily={"CalSans-SemiBold"}>
          {title}
        </Text>
        <Text variant={"label"}>{label}</Text>
      </Box>
      <Box>
        <Text variant={"link"}>Modifica</Text>
      </Box>
    </Flex>
  );
}

export default function Profilo() {
  return (
    <>
      <Header />
      <Box
        ml={"auto"}
        mr={"auto"}
        maxW={{
          base: "100%",
          md: "6xl",
        }}
        p={10}
      >
        <Text
          variant={"header"}
          fontSize={{
            base: "xl",
            md: "2xl",
          }}
          pb={5}
        >
          Informazioni personali
        </Text>
        <Card title={"Nome e Cognome"} label={"Mario Rossi"} />
        <Card title={"Indirizzo email"} label={"mario.rossi@email.com"} />
        <Card title={"Numero di telefono"} label={"+39 3802863702"} />
      </Box>
    </>
  );
}
