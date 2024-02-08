import Header from "@/components/headers/Main";
import PrimaryInput from "@/components/inputs/PrimaryInput";
import { getDate } from "@/context/FiltersContext";
import { api } from "@/utils/api";
import { Box, Button, Divider, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TbStarFilled } from "react-icons/tb";
import { StringParam, useQueryParams } from "use-query-params";

export default function Checkout() {
    const formCheckout = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    }
    const id = useRouter().query.id;
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

    }, [booking]);
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
                pt={10}
                px={{
                    base: 5,
                    md: 0,
                }}
                gap={2}
            >
                <Text variant={"header"} fontSize={"3xl"}>Inserisci le tue informazioni e dettagli di pagamento</Text>
                <Flex mt={10} flexDirection={{
                    base: "column",
                    md: "row",
                }} gap={5}>
                    <Flex flexDirection={"column"} gap={5} flex={1}>
                        <Box
                            borderRadius={'lg'}
                            border={"1px solid"}
                            borderColor={"gray.200"}
                            p={5}
                        >
                            <Text variant={"header"} fontSize={"lg"}>
                                Procedi con la prenotazione!
                            </Text>
                            <Text >
                                Di solito {booking?.roomType?.Property?.name} è molto richiesto, quindi ti consigliamo di prenotare il prima possibile.
                            </Text>
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
                                <Flex justifyContent={'center'} alignItems={'center'}>
                                    <Link href={'/listing/' + booking?.roomType?.Property?.id}>
                                        <Text variant={'link'}>Modifica</Text>
                                    </Link>
                                </Flex>
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
                                <Flex justifyContent={'center'} alignItems={'center'}>
                                    <Link href={'/listing/' + booking?.roomType?.Property?.id}>
                                        <Text variant={'link'}>Modifica</Text>
                                    </Link>
                                </Flex>
                            </Flex>
                        </Box>

                        <Divider my={2} />

                        <Box>
                            <Text variant={"header"} fontSize={"2xl"}>
                                Informazioni di contatto
                            </Text>
                            <Box mt={5}>
                                <FormProvider {...formCheckout}>
                                    <Flex flexDirection={{
                                        base: "column",
                                        md: "row",
                                    }} gap={5}>
                                        <PrimaryInput
                                            name={"name"}
                                            type="text"
                                            placeholder={"Nome"}
                                            isRequired={true}
                                        />
                                        <PrimaryInput
                                            name={"surname"}
                                            type="text"
                                            placeholder={"Cognome"}
                                            isRequired={true}
                                        />
                                    </Flex>
                                    <Flex flexDirection={{
                                        base: "column",
                                        md: "row",
                                    }} gap={5} mt={5}>
                                        <PrimaryInput
                                            name={"email"}
                                            type="email"
                                            placeholder={"Email"}
                                            isRequired={true}
                                        />
                                        <PrimaryInput
                                            name={"phone"}
                                            type="tel"
                                            placeholder={"Telefono"}
                                            isRequired={true}
                                        />
                                    </Flex>

                                </FormProvider>
                            </Box>
                        </Box>
                        <Divider my={2} />

                    </Flex>
                    <Flex flexDirection={"column"} gap={5} flex={1}>
                        <Box
                            borderRadius={'lg'}
                            border={"1px solid"}
                            borderColor={"gray.200"}
                            p={5}
                            ml={{
                                base: 0,
                                md: "auto",

                            }}
                            w={{
                                base: "100%",
                                md: "90%",
                            }}
                        >
                            <Box p={2}>
                                <Flex gap={5}>
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
                                </Flex>
                                <Divider my={5} />
                                <Text typeof="header" fontSize={'2xl'} fontWeight={'600'}>
                                    Riepilogo prenotazione
                                </Text>
                                <Flex justifyContent={'space-between'} mt={5}>
                                    <Text>
                                        {pricePerNight}€ x {nights} notti
                                    </Text>
                                    <Text fontWeight={'bold'}>
                                        {booking?.price}€
                                    </Text>
                                </Flex>
                                {/* <Flex justifyContent={'space-between'} mt={2}>
                                    <Text>
                                        Pulizia
                                    </Text>
                                    <Text fontWeight={'bold'}>
                                        15€
                                    </Text>
                                </Flex>
                                <Flex justifyContent={'space-between'} mt={2}>
                                    <Text>
                                        Tasse
                                    </Text>
                                    <Text fontWeight={'bold'}>
                                        30€
                                    </Text>
                                </Flex> */}
                                <Divider my={5} />
                                <Flex justifyContent={'space-between'} mt={2}>
                                    <Text>
                                        Totale
                                    </Text>
                                    <Text fontWeight={'bold'}>
                                        {booking?.price}€
                                    </Text>
                                </Flex>
                                <Button mt={5} w={'100%'} variant={'primary'} textTransform={'none'} onClick={formCheckout.handleSubmit(onSubmit)}>
                                    Procedi con il pagamento
                                </Button>
                            </Box>

                        </Box>
                    </Flex>

                </Flex>

            </Flex>
        </>
    )
}