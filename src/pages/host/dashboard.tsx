import Header from "@/components/headers/Main";
import PrimaryInput from "@/components/inputs/PrimaryInput";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { api, type RouterInputs } from "@/utils/api";
import { signOut } from "next-auth/react";
import { TbRefresh } from "react-icons/tb";

export default function Dashboard() {
  const toast = useToast();
  const [stripeTestMode, setStripeTestMode] = useState(false);

  /* Form Stripe */
  const formStripe = useForm<RouterInputs["user"]["updateStripe"]>();
  const { handleSubmit: handleSubmitStripe } = formStripe;
  const { mutate: mutateStripe, isLoading: isLoadingUpdateStripe } =
    api.user.updateStripe.useMutation({
      onSuccess: () => {
        const toastConfig = (
          title: string,
          description: string,
          status: "success" | "error"
        ) => ({
          title,
          description,
          status,
          duration: 5000,
          isClosable: true,
        });

        toast(
          toastConfig(
            "Chiavi aggiornate",
            "Sono state aggiornate le chiavi di Stripe con successo",
            "success"
          )
        );
      },
      onError: (error) => {
        const toastConfig = (
          title: string,
          description: string,
          status: "success" | "error"
        ) => ({
          title,
          description,
          status,
          duration: 5000,
          isClosable: true,
        });
        toast(toastConfig("Errore", error.message, "error"));
      },
    });
  const onSubmitUpdateStripe = handleSubmitStripe(async (data) => {
    mutateStripe(data);
  });

  /* Form KrossBooking */
  const formKrossBooking =
    useForm<RouterInputs["user"]["updateKrossBooking"]>();
  const { handleSubmit: handleSubmitKrossBooking } = formKrossBooking;
  const { mutate: mutateKrossBooking, isLoading: isLoadingUpdateKrossBooking } =
    api.user.updateKrossBooking.useMutation({
      onSuccess: () => {
        const toastConfig = (
          title: string,
          description: string,
          status: "success" | "error"
        ) => ({
          title,
          description,
          status,
          duration: 5000,
          isClosable: true,
        });

        toast(
          toastConfig(
            "Credenziali aggiornate",
            "Sono state aggiornate le credenziali di KrossBooking con successo",
            "success"
          )
        );
      },
      onError: (error) => {
        const toastConfig = (
          title: string,
          description: string,
          status: "success" | "error"
        ) => ({
          title,
          description,
          status,
          duration: 5000,
          isClosable: true,
        });
        toast(toastConfig("Errore", error.message, "error"));
      },
    });
  const onSubmitUpdateKrossBooking = handleSubmitKrossBooking(async (data) => {
    mutateKrossBooking(data);
  });

  /* Stripe keys */
  const { data: userData } = api.user.getUserFromCtx.useQuery();
  useEffect(() => {
    if (userData?.stripeSk && userData?.stripePk) {
      formStripe.setValue("stripeSk", userData?.stripeSk);
      formStripe.setValue("stripePk", userData?.stripePk);
    }

    if (userData?.stripeTestMode) {
      formStripe.setValue("stripeTestMode", userData?.stripeTestMode);
      setStripeTestMode(userData?.stripeTestMode);
    } else {
      formStripe.setValue("stripeTestMode", false);
      setStripeTestMode(false);
    }

    if (userData?.apiUsr && userData?.apiPsw) {
      formKrossBooking.setValue("apiUsr", userData?.apiUsr);
      formKrossBooking.setValue("apiPsw", userData?.apiPsw);
    }
  }, [userData, formStripe, formKrossBooking]);

  /* Sync Room types */
  const { mutateAsync: mutateImportRoomTypes } =
    api.roomTypes.importRoomTypes.useMutation({});

  return (
    <>
      <Header />
      <Flex
        justifyContent={"center"}
        p={{
          base: 4,
          md: 10,
        }}
      >
        <Flex
          width={"full"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={4}
          maxWidth={{
            base: "full",
            md: "2xl",
          }}
        >
          <Box textAlign={"center"}>
            <Text
              variant={"header"}
              fontSize={{
                base: "2xl",
                md: "3xl",
              }}
            >
              Configurazione Profilo Host
            </Text>
            <Text variant={"label"}>{userData?.email}</Text>
          </Box>
          <FormProvider {...formStripe}>
            <Flex
              width={"full"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={4}
              p={{
                base: 6,
                md: 10,
              }}
              border={"1px solid"}
              borderColor={
                stripeTestMode ? "var(--chakra-colors-red-500)" : "#6875df"
              }
              borderRadius={"lg"}
              transition={"all 0.2s ease-in-out"}
            >
              <Flex
                width={"full"}
                justifyContent={"space-between"}
                alignItems={"center"}
                py={2}
              >
                <Image
                  src={"/media/icons/stripe-logo.png"}
                  alt={"Stripe logo"}
                  width={80}
                  height={80}
                />
                <Box>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel
                      htmlFor="test-mode"
                      mb="0"
                      fontFamily={"Inter-Regular"}
                      fontWeight={"500"}
                      fontSize={"sm"}
                      color={"var(--black-primary)"}
                      cursor={"pointer"}
                    >
                      Modalità di test
                    </FormLabel>
                    <Switch
                      id="test-mode"
                      colorScheme="red"
                      isChecked={stripeTestMode}
                      onChange={() => {
                        setStripeTestMode(!stripeTestMode);
                        formStripe.setValue("stripeTestMode", !stripeTestMode);
                        console.log(formStripe.getValues());
                      }}
                    />
                  </FormControl>
                </Box>
              </Flex>
              <Box w="full">
                <Text variant={"label"}>Chiave segreta</Text>
                <PrimaryInput
                  type={"text"}
                  name={"stripeSk"}
                  placeholder="sk_"
                />
              </Box>
              <Box w="full">
                <Text variant={"label"}>Chiave pubblica</Text>
                <PrimaryInput
                  type={"text"}
                  name={"stripePk"}
                  placeholder="pk_"
                />
              </Box>
              <Button
                variant={"primary"}
                ml={"auto"}
                textTransform={"capitalize"}
                px={6}
                isLoading={isLoadingUpdateStripe}
                onClick={onSubmitUpdateStripe}
              >
                Salva
              </Button>
            </Flex>
          </FormProvider>
          <FormProvider {...formKrossBooking}>
            <Flex
              width={"full"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={4}
              p={{
                base: 6,
                md: 10,
              }}
              border={"1px solid"}
              borderColor={"#e4e4e4"}
              borderRadius={"lg"}
              transition={"all 0.2s ease-in-out"}
            >
              <Flex
                width={"full"}
                justifyContent={"space-between"}
                alignItems={"center"}
                py={2}
              >
                <Text
                  variant={"header"}
                  fontSize={{
                    base: "2xl",
                    md: "3xl",
                  }}
                >
                  KrossBooking
                </Text>
                <Button
                  variant={"secondary"}
                  leftIcon={<TbRefresh />}
                  onClick={async () => {
                    // call api src/pages/api/krossbooking/importRoomTypes.ts
                    if (userData) {
                      await mutateImportRoomTypes({
                        user: userData.id,
                      });
                    } else {
                      toast({
                        title: "Errore",
                        description: "Non è stato trovato l'utente",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  Sync
                </Button>
              </Flex>
              <Box w="full">
                <Text variant={"label"}>User</Text>
                <PrimaryInput
                  type={"text"}
                  name={"apiUsr"}
                  placeholder="user_api"
                />
              </Box>
              <Box w="full">
                <Text variant={"label"}>Password</Text>
                <PrimaryInput
                  type={"text"}
                  name={"apiPsw"}
                  placeholder="pwd_api"
                />
              </Box>
              <Button
                variant={"primary"}
                ml={"auto"}
                textTransform={"capitalize"}
                px={6}
                isLoading={isLoadingUpdateKrossBooking}
                onClick={onSubmitUpdateKrossBooking}
              >
                Salva
              </Button>
            </Flex>
          </FormProvider>
          <Button
            variant={"primary"}
            ml={"auto"}
            mr={"auto"}
            textTransform={"capitalize"}
            px={6}
            onClick={async () => {
              await signOut();
              toast({
                title: "Logout",
                description: "Logout effettuato con successo",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            }}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
