import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { setCookie } from "cookies-next";
import { useFiltersContext } from "@/context/FiltersContext";
import { expires } from "@/pages/_app";

const months = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novemebre",
  "Dicembre",
];

const days = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];

const getDaysInMonthOrdered = (month: number, year: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  // Trova il giorno della settimana del primo giorno del mese
  const firstDayOfWeek = days[0]?.getDay() ?? 7;

  //   Aggiungi le celle vuote per portare il primo giorno alla colonna lunedì
  for (let i = 0; i < firstDayOfWeek - 1; i++) {
    days.unshift(null);
  }

  return days;
};

const getNextMonth = () => {
  // Clone the current date to avoid modifying it directly
  const nextMonthDate = new Date();

  // Increment the month by 1
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  // Check if we have overflowed into the next year
  if (nextMonthDate.getMonth() === new Date().getMonth()) {
    // If the month hasn't changed, we were in December, so increment the year as well
    nextMonthDate.setFullYear(nextMonthDate.getFullYear() + 1);
  }

  return nextMonthDate;
};

interface FormControlInputProps {
  nameDate: string;
  nameTime: string;
  label: string;
  showOneCalendar?: boolean;
}

const EventCalendar = (props: FormControlInputProps) => {
  const { label, showOneCalendar } = props;

  const [monthLeft, setMonthLeft] = useState<number>(new Date().getMonth());
  const [yearLeft, setYearLeft] = useState<number>(new Date().getFullYear());

  const [monthRight, setMonthRight] = useState<number>(
    getNextMonth().getMonth()
  );
  const [yearRight, setYearRight] = useState<number>(
    getNextMonth().getFullYear()
  );

  const orderedDaysLeft = getDaysInMonthOrdered(monthLeft, yearLeft);
  const orderedDaysRight = getDaysInMonthOrdered(monthRight, yearRight);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedCheckinDay, setSelectedCheckinDay] = useState<
    Date | undefined
  >(undefined);
  const [selectedCheckoutDay, setSelectedCheckoutDay] = useState<
    Date | undefined
  >(undefined);

  const { checkin, checkout, updateFilters } = useFiltersContext();

  useEffect(() => {
    if (checkin && checkout) {
      setSelectedCheckinDay(new Date(checkin));
      setSelectedCheckoutDay(new Date(checkout));
      if (
        monthLeft === new Date().getMonth() &&
        monthLeft != checkin.getMonth()
      ) {
        setMonthLeft(checkin.getMonth());
        setYearLeft(checkin.getFullYear());

        if (checkin.getMonth() != checkout.getMonth()) {
          setMonthRight(
            checkin.getMonth() + 1 > 11 ? 0 : checkin.getMonth() + 1
          );
          setYearRight(
            checkin.getMonth() + 1 > 11
              ? checkin.getFullYear() + 1
              : checkin.getFullYear()
          );
        } else {
          setMonthRight(
            checkout.getMonth() + 1 > 11 ? 0 : checkout.getMonth() + 1
          );
          setYearRight(
            checkout.getMonth() + 1 > 11
              ? checkout.getFullYear() + 1
              : checkout.getFullYear()
          );
        }
      }
    }
  }, [checkin, checkout, monthLeft, yearLeft]);

  const selectDates = (day: Date) => {
    let checkin = selectedCheckinDay;
    let checkout = selectedCheckoutDay;
    if (checkin && checkout) {
      checkin = day;
      checkout = undefined;
    } else if (checkin && !checkout) {
      if (day.setHours(0, 0, 0, 0) > checkin.setHours(0, 0, 0, 0)) {
        checkout = day;
      } else if (day.setHours(0, 0, 0, 0) === checkin.setHours(0, 0, 0, 0)) {
        checkin = day;
        checkout = undefined;
      } else {
        checkin = day;
        checkout = undefined;
      }
    } else if (!checkin && !checkout) {
      checkin = day;
    }

    if (checkin && checkout) {
      setCookie("checkin", checkin, {
        expires: expires,
      });
      setCookie("checkout", checkout, {
        expires: expires,
      });

      updateFilters({
        checkin: checkin,
        checkout: checkout,
      });
    }

    setSelectedCheckinDay(checkin);
    setSelectedCheckoutDay(checkout);
  };

  const selectionableDayContainer = useColorModeValue(
    "var(--praia-rombo-1-20-1)", //"var(--hover-gray)",
    "var(--dark-hover)"
  );

  const dayBetweenContainer = useColorModeValue(
    "var(--praia-rombo-1-80-1)", // "var(--day-between-calendar)",
    "var(--dark-hover)"
  );

  const selectionableDayTextColor = useColorModeValue(
    "var(--praia-primary)", //"var(--black-primary)",
    "var(--white-primary)"
  );

  const selectedDayContainer = useColorModeValue(
    "var(--praia-primary)", //"var(--dark-bg)",
    "var(--white-primary)"
  );
  const selectedDayTextColor = useColorModeValue(
    "var(--white-primary)",
    "var(--black-primary)"
  );

  const borderDay = useColorModeValue(
    "var(--praia-primary)", // "var(--black-primary)",
    "var(--white-primary)"
  );

  return (
    <Flex flexDirection={"column"} alignItems={"center"} gap={2}>
      <Text fontSize={"xl"} fontWeight={"bold"}>
        {label}
      </Text>
      <Flex
        // maxH={"520px"}
        w={"fit-content"}
        alignItems={"flex-start"}
        flexDirection={{
          base: "column-reverse",
          md: "row",
        }}
        gap={4}
      >
        <Flex
          flexDirection={"column"}
          maxW={"950px"}
          gap={4}
          padding={
            showOneCalendar
              ? 0
              : {
                base: 0,
                md: 5,
              }
          }
        >
          {/* Calendar body */}
          <Flex
            alignItems={"flex-start"}
            gap={10}
            flexDirection={{
              base: "column",
              md: "row",
            }}
          >
            {/* Left month */}
            <Flex flexDirection={"column"} gap={2}>
              <Flex alignItems={"flex-start"} gap={5}>
                <Box>
                  <Flex
                    position={"relative"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={2}
                    mb={8}
                  >
                    <Button
                      position={"absolute"}
                      left={0}
                      p={0}
                      bg={"trasparent"}
                      borderRadius={"full"}
                      _hover={{
                        bg: "#14141410",
                      }}
                      onClick={() => {
                        const date = new Date(yearLeft, monthLeft, 1);
                        if (
                          date.getMonth() === new Date().getMonth() &&
                          date.getFullYear() === new Date().getFullYear()
                        ) {
                          return;
                        }

                        if (monthLeft === 0) {
                          setYearLeft(yearLeft - 1);
                          setMonthLeft(11);
                        } else {
                          setMonthLeft(monthLeft - 1);
                        }

                        if (monthRight === 0) {
                          setYearRight(yearRight - 1);
                          setMonthRight(11);
                        } else {
                          setMonthRight(monthRight - 1);
                        }
                      }}
                    >
                      <FiChevronLeft
                        size={"1.2rem"}
                        color="var(--praia-primary)"
                      />
                    </Button>
                    <Button
                      display={
                        showOneCalendar ? "flex" : { base: "flex", md: "none" }
                      }
                      position={"absolute"}
                      right={0}
                      p={0}
                      bg={"trasparent"}
                      borderRadius={"full"}
                      _hover={{
                        bg: "#14141410",
                      }}
                      onClick={() => {
                        if (monthLeft === 11) {
                          setYearLeft(yearLeft + 1);
                          setMonthLeft(0);
                        } else {
                          setMonthLeft(monthLeft + 1);
                        }

                        if (monthRight === 11) {
                          setYearRight(yearRight + 1);
                          setMonthRight(0);
                        } else {
                          setMonthRight(monthRight + 1);
                        }
                      }}
                    >
                      <FiChevronRight
                        size={"1.2rem"}
                        color="var(--praia-primary)"
                      />
                    </Button>
                    <Flex
                      justifyContent={"center"}
                      alignItems={"center"}
                      gap={2}
                    >
                      <Text
                        fontSize="md"
                        fontFamily={"CalSans-SemiBold"}
                        color="var(--praia-primary)"
                      >
                        {months[monthLeft]}
                      </Text>
                      <Text
                        fontSize="md"
                        fontFamily={"CalSans-SemiBold"}
                        color="var(--praia-primary)"
                      >
                        {yearLeft}
                      </Text>
                    </Flex>
                  </Flex>
                  <Grid
                    templateColumns="repeat(7,minmax(0,1fr))"
                    gap={1}
                    textAlign={"center"}
                    mb={2}
                  >
                    {days.map((dayName, index) => (
                      <GridItem key={index}>
                        <Text
                          fontSize="sm"
                          fontFamily={"CalSans-SemiBold"}
                          color="var(--praia-primary)"
                        >
                          {dayName}
                        </Text>
                      </GridItem>
                    ))}
                  </Grid>
                  <Grid
                    templateColumns="repeat(7,minmax(0,1fr))"
                    gap={1}
                    textAlign={"center"}
                  >
                    {orderedDaysLeft.map((day, index) =>
                      day ? (
                        <GridItem key={index}>
                          <Button
                            w={"full"}
                            minH={{
                              base: "50.14px",
                              sm: "42px",
                              md: "48px",
                            }}
                            cursor={
                              day.setHours(0, 0, 0, 0) <
                                today.setHours(0, 0, 0, 0)
                                ? "default"
                                : "pointer"
                            }
                            disabled={
                              day.setHours(0, 0, 0, 0) <
                                today.setHours(0, 0, 0, 0)
                                ? true
                                : false
                            }
                            bg={
                              day.setHours(0, 0, 0, 0) ===
                                selectedCheckinDay?.setHours(0, 0, 0, 0) ||
                                day.setHours(0, 0, 0, 0) ===
                                selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                ? selectedDayContainer
                                : day.setHours(0, 0, 0, 0) <
                                  today.setHours(0, 0, 0, 0)
                                  ? "transparent"
                                  : selectedCheckinDay &&
                                    selectedCheckoutDay &&
                                    day.setHours(0, 0, 0, 0) >
                                    selectedCheckinDay?.setHours(0, 0, 0, 0) &&
                                    day.setHours(0, 0, 0, 0) <
                                    selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                    ? dayBetweenContainer
                                    : selectionableDayContainer
                            }
                            border={"2px solid"}
                            borderColor={
                              day.setHours(0, 0, 0, 0) <
                                today.setHours(0, 0, 0, 0)
                                ? "transparent"
                                : day.setHours(0, 0, 0, 0) ===
                                  selectedCheckinDay?.setHours(0, 0, 0, 0) ||
                                  day.setHours(0, 0, 0, 0) ===
                                  selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                  ? borderDay
                                  : selectedCheckinDay &&
                                    selectedCheckoutDay &&
                                    day.setHours(0, 0, 0, 0) >
                                    selectedCheckinDay?.setHours(0, 0, 0, 0) &&
                                    day.setHours(0, 0, 0, 0) <
                                    selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                    ? dayBetweenContainer
                                    : selectionableDayContainer
                            }
                            opacity={
                              day.setHours(0, 0, 0, 0) ===
                                selectedCheckinDay?.setHours(0, 0, 0, 0) ||
                                day.setHours(0, 0, 0, 0) ===
                                selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                ? 1
                                : day.setHours(0, 0, 0, 0) <
                                  today.setHours(0, 0, 0, 0)
                                  ? 0.2
                                  : 1
                            }
                            color={
                              day.setHours(0, 0, 0, 0) ===
                                selectedCheckinDay?.setHours(0, 0, 0, 0) ||
                                day.setHours(0, 0, 0, 0) ===
                                selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                ? selectedDayTextColor
                                : selectionableDayTextColor
                            }
                            _hover={{
                              borderColor:
                                day.setHours(0, 0, 0, 0) <
                                  today.setHours(0, 0, 0, 0)
                                  ? "transparent"
                                  : borderDay,
                            }}
                            _active={{
                              bg: "unset",
                            }}
                            _after={{
                              content: '"•"',
                              fontSize: "xs",
                              position: "absolute",
                              bottom: "0",
                              visibility:
                                day.setHours(0, 0, 0, 0) ===
                                  today.setHours(0, 0, 0, 0)
                                  ? "visible"
                                  : "hidden",
                            }}
                            onClick={() => {
                              if (
                                day.setHours(0, 0, 0, 0) <
                                today.setHours(0, 0, 0, 0)
                              )
                                return;
                              selectDates(day);
                              // setValue("date", day);
                            }}
                          >
                            {day ? day.getDate() : ""}
                          </Button>
                        </GridItem>
                      ) : (
                        <GridItem key={index}></GridItem>
                      )
                    )}
                  </Grid>
                </Box>
              </Flex>
            </Flex>
            {/* Right month */}
            <Flex
              flexDirection={"column"}
              gap={2}
              display={showOneCalendar ? "none" : { base: "none", md: "flex" }}
            >
              <Flex alignItems={"flex-start"} gap={5}>
                <Box>
                  <Flex
                    position={"relative"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={2}
                    mb={8}
                  >
                    <Button
                      position={"absolute"}
                      right={0}
                      p={0}
                      bg={"trasparent"}
                      borderRadius={"full"}
                      _hover={{
                        bg: "#14141410",
                      }}
                      onClick={() => {
                        if (monthLeft === 11) {
                          setYearLeft(yearLeft + 1);
                          setMonthLeft(0);
                        } else {
                          setMonthLeft(monthLeft + 1);
                        }

                        if (monthRight === 11) {
                          setYearRight(yearRight + 1);
                          setMonthRight(0);
                        } else {
                          setMonthRight(monthRight + 1);
                        }
                      }}
                    >
                      <FiChevronRight
                        size={"1.2rem"}
                        color="var(--praia-primary)"
                      />
                    </Button>
                    <Text
                      fontSize="md"
                      fontFamily={"CalSans-SemiBold"}
                      color="var(--praia-primary)"
                    >
                      {months[monthRight]}
                    </Text>
                    <Text
                      fontSize="md"
                      fontFamily={"CalSans-SemiBold"}
                      color="var(--praia-primary)"
                    >
                      {yearRight}
                    </Text>
                  </Flex>
                  <Grid
                    templateColumns="repeat(7,minmax(0,1fr))"
                    textAlign={"center"}
                    gap={1}
                    mb={2}
                  >
                    {days.map((dayName, index) => (
                      <GridItem key={index}>
                        <Text
                          fontSize="sm"
                          fontFamily={"CalSans-SemiBold"}
                          color="var(--praia-primary)"
                        >
                          {dayName}
                        </Text>
                      </GridItem>
                    ))}
                  </Grid>
                  <Grid
                    templateColumns="repeat(7,minmax(0,1fr))"
                    gap={1}
                    textAlign={"center"}
                  >
                    {orderedDaysRight.map((day, index) =>
                      day ? (
                        <GridItem key={index}>
                          <Button
                            w={"full"}
                            minH={{
                              base: "50.14px",
                              sm: "42px",
                              md: "48px",
                            }}
                            cursor={
                              day.setHours(0, 0, 0, 0) <
                                today.setHours(0, 0, 0, 0)
                                ? "default"
                                : "pointer"
                            }
                            disabled={
                              day.setHours(0, 0, 0, 0) <
                                today.setHours(0, 0, 0, 0)
                                ? true
                                : false
                            }
                            bg={
                              day.setHours(0, 0, 0, 0) ===
                                selectedCheckinDay?.setHours(0, 0, 0, 0) ||
                                day.setHours(0, 0, 0, 0) ===
                                selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                ? selectedDayContainer
                                : day.setHours(0, 0, 0, 0) <
                                  today.setHours(0, 0, 0, 0)
                                  ? "transparent"
                                  : selectedCheckinDay &&
                                    selectedCheckoutDay &&
                                    day.setHours(0, 0, 0, 0) >
                                    selectedCheckinDay?.setHours(0, 0, 0, 0) &&
                                    day.setHours(0, 0, 0, 0) <
                                    selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                    ? dayBetweenContainer
                                    : selectionableDayContainer
                            }
                            border={"2px solid"}
                            borderColor={
                              day.setHours(0, 0, 0, 0) <
                                today.setHours(0, 0, 0, 0)
                                ? "transparent"
                                : day.setHours(0, 0, 0, 0) ===
                                  selectedCheckinDay?.setHours(0, 0, 0, 0) ||
                                  day.setHours(0, 0, 0, 0) ===
                                  selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                  ? borderDay
                                  : selectedCheckinDay &&
                                    selectedCheckoutDay &&
                                    day.setHours(0, 0, 0, 0) >
                                    selectedCheckinDay?.setHours(0, 0, 0, 0) &&
                                    day.setHours(0, 0, 0, 0) <
                                    selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                    ? dayBetweenContainer
                                    : selectionableDayContainer
                            }
                            opacity={
                              day.setHours(0, 0, 0, 0) ===
                                selectedCheckinDay?.setHours(0, 0, 0, 0) ||
                                day.setHours(0, 0, 0, 0) ===
                                selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                ? 1
                                : day.setHours(0, 0, 0, 0) <
                                  today.setHours(0, 0, 0, 0)
                                  ? 0.2
                                  : 1
                            }
                            color={
                              day.setHours(0, 0, 0, 0) ===
                                selectedCheckinDay?.setHours(0, 0, 0, 0) ||
                                day.setHours(0, 0, 0, 0) ===
                                selectedCheckoutDay?.setHours(0, 0, 0, 0)
                                ? selectedDayTextColor
                                : selectionableDayTextColor
                            }
                            _hover={{
                              borderColor:
                                day.setHours(0, 0, 0, 0) <
                                  today.setHours(0, 0, 0, 0)
                                  ? "transparent"
                                  : borderDay,
                            }}
                            _active={{
                              bg: "unset",
                            }}
                            _after={{
                              content: '"•"',
                              fontSize: "xs",
                              position: "absolute",
                              bottom: "0",
                              visibility:
                                day.setHours(0, 0, 0, 0) ===
                                  today.setHours(0, 0, 0, 0)
                                  ? "visible"
                                  : "hidden",
                            }}
                            onClick={() => {
                              if (
                                day.setHours(0, 0, 0, 0) <
                                today.setHours(0, 0, 0, 0)
                              )
                                return;
                              selectDates(day);
                              // setValue("date", day);
                            }}
                          >
                            {day ? day.getDate() : ""}
                          </Button>
                        </GridItem>
                      ) : (
                        <GridItem key={index}></GridItem>
                      )
                    )}
                  </Grid>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EventCalendar;
