import { Box, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAccountLayoutStore } from "./store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AccountLayout: React.FC<{ children: React.ReactNode; roles: '' }> = ({
  children,
  roles,
}) => {
  const { data } = useSession({ required: true });
  const isLoading = useAccountLayoutStore((state: any) => state.isLoading);
  const router = useRouter();

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (data?.user && !roles.includes(data?.user?.role)) {
      router.push("/");
    }

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data, roles, router]);

  const isMobile = width < 768;

  return (
    <main className="flex justify-between">
      {isLoading && (
        <Box
          position={"fixed"}
          top={0}
          width="full"
          height="full"
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          zIndex={2}
        >
          <Spinner size="xl" />
        </Box>
      )}
      {children}
    </main>
  );
};

export default AccountLayout;
