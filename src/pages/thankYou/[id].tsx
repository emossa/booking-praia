import Header from "@/components/headers/Main";
import { getDate } from "@/context/FiltersContext";
import { api } from "@/utils/api";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/react";
import { color } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TbStarFilled } from "react-icons/tb";

const ThankYou = () => {
    const { id } = useRouter().query;
    const { data: booking } = api.booking.get.useQuery(id as string);
    const [nights, setNights] = useState<number>(0);
    const [pricePerNight, setPricePerNight] = useState<number>(0);

    useEffect(() => {
        if (booking?.checkin && booking?.checkout) {
            const nights = Math.floor(
                (booking?.checkout.getTime() - booking?.checkin.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            setNights(nights);
            if (booking?.price && nights > 0) {
                setPricePerNight(booking?.price / nights)
            }
        }
    }
        , [booking]);

    return (
        <>
            <Header filters={false} />
            <Flex
                flexDirection={"column"}
                maxW={{
                    base: "unset",
                    md: "5xl",
                }}
                ml={"auto"}
                mr={"auto"}
                py={10}
                px={{
                    base: 5,
                    md: 0,
                }}
                gap={2}
                border={"1px solid"}
                borderColor={"gray.200"}
                borderRadius={"lg"}
                justifyContent={"center"}
            >
                <Text variant={"header"} textAlign={"center"} fontSize={'3xl'}>
                    Grazie per la tua prenotazione!
                </Text>
                <Text variant={"body"} textAlign={"center"} fontSize={'xl'}>
                    Il tuo ID di prenotazione è: {id}
                </Text>
                <Text variant={"body"} textAlign={"center"} fontSize={'lg'}>
                    A breve riceverai una mail di conferma. Se non la ricevi, controlla la tua cartella spam.
                </Text>

                <Text variant={"body"} textAlign={"center"} fontSize={'2xl'} my={5}>
                    Ecco il riepilogo della tua prenotazione:
                </Text>
                <Flex gap={5} justifyContent={'space-around'}>
                    <Box>
                        <Box
                            bgImage={"/media/test/hotel-prova.jpg"}
                            bgSize={"cover"}
                            bgPosition={"center"}
                            w={'120px'}
                            h={'105px'}
                            borderRadius={'lg'}
                        />
                        <Flex direction={'column'} justifyContent={'space-between'}>
                            <Box>
                                <Text fontSize={'sm'} color={'gray.400'}>
                                    Tipologia alloggio: {booking?.roomType?.name?.toLowerCase()}
                                </Text>
                                <Text fontSize={'lg'} fontWeight={'bold'}>
                                    {booking?.roomType?.Property?.name}
                                </Text>
                            </Box>
                            <Box>
                                <Flex alignItems={'center'} gap={'5px'}>
                                    <Text fontSize={'sm'} >4.5</Text>  <TbStarFilled color="yellow.400" /> <Text fontSize={'sm'} color={'gray.400'}>(123 recensioni)</Text>
                                </Flex>

                            </Box>
                        </Flex>
                    </Box>
                    <Box>
                        <Text variant={"header"} fontSize={"2xl"}>
                            Il tuo soggiorno
                        </Text>
                        <Flex justifyContent={'space-between'} mt={5}>
                            <Box>
                                <Text fontWeight={'bold'}>
                                    Date
                                </Text>
                                <Text>
                                    {getDate(booking?.checkin)} -{getDate(booking?.checkout)}
                                </Text>
                            </Box>

                        </Flex>
                        <Flex justifyContent={'space-between'} mt={2}>
                            <Box>
                                <Text fontWeight={'bold'}>
                                    Ospiti
                                </Text>
                                <Text>
                                    {
                                        booking?.chi_adulti
                                    } Adulti, {
                                        booking?.chi_bambini
                                    } Bambini, {
                                        booking?.chi_neonati
                                    } Neonati, {
                                        booking?.chi_pets
                                    } Animali

                                </Text>
                            </Box>

                        </Flex>
                    </Box>
                </Flex>
                <Text textAlign={'center'} mt={50} color={'gray.400'}>
                    Per qualsiasi domanda o richiesta, non esitare a contattarci. Grazie per aver scelto di prenotare con noi!
                </Text>






            </Flex >
        </>
    )
}

export default ThankYou;