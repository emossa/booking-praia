import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type NextPage } from "next";
import { useState, type ReactElement, type ReactNode, useEffect } from "react";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import { Box, ChakraProvider } from "@chakra-ui/react";

import theme from "@/components/theme";
import Footer from "@/components/Footer";
import { FiltersContextProvider } from "@/context/FiltersContext";
import { NextAdapter } from "next-query-params";
import { QueryParamProvider } from "use-query-params";

// expires cookie in 7 days
export const expires = new Date();
expires.setDate(expires.getDate() + 7);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const PraiaDeiBorghiApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
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
    <QueryParamProvider adapter={NextAdapter}>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            containerStyle: {
              fontFamily: "Inter-Regular",
            },
          },
        }}
      >
        <SessionProvider session={session}>
          <FiltersContextProvider>
            <Box
              position={"relative"}
              minH={"100vh"}
              pb={{
                base: marginListingMobile ? "510px" : "430px",
                md: "340px",
              }}
            >
              <Component {...pageProps} />
              <Footer />
            </Box>
          </FiltersContextProvider>
        </SessionProvider>
      </ChakraProvider>
    </QueryParamProvider>
  );
};

export default api.withTRPC(PraiaDeiBorghiApp);
