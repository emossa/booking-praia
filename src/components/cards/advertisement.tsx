import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { PiHeartStraightDuotone } from "react-icons/pi";

export default function Advertisement(props: {
  id: number | string;
  title: string;
  description: string;
  slides: string[];
  price: {
    value: number;
    sale: number;
    currency: string;
  };
}) {
  const { id, title, description, slides, price } = props;

  const currencies = {
    EUR: "€",
    USD: "$",
    GBP: "£",
  } as Record<string, string>;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex
      key={id}
      flexDirection="column"
      gap={3}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      as={"a"}
      href={"/listing/" + id}
    >
      {slides[0] && (
        <Box
          width={{
            base: "320px",
            md: "250px",
          }}
          height={{
            base: "320px",
            md: "250px",
          }}
          borderRadius="1rem"
          overflow="hidden"
          position="relative"
        >
          <Box
            position={"absolute"}
            zIndex={1}
            right={4}
            top={3}
            cursor="pointer"
          >
            <PiHeartStraightDuotone size={"1.5rem"} />
          </Box>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Image
              src={slides[0]}
              alt={title}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              unoptimized={true}
            />
          </motion.div>
        </Box>
      )}
      <Box>
        <Text variant="bold">{title}</Text>
        <Text variant="label">{description}</Text>
        <Flex gap={3} mt={2}>
          <Text variant="bold">
            {price.value} {currencies[price.currency] ?? price.currency}
          </Text>
          <Text variant="label">notte</Text>
        </Flex>
      </Box>
    </Flex>
  );
}
