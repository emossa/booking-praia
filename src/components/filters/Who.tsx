import { expires } from "@/pages/_app";
import { useFiltersContext } from "@/context/FiltersContext";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function Who() {
  const rowStyle = {
    p: {
      base: 2,
      md: 5,
    },
    borderBottom: "1px solid var(--hover-gray)",
    justifyContent: "space-between",
    alignItems: "center",
    minW: {
      base: "100%",
      md: "320px",
    },
  };

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const { chi_adulti, chi_bambini, chi_neonati, chi_pets, updateFilters } =
    useFiltersContext();

  useEffect(() => {
    if (chi_adulti) {
      setAdults(chi_adulti);
    }
    if (chi_bambini) {
      setChildren(chi_bambini);
    }
    if (chi_neonati) {
      setInfants(chi_neonati);
    }
    if (chi_pets) {
      setPets(chi_pets);
    }
  }, [chi_adulti, chi_bambini, chi_neonati, chi_pets]);

  return (
    <Flex flexDirection={"column"}>
      <Flex {...rowStyle}>
        <Box>
          <Text variant={"bold"} color="var(--praia-primary)">
            Adulti
          </Text>
          <Text variant={"label"} color="var(--praia-primary)">
            Da 13 in su
          </Text>
        </Box>
        <Flex alignItems={"center"} gap={4}>
          <Button
            variant={"plusMinus"}
            onClick={() => {
              const adultsValue = adults > 0 ? adults - 1 : 0;
              setAdults(adultsValue);
              updateFilters({ chi_adulti: adultsValue });
              setCookie("chi_adulti", adultsValue, {
                expires: expires,
              });
            }}
          >
            <FiMinus />
          </Button>
          <Text variant={"label"} color="var(--praia-primary)">
            {adults}
          </Text>
          <Button
            variant={"plusMinus"}
            onClick={() => {
              const adultsValue = adults + 1;
              setAdults(adultsValue);
              updateFilters({ chi_adulti: adultsValue });
              setCookie("chi_adulti", adultsValue, {
                expires: expires,
              });
            }}
          >
            <FiPlus />
          </Button>
        </Flex>
      </Flex>
      <Flex {...rowStyle}>
        <Box>
          <Text variant={"bold"} color="var(--praia-primary)">
            Bambini
          </Text>
          <Text variant={"label"} color="var(--praia-primary)">
            Età 2 - 12
          </Text>
        </Box>
        <Flex alignItems={"center"} gap={4}>
          <Button
            variant={"plusMinus"}
            onClick={() => {
              const childrenValue = children > 0 ? children - 1 : 0;
              setChildren(childrenValue);
              updateFilters({
                chi_bambini: childrenValue,
              });
              setCookie("chi_bambini", childrenValue, {
                expires: expires,
              });
            }}
          >
            <FiMinus />
          </Button>
          <Text variant={"label"} color="var(--praia-primary)">
            {children}
          </Text>
          <Button
            variant={"plusMinus"}
            onClick={() => {
              const childrenValue = children + 1;
              setChildren(childrenValue);
              updateFilters({
                chi_bambini: childrenValue,
              });
              setCookie("chi_bambini", childrenValue, {
                expires: expires,
              });
            }}
          >
            <FiPlus />
          </Button>
        </Flex>
      </Flex>
      <Flex {...rowStyle}>
        <Box>
          <Text variant={"bold"} color="var(--praia-primary)">
            Neonati
          </Text>
          <Text variant={"label"} color="var(--praia-primary)">
            Fino a 2 anni
          </Text>
        </Box>
        <Flex alignItems={"center"} gap={4}>
          <Button
            variant={"plusMinus"}
            onClick={() => {
              const infantsValue = infants > 0 ? infants - 1 : 0;
              setInfants(infantsValue);
              updateFilters({
                chi_neonati: infantsValue,
              });
              setCookie("chi_neonati", infantsValue, {
                expires: expires,
              });
            }}
          >
            <FiMinus />
          </Button>
          <Text variant={"label"} color="var(--praia-primary)">
            {infants}
          </Text>
          <Button
            variant={"plusMinus"}
            onClick={() => {
              const infantsValue = infants + 1;
              setInfants(infantsValue);
              updateFilters({
                chi_neonati: infantsValue,
              });
              setCookie("chi_neonati", infantsValue, {
                expires: expires,
              });
            }}
          >
            <FiPlus />
          </Button>
        </Flex>
      </Flex>
      <Flex {...rowStyle} borderBottom={0}>
        <Box>
          <Text variant={"bold"} color="var(--praia-primary)">
            Animali domestici
          </Text>
        </Box>
        <Flex alignItems={"center"} gap={4}>
          <Button
            variant={"plusMinus"}
            onClick={() => {
              const petsValue = pets > 0 ? pets - 1 : 0;
              setPets(petsValue);
              updateFilters({
                chi_pets: petsValue,
              });
              setCookie("chi_pets", petsValue, {
                expires: expires,
              });
            }}
          >
            <FiMinus />
          </Button>
          <Text variant={"label"} color="var(--praia-primary)">
            {pets}
          </Text>
          <Button
            variant={"plusMinus"}
            onClick={() => {
              const petsValue = pets + 1;
              setPets(petsValue);
              updateFilters({
                chi_pets: petsValue,
              });
              setCookie("chi_pets", petsValue, {
                expires: expires,
              });
            }}
          >
            <FiPlus />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
