import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [email, setEmail] = useState("");

  // check if user is already logged in and redirect to dashboard
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    void router.push("/");
  }

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      bg={"var(--hover-gray)"}
      gap={10}
      padding={3}
      h={"100vh"}
    >
      <Text
        fontFamily={"CalSans-SemiBold"}
        fontSize={{
          base: "2xl",
          md: "4xl",
        }}
      >
        Bentornato
      </Text>
      <Flex
        flexDirection={"column"}
        align={"center"}
        justify={"center"}
        bg={"var(--white-primary)"}
        borderRadius={"lg"}
      >
        <Flex
          flexDirection={"column"}
          w={{
            base: "full",
            md: "lg",
            xl: "xl",
          }}
          p={10}
          gap={4}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Box>
            <Text
              mb={1}
              fontSize={{
                base: "lg",
                md: "md",
              }}
              fontWeight={"500"}
            >
              Indirizzo email
            </Text>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              size={"lg"}
              fontFamily={"Inter-Regular"}
              border={"1px solid"}
              borderColor={"#e4e4e4"}
              _focus={{
                borderColor: "var(--black-primary)",
                boxShadow: "0 0 0 1px var(--black-primary)",
              }}
            />
          </Box>
          <Button
            variant={"primary"}
            onClick={() => email != "" && signIn("email", { email: email })}
          >
            Accedi
          </Button>
        </Flex>
      </Flex>
    </Flex>
    // <form method="post" action="/api/auth/signin/email">
    //   <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
    //   <label>
    //     Email address
    //     <input type="email" id="email" name="email" />
    //   </label>
    //   <button type="submit">Sign in with Email</button>

    //   <Button
    //     colorScheme="teal"
    //     size="sm"
    //     onClick={() => signIn("email", { email: "barrel.francesco@gmail.com" })}
    //   >
    //     Button
    //   </Button>
    // </form>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
}
