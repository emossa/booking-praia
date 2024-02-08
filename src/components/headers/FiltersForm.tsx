import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import EventCalendar from "../filters/EventCalendar";
import Who from "@/components/filters/Who";

import { FaXmark } from "react-icons/fa6";
import { TbSearch } from "react-icons/tb";
import { getDate, useFiltersContext } from "@/context/FiltersContext";

export default function FiltersForm({
  openModalMobile,
  setOpenModalMobile,
}: {
  openModalMobile?: boolean | undefined;
  setOpenModalMobile?: (value: boolean) => void | undefined;
}) {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [showWho, setShowWho] = useState<boolean>(false);
  const whoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (whoRef.current && !whoRef.current.contains(event.target as Node)) {
        setShowWho(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [openDateContainerModal, setDatesContainerModal] = useState(false);
  const [openWhoContainerModal, setWhoContainerModal] = useState(false);

  const {
    checkin,
    checkout,
    chi_adulti,
    chi_bambini,
    chi_neonati,
    chi_pets,
    updateFilters,
  } = useFiltersContext();

  const [labelCheckin, setLabelCheckin] = useState<string>("");
  const [labelCheckout, setLabelCheckout] = useState<string>("");
  const [labelWho, setLabelWho] = useState<string>("");

  useEffect(() => {
    setLabelCheckin(getDate(checkin));
    setLabelCheckout(getDate(checkout));

    let who = "";
    if (chi_adulti > 0) {
      who += `${chi_adulti} ${chi_adulti > 1 ? "adulti " : "adulto "}`;
    }
    if (chi_bambini > 0) {
      who += `${chi_bambini} ${chi_bambini > 1 ? "bambini " : "bambino "}`;
    }
    if (chi_neonati > 0) {
      who += `${chi_neonati} ${chi_neonati > 1 ? "neonati " : "neonato "}`;
    }
    if (chi_pets > 0) {
      who += `${chi_pets} ${
        chi_pets > 1 ? "animali domestici" : "animale domestico"
      }`;
    }

    const defaultWho = "Chi porti con te?";
    if (who.trim() === "") {
      setLabelWho(defaultWho);
    } else {
      setLabelWho(who.slice(0, defaultWho.length - 3).trim() + "...");
    }
  }, [checkin, checkout, chi_adulti, chi_bambini, chi_neonati, chi_pets]);

  useEffect(() => {
    if (openModalMobile) {
      onOpen();
    }
  }, [onOpen, openModalMobile]);

  const isMobile = useMediaQuery("(max-width: 768px)")[0];
  return (
    <>
      {isMobile && (
        <>
          {/* mobile */}
          <Flex
            my={2}
            px={5}
            display={{
              base: "flex",
              md: "none",
            }}
            flexDirection={"column"}
            alignItems={"center"}
            position={"relative"}
            zIndex={2}
          >
            <Flex
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={4}
              bg={"#14141410"}
              borderRadius={"full"}
              width={"full"}
              onClick={onOpen}
            >
              <Text variant={"bold"} px={5} py={2}>
                Cerca
              </Text>
              <Text variant={"label"} px={0} py={2} fontSize={"xs"}>
                Hotel, esperienze e altro
              </Text>
              <Box px={5} py={2}>
                <TbSearch size={"2rem"} />
              </Box>
            </Flex>
            <Box
              ref={calendarRef} // Riferimento al calendario per controllare i clic all'interno di esso
              display={showCalendar ? "block" : "none"}
              w={"fit-content"}
              top={"115%"}
              p={5}
              boxShadow={"xl"}
              borderRadius={"3xl"}
              position={"absolute"}
              bg={"var(--white-primary)"}
            >
              <EventCalendar nameDate={""} nameTime={""} label={""} />
            </Box>
            <Box
              ref={whoRef} // Riferimento al calendario per controllare i clic all'interno di esso
              display={showWho ? "block" : "none"}
              w={"fit-content"}
              top={"115%"}
              px={5}
              boxShadow={"xl"}
              borderRadius={"3xl"}
              position={"absolute"}
              bg={"var(--white-primary)"}
            >
              <Who />
            </Box>
          </Flex>
          {/* mobile modal */}
          <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
            <ModalOverlay />
            <ModalContent backgroundColor={"#eaeaea"}>
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                px={2}
                py={5}
                position={"relative"}
                gap={2}
              >
                <Button variant="ghostRoundMenu" fontSize={"sm"} p={2}>
                  Soggiorni
                </Button>
                <Button variant="ghostRoundMenu" fontSize={"sm"} p={2}>
                  Esperienze
                </Button>
                <Button
                  variant={"ghostRoundMenu"}
                  position={"absolute"}
                  right={5}
                  onClick={() => {
                    onClose();
                    setOpenModalMobile && setOpenModalMobile(false);
                  }}
                >
                  <FaXmark />
                </Button>
              </Flex>
              <ModalBody px={4} py={1}>
                <Flex
                  flexDirection={"column"}
                  gap={3}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Flex
                    w={"full"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    borderRadius={"xl"}
                    boxShadow={"md"}
                    backgroundColor={"var(--light-bg-sidebar)"}
                    p={3}
                    gap={openDateContainerModal ? 5 : 0}
                  >
                    <Flex
                      w={"full"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      onClick={() => {
                        setDatesContainerModal(!openDateContainerModal);
                      }}
                    >
                      <Text variant={"header"} color={"#737373"}>
                        Quando
                      </Text>
                      <Text variant={"header"}>
                        {labelCheckin &&
                        labelCheckout &&
                        labelCheckin !== labelCheckout
                          ? labelCheckin + " — " + labelCheckout
                          : labelCheckin}
                      </Text>
                    </Flex>
                    <Flex
                      w={"full"}
                      display={openDateContainerModal ? "block" : "none"}
                      opacity={openDateContainerModal ? 1 : 0}
                      h={openDateContainerModal ? "auto" : 0}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <EventCalendar nameDate={""} nameTime={""} label={""} />
                    </Flex>
                  </Flex>
                  <Flex
                    w={"full"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    borderRadius={"xl"}
                    boxShadow={"md"}
                    backgroundColor={"var(--light-bg-sidebar)"}
                    p={3}
                    gap={openWhoContainerModal ? 5 : 0}
                  >
                    <Flex
                      w={"full"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      onClick={() => {
                        setWhoContainerModal(!openWhoContainerModal);
                      }}
                    >
                      <Text variant={"header"} color={"#737373"}>
                        Chi
                      </Text>
                      <Text variant={"header"}>
                        {labelWho ? labelWho : "Chi porti con te?"}
                      </Text>
                    </Flex>
                    <Flex
                      w={"full"}
                      display={openWhoContainerModal ? "block" : "none"}
                      opacity={openWhoContainerModal ? 1 : 0}
                      h={openWhoContainerModal ? "auto" : 0}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Who />
                    </Flex>
                  </Flex>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Flex
                  w={"full"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={5}
                >
                  <Button
                    variant="ghostRound"
                    p={2}
                    fontSize={"sm"}
                    textTransform={"none"}
                    textDecoration={"underline"}
                    onClick={() => {
                      updateFilters({
                        checkin: undefined,
                        checkout: undefined,
                        chi_adulti: 0,
                        chi_bambini: 0,
                        chi_neonati: 0,
                        chi_pets: 0,
                      });
                      // onClose();
                    }}
                  >
                    Cancella tutto
                  </Button>
                  <Button
                    variant="primaryRound"
                    textTransform={"none"}
                    fontSize={"sm"}
                    onClick={onClose}
                  >
                    {openModalMobile ? "Applica filtri" : "Cerca"}
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
      {/* desktop */}
      <Flex
        display={{
          base: "none",
          md: "flex",
        }}
        minW={"800px"}
        flexDirection={"column"}
        alignItems={"center"}
        position={"relative"}
        zIndex={3}
      >
        <Flex
          ml={"auto"}
          mr={"auto"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={4}
          // bg={"#14141410"}
          backgroundColor={"var(--praia-rombo-1-20)"}
          borderRadius={"full"}
          width={"fit-content"}
        >
          {/* quando */}
          <Button
            variant={"filter"}
            onClick={() => {
              setShowCalendar(true);
            }}
          >
            <Flex textAlign={"left"} flexDirection={"column"} gap={2}>
              <Text>Check-in</Text>
              <Text variant={"label"}>{labelCheckin ? labelCheckin : ""}</Text>
            </Flex>
          </Button>
          <Button
            variant={"filter"}
            onClick={() => {
              setShowCalendar(true);
            }}
          >
            <Flex textAlign={"left"} flexDirection={"column"} gap={2}>
              <Text>Check-out</Text>
              <Text variant={"label"}>
                {labelCheckout ? labelCheckout : ""}
              </Text>
            </Flex>
          </Button>
          {/* chi */}
          <Button
            variant={"filter"}
            onClick={() => {
              setShowWho(true);
            }}
          >
            <Flex textAlign={"left"} flexDirection={"column"} gap={2}>
              <Text>Chi</Text>
              <Text variant={"label"}>{labelWho}</Text>
            </Flex>
          </Button>
          <Button variant={"primaryRound"} mx={4}>
            Cerca
          </Button>
        </Flex>
        <Box
          ref={calendarRef} // Riferimento al calendario per controllare i clic all'interno di esso
          display={showCalendar ? "block" : "none"}
          w={"fit-content"}
          top={"115%"}
          p={5}
          boxShadow={"xl"}
          borderRadius={"3xl"}
          position={"absolute"}
          bg={"var(--white-primary)"}
        >
          <EventCalendar nameDate={""} nameTime={""} label={""} />
        </Box>
        <Box
          ref={whoRef} // Riferimento al calendario per controllare i clic all'interno di esso
          display={showWho ? "block" : "none"}
          w={"fit-content"}
          top={"115%"}
          px={5}
          boxShadow={"xl"}
          borderRadius={"3xl"}
          position={"absolute"}
          bg={"var(--white-primary)"}
        >
          <Who />
        </Box>
      </Flex>
    </>
  );
}
