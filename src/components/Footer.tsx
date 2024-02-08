import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [marginListingMobile, setMarginListingMobile] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname.includes("listing")) {
        setMarginListingMobile(true);
      }
    }
  }, []);

  return (
    <Box
      position={"absolute"}
      bottom={0}
      width={"full"}
      p={{ base: "0px", md: "20px" }}
      mb={{
        base: marginListingMobile ? "80px" : "0px",
        md: "0px",
      }}
    >
      <Box
        borderRadius={{ base: "0", md: "2xl" }}
        bg={"var(--praia-primary)"}
        color={"white"}
        px={8}
        py={8}
      >
        <Flex
          w={{
            base: "100%",
            md: "4xl",
          }}
          ml={"auto"}
          mr={"auto"}
          flexDirection={{ base: "column", md: "row" }}
          gap={{
            base: 10,
            md: 20,
          }}
        >
          <Stack align={"flex-start"}>
            <Text variant={"header"} color={"var(--white-primary)"}>
              Praia dei Borghi
            </Text>
            <Link href={"#"}>Chi siamo</Link>
            <Link href={"#"}>Condizioni Generali</Link>
            <Link href={"#"}>Privacy Policy</Link>
            <Link href={"#"}>Blog</Link>
          </Stack>
          <Stack align={"flex-start"}>
            <Text variant={"header"} color={"var(--white-primary)"}>
              Assistenza
            </Text>
            <Link href={"#"}>Centro Assistenza</Link>
            <Link href={"#"}>Opzioni di cancellazione</Link>
            <Link href={"#"}>Segnala un problema</Link>
          </Stack>
        </Flex>

        <Text
          w={{
            base: "100%",
            md: "4xl",
          }}
          ml={"auto"}
          mr={"auto"}
          fontSize={"sm"}
          pt={8}
        >
          © {new Date().getFullYear()} Praia dei Borghi{" | "}
          <Link href="/privacy">Privacy Policy</Link>
        </Text>
      </Box>
    </Box>
  );
}
