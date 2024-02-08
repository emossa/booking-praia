import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  TbLogout,
  TbPlaneDeparture,
  TbUser,
  TbWorld,
  TbX,
} from "react-icons/tb";
import FiltersForm from "./FiltersForm";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { PiHeartStraight } from "react-icons/pi";
import LanguageCard from "../cards/language";
import { languages } from "@/context/FiltersContext";
import Image from "next/image";

export default function Header({ filters }: { filters?: boolean }) {
  const router = useRouter();

  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const {
    isOpen: isOpenLanguageChoose,
    onOpen: onOpenLanguageChoose,
    onClose: onCloseLanguageChoose,
  } = useDisclosure();

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"space-between"}
      px={{
        base: 5,
        md: 10,
      }}
      py={{
        base: 2,
        md: 5,
      }}
    >
      <Link href="/" aria-label="home">
        {/* <Text variant={"header"} cursor={"pointer"}>
          Praia dei Borghi
        </Text> */}
        <Box display={{ base: "none", md: "block" }}>
          <Image
            src="/media/icons/logo-praia-dei-borghi.svg"
            alt="Praia dei Borghi"
            width={200}
            height={50}
          />
        </Box>
        <Box display={{ base: "block", md: "none" }}>
          <Image
            src="/media/icons/logo-praia-dei-borghi-mobile.svg"
            alt="Praia dei Borghi"
            width={160}
            height={50}
          />
        </Box>
      </Link>
      {filters ? (
        <Box
          display={{
            base: "none",
            md: "block",
          }}
        >
          <FiltersForm />
        </Box>
      ) : (
        <Flex
          display={{ base: "none", md: "flex" }}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
        >
          {router.pathname.includes("account") ? (
            <>
              <Button
                variant="ghostRoundMenu"
                onClick={() => {
                  void router.push("/account/travels");
                }}
              >
                Viaggi
              </Button>
              <Button
                variant="ghostRoundMenu"
                onClick={() => {
                  void router.push("/account/favourites");
                }}
              >
                Preferiti
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghostRoundMenu">Soggiorni</Button>
              <Button variant="ghostRoundMenu">Esperienze</Button>
            </>
          )}
        </Flex>
      )}
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        gap={{
          base: 2,
          md: 2,
        }}
      >
        <Button variant="ghostRoundMenu" onClick={onOpenLanguageChoose}>
          <TbWorld size={"1.3rem"} color="var(--praia-primary)" />
        </Button>
        <Modal
          onClose={onCloseLanguageChoose}
          isOpen={isOpenLanguageChoose}
          size={"xl"}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text variant={"header"}>Please choose a language</Text>
                <TbX
                  size={"1.5rem"}
                  onClick={onCloseLanguageChoose}
                  cursor={"pointer"}
                />
              </Flex>
            </ModalHeader>
            <ModalBody
              p={5}
              overflowX={"hidden"}
              overflowY={"scroll"}
              maxH={"90vh"}
            >
              <Flex gap={3} flexWrap={"wrap"}>
                {languages.map((lang) => (
                  <LanguageCard
                    key={lang.code + "_LanguageCard"}
                    code={lang.code}
                    closeModal={onCloseLanguageChoose}
                  />
                ))}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
        {user ? (
          user?.role === UserRole.MERCHANT ? (
            <>
              <Button
                variant="primaryRound"
                display={{ base: "none", md: "block" }}
                onClick={() => {
                  void router.push("/host/dashboard");
                }}
              >
                Area personale
              </Button>
              <Button
                variant="primaryRound"
                display={{ base: "block", md: "none" }}
                onClick={() => {
                  void router.push("/host/dashboard");
                }}
              >
                <TbUser size={"1.3rem"} />
              </Button>
            </>
          ) : user?.role === UserRole.GUEST ? (
            <Menu>
              <MenuButton as={Button} colorScheme="trasparent">
                <Button variant="primaryRound" borderRadius={"lg"}>
                  Il mio profilo
                </Button>
              </MenuButton>
              <MenuList zIndex={3}>
                <MenuGroup>
                  <MenuItem
                    icon={<TbUser />}
                    _hover={{
                      bg: "var(--hover-gray)",
                    }}
                    onClick={() => {
                      void router.push("/account/profile");
                    }}
                  >
                    <Text variant={"title"}>Profilo</Text>
                  </MenuItem>
                  <MenuItem
                    icon={<TbPlaneDeparture />}
                    _hover={{
                      bg: "var(--hover-gray)",
                    }}
                    onClick={() => {
                      void router.push("/account/travels");
                    }}
                  >
                    <Text variant={"title"}>I miei viaggi</Text>
                  </MenuItem>
                  <MenuItem
                    icon={<PiHeartStraight />}
                    _hover={{
                      bg: "var(--hover-gray)",
                    }}
                    onClick={() => {
                      void router.push("/account/favourites");
                    }}
                  >
                    <Text variant={"title"}>Preferiti</Text>
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup>
                  <MenuItem
                    icon={<TbLogout />}
                    _hover={{
                      bg: "var(--hover-gray)",
                    }}
                    onClick={async () => {
                      await signOut();
                      void router.push("/");
                    }}
                  >
                    <Text variant={"title"}>Logout</Text>
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          ) : (
            <Button
              variant="primaryRound"
              onClick={() => {
                void router.push("/auth/signin");
              }}
            >
              Area Admin
            </Button>
          )
        ) : (
          <Button
            variant="primaryRound"
            onClick={() => {
              void router.push("/auth/signin");
            }}
          >
            Accedi
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
