import Header from "@/components/headers/Main";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { type ReactElement } from "react";

function Card({
  cover,
  title,
  label,
  date,
  canDelete = false,
}: {
  cover?: string;
  title: string;
  label: string;
  date: string;
  canDelete?: boolean;
}): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      maxW={"500px"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      gap={2}
      py={{
        base: 2,
        md: 4,
      }}
    >
      <Flex gap={3} alignItems={"center"}>
        {cover && title && (
          <Box w={"80px"} h={"80px"} position={"relative"}>
            <Image
              src={cover}
              alt={title}
              objectFit={"cover"}
              style={{
                borderRadius: "1rem",
              }}
              fill
            />
          </Box>
        )}
        <Box>
          <Text variant={"title"} fontFamily={"CalSans-SemiBold"}>
            {title}
          </Text>
          <Text variant={"label"}>{label}</Text>
          <Text variant={"label"}>{date}</Text>
        </Box>
      </Flex>
      {canDelete && (
        <Box>
          <Text onClick={onOpen} variant={"link"}>
            Cancella la prenotazione
          </Text>
          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent border={"2px solid #141414"} borderRadius={"lg"}>
              <ModalBody p={5}>
                <Flex justifyContent={"space-between"}>
                  <Text variant="header">
                    Sei sicuro di voler cancellare la prenotazione?
                  </Text>
                  <ModalCloseButton />
                </Flex>
                <Text variant="label" pt={2}>
                  Attenzione questa azione non è reversibile.
                </Text>
                <Text variant="label" pt={2}>
                  Per confermare, scrivi <b>{'"nomehotel/stanza"'}</b> nel campo
                  qui sotto.
                </Text>
                <Input
                  _focusVisible={{
                    border: "2px solid #E5534B",
                  }}
                  _hover={{
                    border: "2px solid #B03E38",
                  }}
                  border={"2px solid #E5534B"}
                  placeholder={"nomehotel/stanza"}
                  mt={2}
                  variant={"outline"}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant={"ghostRoundSecondary"} onClick={onClose} mr={2}>
                  Annulla
                </Button>
                <Button variant={"RoundErrorSecondary"} onClick={onClose}>
                  Conferma
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
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
          Viaggi
        </Text>
        <Box
          py={10}
          borderTop={"1px solid"}
          borderBottom={"1px solid"}
          borderColor={"inherit"}
        >
          <Text variant={"header"} fontSize={"lg"}>
            Viaggi programmati
          </Text>
          <Flex gap={{ base: 2, md: 10 }} flexWrap={"wrap"}>
            <Card
              cover={"/media/test/adv1.webp"}
              title={"Hotel Blu"}
              label={"Vicino al mare"}
              date={"10 giu 24 - 15 giu 24"}
              canDelete={true}
            />
            <Card
              cover={"/media/test/adv2.webp"}
              title={"Hotel Giallo"}
              label={"Vicino al centro"}
              date={"2 dic 23 - 9 dic 23"}
              canDelete={true}
            />
          </Flex>
        </Box>
        <Box
          py={10}
          borderTop={"1px solid"}
          borderBottom={"1px solid"}
          borderColor={"inherit"}
        >
          <Text variant={"header"} fontSize={"lg"}>
            Dove hai soggiornato
          </Text>
          <Flex gap={{ base: 2, md: 10 }} flexWrap={"wrap"}>
            <Card
              cover={"/media/test/adv3.webp"}
              title={"Hotel Blu"}
              label={"Vicino al mare"}
              date={"10 giu 24 - 15 giu 24"}
            />
            <Card
              cover={"/media/test/adv4.webp"}
              title={"Hotel Giallo"}
              label={"Vicino al centro"}
              date={"2 dic 23 - 9 dic 23"}
            />
          </Flex>
        </Box>
        <Box
          py={10}
          borderTop={"1px solid"}
          borderBottom={"1px solid"}
          borderColor={"inherit"}
        >
          <Text variant={"header"} fontSize={"lg"}>
            Viaggi cancellati
          </Text>
          <Flex gap={{ base: 2, md: 10 }} flexWrap={"wrap"}>
            <Card
              cover={"/media/test/adv5.webp"}
              title={"Hotel Blu"}
              label={"Vicino al mare"}
              date={"10 giu 24 - 15 giu 24"}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
}
