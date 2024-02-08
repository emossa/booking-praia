import { Button, Flex, Text } from "@chakra-ui/react";
import { TbCaravan, TbHome } from "react-icons/tb";
import { LuHotel } from "react-icons/lu";

export default function Sojourns() {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      gap={2}
      overflowX={"auto"}
      w={"100%"}
    >
      <Button variant="ghostRoundMenu" minW={"100px"}>
        <Flex
          flexDirection={"column"}
          alignItems="center"
          justifyContent="center"
          gap={2}
          px={5}
        >
          <LuHotel size={"1.5rem"} color="var(--praia-primary)" />
          <Text variant="headerLabelMenu">Hotel</Text>
        </Flex>
      </Button>
      <Button variant="ghostRoundMenu" minW={"100px"}>
        <Flex
          flexDirection={"column"}
          alignItems="center"
          justifyContent="center"
          gap={2}
          px={5}
        >
          <TbHome size={"1.5rem"} color="var(--praia-primary)" />
          <Text variant="headerLabelMenu">Case vacanza</Text>
        </Flex>
      </Button>
      <Button variant="ghostRoundMenu" minW={"100px"}>
        <Flex
          flexDirection={"column"}
          alignItems="center"
          justifyContent="center"
          gap={2}
          px={5}
        >
          <TbCaravan size={"1.5rem"} color="var(--praia-primary)" />
          <Text variant="headerLabelMenu">Camping</Text>
        </Flex>
      </Button>
    </Flex>
  );
}
