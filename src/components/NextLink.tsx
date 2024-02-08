import { Link as LinkCh, type LinkProps } from "@chakra-ui/react";
import Link from "next/link";

const NextLink = (props: Exclude<LinkProps, "as">) => {
  return <LinkCh {...props} as={Link} />;
};

export default NextLink;
