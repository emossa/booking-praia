import { Flex, Text } from "@chakra-ui/react";
import { languages } from "@/context/FiltersContext";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";

export default function LanguageCard(props: {
  code: string;
  closeModal: () => void;
}) {
  const { code, closeModal } = props;

  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    code
  );

  useEffect(() => {
    const languageCookie = getCookie("language");
    setSelectedLanguage(languageCookie);
  }, [code]);

  return (
    <Flex
      w={"fit-content"}
      key={code + "_card"}
      gap={2}
      border={"1px solid"}
      borderColor={
        selectedLanguage === code ? "var(--black-primary)" : "transparent"
      }
      _hover={{
        bg: "var(--light-hover)",
      }}
      transition={"all 0.4s ease-in-out"}
      borderRadius={"lg"}
      p={3}
      alignItems={"center"}
      cursor={"pointer"}
      onClick={() => {
        setSelectedLanguage(code);
        setCookie("language", code, {
          expires: new Date("2100-01-01"),
        });
        closeModal();
      }}
    >
      {languages.find((lang) => lang.code === code)?.flag ? (
        <Image
          src={languages.find((lang) => lang.code === code)?.flag ?? ""}
          alt={languages.find((lang) => lang.code === code)?.name ?? ""}
          width={24}
          height={24}
        />
      ) : null}
      <Text variant="title" fontFamily={"Inter-Regular"}>
        {languages.find((lang) => lang.code === code)?.name ??
          languages[0]?.name}
      </Text>
    </Flex>
  );
}
