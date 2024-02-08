import Image from "next/image";
import { useState, type ReactElement, useEffect } from "react";

import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";

import { LuGalleryVerticalEnd } from "react-icons/lu";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PiHeartStraightDuotone } from "react-icons/pi";
import {
  TbClick,
  TbElevator,
  TbBadgeWc,
  TbParking,
  TbShare,
  TbSnowflake,
  TbWifi,
  TbDog,
  TbCircleCheck,
  TbX,
  TbCheck,
} from "react-icons/tb";
import { type IconType } from "react-icons";

import FiltersForm from "@/components/headers/FiltersForm";
import Header from "@/components/headers/Main";
import EventCalendar from "@/components/filters/EventCalendar";
import Who from "@/components/filters/Who";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { getDate, useFiltersContext } from "@/context/FiltersContext";

import { type SubmitHandler, useForm } from "react-hook-form";
import { type RoomType, type Amenity } from "@prisma/client";
import { type AmenityTranslationsType } from "@/server/types";
import { StringParam, encodeQueryParams } from "use-query-params";
import queryString from "query-string";
import { update } from "lodash";
import { getCookie } from "cookies-next";
import { router } from "@trpc/server";
interface ServiceProps {
  icon: IconType;
  title: string;
}

function Service({ icon, title }: ServiceProps): ReactElement {
  return (
    <Flex alignItems="center" gap={4} w={"180px"}>
      <Icon as={icon} fontSize={"2xl"} />
      <Text>{title}</Text>
    </Flex>
  );
}

export function getRoomTypePrice(
  price: number | null | undefined,
  night: number | undefined,
  label = false,
  perNight = false
): number | string {
  if (price && night && night > 0) {
    if (label) {
      return perNight ? "€ " + price + " a notte" : "€ " + price * night;
    }
    return perNight ? price : price * night;
  } else {
    if (label) {
      return perNight ? "" : "Non disponibile";
    }
    return -1;
  }
}

// function getCommonAmenities(roomTypes: RoomType[]) {
//   const commonAmenities: Amenity[] = [];
//   roomTypes.forEach((roomType: RoomType) => {
//     roomType.Amenity.forEach((amenity) => {
//       if (commonAmenities.indexOf(amenity) === -1) {
//         commonAmenities.push(amenity);
//       }
//     });
//   });
//   return commonAmenities;
// }

export default function Listing() {
  const id = useRouter().query.id;

  const [openDateContainerModal, setDatesContainerModal] = useState(false);
  const [openWhoContainerModal, setWhoContainerModal] = useState(false);
  const [openRoomContainerModal, setRoomContainerModal] = useState(false);

  const { data: roomTypeData } = api.roomTypes.list.useQuery({
    property: id as string,
  });
  // console.log("roomTypeData: ", roomTypeData);

  const [address, setAddress] = useState<string>("");
  useEffect(() => {
    if (roomTypeData) {
      const address = roomTypeData[0]?.Property?.address ?? "";
      if (address) {
        setAddress(address);
      }
    }
  }, [roomTypeData]);

  const { data: commonAmenitiesData } = api.roomTypesAmenity.list.useQuery({
    property: id as string,
    common: true,
  });
  const [commonAmenities, setCommonAmenities] = useState<Amenity[] | undefined>(
    undefined
  );
  useEffect(() => {
    if (commonAmenitiesData) {
      setCommonAmenities(commonAmenitiesData);
    }
  }, [commonAmenitiesData]);

  // const images = [
  //   { alt: "adv1", src: "/media/test/adv1.webp" },
  //   { alt: "adv2", src: "/media/test/adv2.webp" },
  //   { alt: "adv3", src: "/media/test/adv3.webp" },
  //   { alt: "adv4", src: "/media/test/adv4.webp" },
  //   { alt: "adv5", src: "/media/test/adv5.webp" },
  // ];

  // get all images from add roomTypeData
  const images = roomTypeData?.flatMap((roomType) => {
    return roomType.images.map((image) => {
      return { alt: image.split("/")[image.split("/").length - 1], src: image };
    });
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // room modal choose
  const {
    isOpen: isOpenRoom,
    onOpen: onOpenRoom,
    onClose: onCloseRoom,
  } = useDisclosure();

  const { checkin, checkout, chi_adulti, chi_bambini, chi_neonati, chi_pets, roomType, updateFilters } =
    useFiltersContext();

  const [night, setNight] = useState<number>(0);

  const [canChooseRoom, setCanChooseRoom] = useState<boolean>(false);
  const [listingLabelDate, setListingLabelDate] = useState<string>("");
  const [listingLabelOspiti, setListingLabelOspiti] = useState<string>("");

  useEffect(() => {
    if (checkin && checkout) {
      setNight(
        Math.ceil(
          Math.abs(new Date(checkout).getTime() - new Date(checkin).getTime()) /
          (1000 * 60 * 60 * 24)
        )
      );

      setListingLabelDate(
        getDate(new Date(checkin)) + " - " + getDate(new Date(checkout))
      );
    } else {
      setListingLabelDate(getDate(undefined));
    }

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
      who += `${chi_pets} ${chi_pets > 1 ? "animali domestici" : "animale domestico"
        }`;
    }

    const defaultWho = "Chi porti con te?";
    if (who.trim() === "") {
      setListingLabelOspiti(defaultWho);
    } else {
      setListingLabelOspiti(who.slice(0, defaultWho.length - 3).trim() + "...");
    }

    if (checkin && checkout && chi_adulti > 0) {
      setCanChooseRoom(true);
    } else {
      setCanChooseRoom(false);
    }
  }, [checkin, checkout, chi_adulti, chi_bambini, chi_neonati, chi_pets]);

  // gestione prezzi visualizzati
  const [labelStartingPrice, setLabelStartingPrice] = useState<
    string | undefined
  >(undefined);
  const [labelChoosenPrice, setLabelChoosenPrice] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    roomTypeData?.find((roomType) => {
      const roomTypePrice = roomType.RoomTypePricesAvailability.find(
        (roomTypePrice) =>
          roomTypePrice.dateFrom &&
          checkin &&
          roomTypePrice.dateFrom <= checkin &&
          roomTypePrice.dateTo &&
          checkout &&
          roomTypePrice.dateTo >= checkout
      );
      if (roomTypePrice) {
        setLabelStartingPrice(
          getRoomTypePrice(roomTypePrice.price, night, false, true).toString()
        );
        return true;
      }
    });
  }, [checkin, checkout, night, roomTypeData]);

  const [openModalMobile, setOpenModalMobile] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 768px)")[0];
  const router = useRouter();
  const toast = useToast();
  const { mutateAsync: createBooking, isLoading } = api.booking.create.useMutation();
  const createBookingIntent = async () => {
    console.log("createBookingIntent");
    const guestNumber = chi_adulti + chi_bambini + chi_neonati;
    if (roomType && id && checkin && checkout && guestNumber > 0) {
      const booking = await createBooking({
        roomTypeId: roomType.id,
        userIdentifier: getCookie("userIdentifier") ?? "",
        checkin,
        checkout,
        chi_adulti,
        chi_bambini,
        chi_neonati,
        chi_pets,
      });
      if (booking) {
        router.push(`/checkout/${booking.id}`);
      } else {
        toast({
          title: "Errore",
          description: "Errore nella prenotazione",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }

    } else {
      toast({
        title: "Errore",
        description: "Inserisci i dati necessari per la prenotazione",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  return (
    <Box>
      <Header filters={true} />
      {
        isMobile && <Box
          display={{
            base: "block",
            md: "none",
          }}
        >
          <FiltersForm
            openModalMobile={openModalMobile}
            setOpenModalMobile={setOpenModalMobile}
          />
        </Box>
      }
      <Flex
        flexDirection={"column"}
        maxW={{
          base: "unset",
          md: "5xl",
        }}
        ml={"auto"}
        mr={"auto"}
        pt={10}
        px={{
          base: 5,
          md: 0,
        }}
        gap={2}
      >
        {/* header */}
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text variant={"header"} fontSize={"2xl"}>
            {roomTypeData?.[0]?.Property?.name}
          </Text>
          <Flex gap={4} alignItems={"center"}>
            <Flex gap={2} cursor={"pointer"}>
              <TbShare size={"1.3rem"} />
              <Text variant={"link"} display={{ base: "none", md: "block" }}>
                Condividi
              </Text>
            </Flex>
            <Flex gap={2} cursor={"pointer"}>
              <PiHeartStraightDuotone size={"1.3rem"} />
              <Text variant={"link"} display={{ base: "none", md: "block" }}>
                Salva
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {/* gallery */}
        <Flex
          gap={1}
          justifyContent={"space-between"}
          position={"relative"}
          overflowX={"scroll"}
          overflowY={"hidden"}
          h={320}
          w={"full"}
          py={2}
        >
          <Button
            variant={"gallery"}
            position={"absolute"}
            bottom={6}
            right={6}
            zIndex={2}
            onClick={onOpen}
          >
            <LuGalleryVerticalEnd />
            <Text ml={2}>Mostra altre foto</Text>
          </Button>
          <Modal onClose={onClose} size={"full"} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent
              maxH={"100vh"}
              overflow={"hidden"}
              p={{
                base: 5,
                md: 10,
              }}
            >
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Flex gap={2} cursor={"pointer"} onClick={onClose}>
                  <FiChevronLeft size={"1.3rem"} />
                  <Text
                    variant={"link"}
                    textDecoration={"unset"}
                    display={{ base: "none", md: "block" }}
                  >
                    Indietro
                  </Text>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                  <Flex gap={2} cursor={"pointer"}>
                    <TbShare size={"1.3rem"} />
                    <Text
                      variant={"link"}
                      display={{ base: "none", md: "block" }}
                    >
                      Condividi
                    </Text>
                  </Flex>
                  <Flex gap={2} cursor={"pointer"}>
                    <PiHeartStraightDuotone size={"1.3rem"} />
                    <Text
                      variant={"link"}
                      display={{ base: "none", md: "block" }}
                    >
                      Salva
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <ModalBody
                overflowY={"scroll"}
                mt={2}
                p={{
                  base: 0,
                  md: 5,
                }}
              >
                {images
                  ? images.map((image, index) => {
                    if (image.alt && image.src) {
                      return (
                        <Flex
                          key={image.alt + "_" + index}
                          justifyContent={"center"}
                          mb={3}
                        >
                          <Image
                            src={image.src}
                            width={800}
                            height={600}
                            alt={image.alt}
                            style={{
                              borderRadius: "0.5rem",
                              overflow: "hidden",
                              objectFit: "cover",
                            }}
                          />
                        </Flex>
                      );
                    }
                  })
                  : null}
              </ModalBody>
            </ModalContent>
          </Modal>
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 1.2,
              },
              480: {
                slidesPerView: 1.2,
              },
              640: {
                slidesPerView: 2.5,
              },
            }}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
          >
            {images
              ? images.map((image, index) => {
                if (image.alt && image.src)
                  return (
                    <SwiperSlide key={image.alt + "_" + index}>
                      <Image
                        src={image.src}
                        width={400}
                        height={300}
                        alt={image.alt}
                        style={{
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          objectFit: "cover",
                          minHeight: "300px",
                        }}
                      />
                    </SwiperSlide>
                  );
              })
              : null}
          </Swiper>
        </Flex>
        {/* Description */}
        <Flex py={5}>
          <Flex maxW={"xl"} flexDirection={"column"} gap={4}>
            <Box>
              <Text variant={"bold"} fontSize={"2xl"}>
                {address}
              </Text>
              <Text variant={"label"} color={"var(--dark-border-hover)"}>
                4 ospiti • 2 camere da letto • 2 letti • 2 bagni
              </Text>
            </Box>
            {/* host info */}
            <Stack divider={<StackDivider />} spacing="4">
              {/* <Box>
                <Text variant={"header"} fontSize={"lg"}>
                  {"Nome dell'host"}
                </Text>
                <Text
                  variant={"title"}
                  fontSize={"md"}
                  color={"var(--dark-border-hover)"}
                >
                  Piergigi Sassofonista
                </Text>
              </Box> */}
              {/* Descrizione */}
              <Box display={"none"}>
                <Text variant={"label"}>
                  {
                    "L'esposizione a sud della terrazza permette di godere a pieno del sole anche nei mesi meno caldi A CAUSA DI UNA FORTE MAREGGIATA LA SPIAGGIA NELLA PRIMA FOTO, CHE SI TROVA SOTTO L'APPARTAMENTO, È STATA DANNEGGIATA E AL MOMENTO NON È ACCESSIBILE. SI PUÒ USUFRUIRE DELLA SPIAGGIA PRINCIPALE DI ZOAGLI, DISTA 10 MINUTI A PIEDI POSTO AUTO PRIVATO all'interno del residence, dista 150 metri dall'appartamento, sono presenti alcuni scalini lungo il percorso"
                  }
                </Text>
                <Flex mt={5} alignItems={"center"} cursor={"pointer"}>
                  <Text variant={"link"}>Mostra altro</Text>
                  <FiChevronRight size={"1.3rem"} />
                </Flex>
              </Box>
              {/* Servizi */}
              <Flex flexDirection={"column"}>
                <Text variant={"header"} fontSize={"lg"}>
                  Cosa troverai
                </Text>
                {/* lista dei servizi */}
                <Flex
                  gap={{
                    base: 3,
                    md: 5,
                  }}
                  pt={{
                    base: 3,
                    md: 4,
                  }}
                  flexDirection={{
                    base: "column",
                    md: "row",
                  }}
                  flexWrap={"wrap"}
                >
                  {commonAmenities?.map((amenity) => {
                    if (
                      (amenity.nameTranslations as AmenityTranslationsType) &&
                      // to do: da gestire rispetto alla scelta della lingua
                      (amenity.nameTranslations as AmenityTranslationsType).it
                    ) {
                      return (
                        <Service
                          key={amenity.name}
                          // to do: Icone da gestire
                          icon={getRoomTypeAmenitiesIcon(amenity)}
                          title={
                            (
                              amenity.nameTranslations as AmenityTranslationsType
                            ).it ?? ""
                          }
                        />
                      );
                    }
                  })}
                  {/* <Service icon={TbParking} title={"Pargheggio"} />
                    <Service icon={TbSnowflake} title={"Condizionatore"} /> */}
                </Flex>
                {/* <Flex
                    gap={{
                      base: 3,
                      md: 20,
                    }}
                    pt={{
                      base: 3,
                      md: 4,
                    }}
                    flexDirection={{
                      base: "column",
                      md: "row",
                    }}
                  >
                    <Service icon={TbWifi} title={"Wifi"} />
                    <Service icon={TbWashMachine} title={"Lavatrice"} />
                  </Flex>
                  <Flex
                    gap={{
                      base: 3,
                      md: 20,
                    }}
                    pt={{
                      base: 3,
                      md: 4,
                    }}
                    flexDirection={{
                      base: "column",
                      md: "row",
                    }}
                  >
                    <Service icon={TbDeviceDesktop} title={"Televisione"} />
                    <Service icon={LuRefrigerator} title={"Freezer"} />
                  </Flex> */}
              </Flex>
              {/* da sapere */}
              <Flex flexDirection={"column"}>
                <Text variant={"header"} fontSize={"lg"}>
                  Da sapere
                </Text>
                {/* lista dei servizi */}
                <Flex
                  gap={{
                    base: 6,
                    md: 2,
                  }}
                  py={4}
                  flexDirection={{
                    base: "column",
                    md: "row",
                  }}
                >
                  <Flex
                    flexDirection={"column"}
                    gap={2}
                    width={{
                      base: "full",
                      md: "sm",
                    }}
                  >
                    <Text variant={"header"} fontSize={"md"}>
                      {"Regole dell'host"}
                    </Text>
                    <Text variant={"title"} fontSize={"md"}>
                      Check-in: 13:00-15:00
                    </Text>
                    <Text variant={"title"} fontSize={"md"}>
                      Check-out entro le ore 10:00
                    </Text>
                    <Text variant={"title"} fontSize={"md"}>
                      Massimo 4 ospiti
                    </Text>
                  </Flex>
                  <Flex
                    flexDirection={"column"}
                    gap={2}
                    width={{
                      base: "full",
                      md: "sm",
                    }}
                  >
                    <Text variant={"header"} fontSize={"md"}>
                      {"Termini di cancellazione"}
                    </Text>
                    <Text variant={"title"} fontSize={"md"}>
                      Questa prenotazione non è rimborsabile.
                    </Text>
                    <Text variant={"title"} fontSize={"md"}>
                      {
                        "Leggi i termini di cancellazione completi dell'host, che si applicano anche in caso di malattia o disagi legati alla pandemia di COVID-19."
                      }
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Stack>
          </Flex>
          {/* Booking Form */}
          <Box
            p={5}
            w={"full"}
            position={"relative"}
            display={{
              base: "none",
              md: "block",
            }}
          >
            <Flex
              gap={5}
              top={5}
              position={"sticky"}
              flexDirection={"column"}
              p={5}
              border={"1px solid"}
              borderColor={"inherit"}
              borderRadius={"lg"}
              boxShadow={"md"}
            >
              {/* prezzo */}
              <Flex alignItems={"center"} gap={2}>
                <Text
                  variant={"label"}
                  display={labelChoosenPrice ? "none" : "block"}
                  color="var(--praia-primary)"
                >
                  a partire da
                </Text>
                <Text variant={"header"} color="var(--praia-primary)">
                  {labelChoosenPrice
                    ? `${labelChoosenPrice} €`
                    : labelStartingPrice
                      ? `${labelStartingPrice} €`
                      : "~"}
                </Text>
                <Text variant={"label"} color="var(--praia-primary)">
                  a notte
                </Text>
              </Flex>
              {/* filtra */}
              <Flex
                flexDirection={"column"}
                gap={3}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Alert
                  status="info"
                  borderRadius={"lg"}
                  display={canChooseRoom ? "none" : "block"}
                >
                  <Text fontFamily={"Inter-Regular"} fontSize={"sm"}>
                    Scegli la <b>data</b> e gli <b>ospiti</b> prima di
                    procedere con la scelta della camera
                  </Text>
                </Alert>
                {/* Date */}
                <Flex
                  w={"full"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  flexDirection={"column"}
                  borderRadius={"lg"}
                  border={"1px solid"}
                  borderColor={"inherit"}
                  p={3}
                  gap={openDateContainerModal ? 5 : 0}
                >
                  <Flex
                    w={"full"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    cursor={"pointer"}
                    onClick={() => {
                      setDatesContainerModal(!openDateContainerModal);
                    }}
                  >
                    <Box>
                      <Text
                        variant={"header"}
                        color="var(--praia-primary)"
                        fontSize={"lg"}
                      >
                        Date
                      </Text>
                      <Text variant={"label"} color="var(--praia-primary)">
                        {listingLabelDate}
                      </Text>
                    </Box>
                    <Box
                      transform={
                        openDateContainerModal
                          ? "rotate(180deg)"
                          : "rotate(0deg)"
                      }
                      transition={"all .3s ease-in-out"}
                    >
                      <FiChevronDown
                        color="var(--praia-primary)"
                        size={"1.5rem"}
                      />
                    </Box>
                  </Flex>
                  <Flex
                    w={"full"}
                    display={openDateContainerModal ? "block" : "none"}
                    opacity={openDateContainerModal ? 1 : 0}
                    h={openDateContainerModal ? "auto" : 0}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <EventCalendar
                      nameDate={""}
                      nameTime={""}
                      label={""}
                      showOneCalendar={true}
                    />
                  </Flex>
                </Flex>
                {/* Chi */}
                <Flex
                  w={"full"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  flexDirection={"column"}
                  borderRadius={"lg"}
                  border={"1px solid"}
                  borderColor={"inherit"}
                  p={3}
                  gap={openWhoContainerModal ? 5 : 0}
                >
                  <Flex
                    w={"full"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    cursor={"pointer"}
                    onClick={() => {
                      setWhoContainerModal(!openWhoContainerModal);
                    }}
                  >
                    <Box>
                      <Text
                        variant={"header"}
                        color="var(--praia-primary)"
                        fontSize={"lg"}
                      >
                        Ospiti
                      </Text>
                      <Text variant={"label"} color="var(--praia-primary)">
                        {listingLabelOspiti}
                      </Text>
                    </Box>
                    <Box
                      transform={
                        openWhoContainerModal
                          ? "rotate(180deg)"
                          : "rotate(0deg)"
                      }
                      transition={"all .3s ease-in-out"}
                    >
                      <FiChevronDown
                        color="var(--praia-primary)"
                        size={"1.5rem"}
                      />
                    </Box>
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
                {/* Camera */}
                <Flex
                  w={"full"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  flexDirection={"column"}
                  borderRadius={"lg"}
                  border={"1px solid"}
                  borderColor={"inherit"}
                  p={3}
                  gap={openRoomContainerModal ? 5 : 0}
                  bg={
                    canChooseRoom
                      ? "trasparent"
                      : "var(--chakra-colors-gray-200)"
                  }
                  color={"var(--chakra-colors-gray-300)"}
                  cursor={"pointer"}
                  onClick={() => {
                    if (canChooseRoom) {
                      setRoomContainerModal(!openRoomContainerModal);
                      onOpenRoom();
                    }
                  }}
                >
                  <Flex
                    w={"full"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Box>
                      <Text
                        variant={"header"}
                        fontSize={"lg"}
                        color={
                          canChooseRoom
                            ? "var(--praia-primary)"
                            : "var(--chakra-colors-gray-400)"
                        }
                      >
                        Camera
                      </Text>
                      <Text
                        variant={"label"}
                        color={
                          canChooseRoom
                            ? "var(--praia-primary)"
                            : "var(--chakra-colors-gray-400)"
                        }
                      >
                        {
                          roomType?.name ? roomType?.name : "Seleziona camera"
                        }
                      </Text>
                    </Box>
                    <Box>
                      <TbClick
                        color={
                          canChooseRoom
                            ? "var(--praia-primary)"
                            : "var(--chakra-colors-gray-400)"
                        }
                        size={"1.5rem"}
                      />
                    </Box>
                  </Flex>
                  <Modal
                    onClose={onCloseRoom}
                    isOpen={isOpenRoom}
                    size={"full"}
                    isCentered
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <Text variant={"header"}>
                            Scegli la camera giusta per le tue esigenze
                          </Text>
                          <TbX
                            size={"1.5rem"}
                            onClick={onCloseRoom}
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
                        <Flex
                          flexDirection={"column"}
                          gap={{
                            base: 5,
                            md: 5,
                          }}
                        >
                          {roomTypeData?.map((roomType) => (
                            <Flex
                              key={
                                roomType.Property?.name + "_" + roomType.name
                              }
                              flexDirection={"column"}
                              gap={2}
                              border={"1px solid"}
                              borderColor={"inherit"}
                              borderRadius={"xl"}
                              boxShadow={"sm"}
                              p={5}
                            >
                              <Text variant={"header"} fontSize={"lg"}>
                                {roomType.name}
                              </Text>
                              <Flex
                                flexDirection={{
                                  base: "column",
                                  md: "row",
                                }}
                                gap={{
                                  base: 5,
                                  md: 10,
                                }}
                              >
                                <Box maxW={"350px"}>
                                  <Swiper
                                    modules={[Navigation]}
                                    navigation
                                    loop={true}
                                    slidesPerView={1}
                                    className="mySwiper"
                                  >
                                    {roomType.images
                                      ? roomType.images.map(
                                        (image, index) => {
                                          if (image)
                                            return (
                                              <SwiperSlide
                                                key={image + "_" + index}
                                              >
                                                <Image
                                                  src={image}
                                                  width={350}
                                                  height={150}
                                                  alt={image}
                                                  style={{
                                                    borderRadius: "0.5rem",
                                                    overflow: "hidden",
                                                    objectFit: "cover",
                                                    minHeight: "150px",
                                                  }}
                                                />
                                              </SwiperSlide>
                                            );
                                        }
                                      )
                                      : null}
                                  </Swiper>
                                </Box>
                                <Box>
                                  <Text variant={"header"} fontSize={"lg"}>
                                    Servizi
                                  </Text>
                                  <Flex maxW={"350px"} flexWrap={"wrap"}>
                                    {roomType.RoomTypeAmenity.map(
                                      (amenity, index) => {
                                        if (
                                          (
                                            amenity.amenity
                                              .nameTranslations as AmenityTranslationsType
                                          ).it
                                        )
                                          return (
                                            <Flex
                                              key={
                                                roomType.id +
                                                "_" +
                                                index +
                                                "_" +
                                                amenity.amenity.id
                                              }
                                              mr={2}
                                              gap={1}
                                              alignItems={"center"}
                                            >
                                              <TbCheck color="green" />
                                              <Text fontSize={"sm"}>
                                                {
                                                  (
                                                    amenity.amenity
                                                      .nameTranslations as AmenityTranslationsType
                                                  ).it
                                                }
                                              </Text>
                                            </Flex>
                                          );
                                      }
                                    )}
                                  </Flex>
                                </Box>
                                <Box>
                                  <Text variant={"header"} fontSize={"lg"}>
                                    Numero di ospiti
                                  </Text>
                                  <Text>Min: {roomType.minOccupancy}</Text>
                                  <Text>Max: {roomType.maxOccupancy}</Text>
                                </Box>
                                <Box>
                                  <Text variant={"header"} fontSize={"lg"}>
                                    {`Prezzo per ${night} notti`}
                                  </Text>
                                  <Text variant={"header"} fontSize={"md"}>
                                    {getRoomTypePrice(
                                      roomType.RoomTypePricesAvailability.find(
                                        (roomTypePrice) =>
                                          roomTypePrice.dateFrom &&
                                          checkin &&
                                          roomTypePrice.dateFrom <= checkin &&
                                          roomTypePrice.dateTo &&
                                          checkout &&
                                          roomTypePrice.dateTo >= checkout
                                      )?.price,
                                      night,
                                      true
                                    )}
                                  </Text>
                                  <Text
                                    fontSize={"sm"}
                                    color={"var(--light-border-hover)"}
                                  >
                                    {getRoomTypePrice(
                                      roomType.RoomTypePricesAvailability.find(
                                        (roomTypePrice) =>
                                          roomTypePrice.dateFrom &&
                                          checkin &&
                                          roomTypePrice.dateFrom <= checkin &&
                                          roomTypePrice.dateTo &&
                                          checkout &&
                                          roomTypePrice.dateTo >= checkout
                                      )?.price,
                                      night,
                                      true,
                                      true
                                    )}
                                  </Text>
                                </Box>
                                <Box mt={"auto"} ml={"auto"}>
                                  <Button
                                    textTransform={"capitalize"}
                                    variant={
                                      Number(
                                        getRoomTypePrice(
                                          roomType.RoomTypePricesAvailability.find(
                                            (roomTypePrice) =>
                                              roomTypePrice.dateFrom &&
                                              checkin &&
                                              roomTypePrice.dateFrom <=
                                              checkin &&
                                              roomTypePrice.dateTo &&
                                              checkout &&
                                              roomTypePrice.dateTo >= checkout
                                          )?.price,
                                          night
                                        )
                                      ) > 0
                                        ? "primary"
                                        : "notAvailable"
                                    }
                                    onClick={() => {
                                      if (
                                        Number(
                                          getRoomTypePrice(
                                            roomType.RoomTypePricesAvailability.find(
                                              (roomTypePrice) =>
                                                roomTypePrice.dateFrom &&
                                                checkin &&
                                                roomTypePrice.dateFrom <=
                                                checkin &&
                                                roomTypePrice.dateTo &&
                                                checkout &&
                                                roomTypePrice.dateTo >=
                                                checkout
                                            )?.price,
                                            night
                                          )
                                        ) > 0
                                      ) {
                                        if (roomType.name) {
                                          setLabelChoosenPrice(
                                            getRoomTypePrice(
                                              roomType.RoomTypePricesAvailability.find(
                                                (roomTypePrice) =>
                                                  roomTypePrice.dateFrom &&
                                                  checkin &&
                                                  roomTypePrice.dateFrom <=
                                                  checkin &&
                                                  roomTypePrice.dateTo &&
                                                  checkout &&
                                                  roomTypePrice.dateTo >=
                                                  checkout
                                              )?.price,
                                              night,
                                              false,
                                              true
                                            ).toString()
                                          );
                                          onCloseRoom();
                                          updateFilters({
                                            roomType
                                          });
                                        }
                                      } else {
                                        console.log("Non disponibile");
                                      }
                                    }}
                                  >
                                    {Number(
                                      getRoomTypePrice(
                                        roomType.RoomTypePricesAvailability.find(
                                          (roomTypePrice) =>
                                            roomTypePrice.dateFrom &&
                                            checkin &&
                                            roomTypePrice.dateFrom <=
                                            checkin &&
                                            roomTypePrice.dateTo &&
                                            checkout &&
                                            roomTypePrice.dateTo >= checkout
                                        )?.price,
                                        night
                                      )
                                    ) > 0
                                      ? "Seleziona"
                                      : "Non disponibile"}
                                  </Button>
                                </Box>
                              </Flex>
                            </Flex>
                          ))}
                        </Flex>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </Flex>
              </Flex>
              {/* prenota btn */}
              <Button
                variant={"primary"}
                w={"full"}
                py={4}
                textTransform={"none"}
                isLoading={isLoading}
                onClick={
                  () => {
                    createBookingIntent();
                  }
                }
              >
                Prenota
              </Button>
              {/* informazioni prezzo finale */}
              <Box
                pt={4}
                display={night && labelChoosenPrice ? "block" : "none"}
              >
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text variant={"link"} fontFamily={"Inter-Regular"}>
                    {`${labelChoosenPrice} € x ${night} ${night > 1 ? "notti" : "notte"
                      }`}
                  </Text>
                  <Text variant={"title"}>
                    {`${Number(labelChoosenPrice) * night} €`}
                  </Text>
                </Flex>
                <Box py={4}>
                  <Divider />
                </Box>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text variant={"header"} fontSize={"lg"}>
                    Totale
                  </Text>
                  <Text variant={"header"} fontSize={"lg"}>
                    {`${Number(labelChoosenPrice) * night} €`}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Flex>
      {/* Booking Form Mobile */}
      <Flex
        display={{
          base: "flex",
          md: "none",
        }}
        w={"full"}
        justifyContent={"space-between"}
        alignItems={"center"}
        position={"fixed"}
        bottom={0}
        px={5}
        py={3}
        backgroundColor={"#fafafa"}
        borderTop={"1px solid"}
        borderColor={"inherit"}
        zIndex={2}
      >
        <Flex flexDirection={"column"} gap={1}>
          <Flex alignItems={"center"} gap={2}>
            <Text variant={"header"} fontSize={"xl"}>
              {labelChoosenPrice
                ? `${labelChoosenPrice} €`
                : labelStartingPrice
                  ? `${labelStartingPrice} €`
                  : ""}
            </Text>
            <Text variant={"label"}>
              {labelChoosenPrice ?? labelStartingPrice ? `notte` : ""}
            </Text>
          </Flex>
          <Text
            variant={"link"}
            onClick={() => {
              setOpenModalMobile(true);
            }}
          >
            {listingLabelDate}
          </Text>
        </Flex>
        <Button variant={"primary"} textTransform={"none"} py={4} isLoading={isLoading} onClick={
          () => {
            createBookingIntent();
          }
        }>
          Prenota
        </Button>
      </Flex>
    </Box>
  );
}

function getRoomTypeAmenitiesIcon(amenity: Amenity): IconType {
  // console.log("amenity: ", amenity.code);
  switch (amenity.code) {
    case "pets_allowed":
      return TbDog;
    case "pocket_wifi":
      return TbWifi;
    case "free_parking":
      return TbParking;
    case "air_conditioning":
      return TbSnowflake;
    case "elevator":
      return TbElevator;
    case "bidet":
      return TbBadgeWc;
    default:
      return TbCircleCheck;
  }
}
