import Advertisement from "@/components/cards/advertisement";
import Header from "@/components/headers/Main";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function Favourites() {
  const advs = [
    {
      id: 5,
      title: "Hotel Blu",
      description: "Vicino al mare",
      slides: [
        "/media/test/adv1.webp",
        "/media/test/adv2.webp",
        "/media/test/adv3.webp",
        "/media/test/adv4.webp",
      ],
      price: {
        value: 150,
        sale: 100,
        currency: "EUR",
      },
    },
    {
      id: 6,
      title: "Hotel Marroni",
      description: "Vicino al mare",
      slides: [
        "/media/test/adv2.webp",
        "/media/test/adv1.webp",
        "/media/test/adv3.webp",
        "/media/test/adv4.webp",
      ],
      price: {
        value: 150,
        sale: 100,
        currency: "EUR",
      },
    },
  ];

  return (
    <>
      <Header />
      <Box
        ml={"auto"}
        mr={"auto"}
        maxW={{
          base: "100%",
          md: "6xl",
        }}
        p={{
          base: 5,
          md: 10,
        }}
      >
        <Text
          variant={"header"}
          fontSize={{
            base: "xl",
            md: "2xl",
          }}
          pb={5}
        >
          Preferiti
        </Text>
        <Flex
          justifyContent={{
            base: "center",
            md: "flex-start",
          }}
          flexWrap={"wrap"}
          gap={10}
          p={{
            base: 0,
            md: 0,
          }}
        >
          {advs.map((adv) => {
            return (
              <Advertisement
                key={adv.id}
                id={adv.id}
                title={adv.title}
                description={adv.description}
                slides={adv.slides}
                price={adv.price}
              />
            );
          })}
        </Flex>
      </Box>
    </>
  );
}
