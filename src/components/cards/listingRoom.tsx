// import { Box, Button, Image, Text } from "@chakra-ui/react";
// import { Flex } from "@chakra-ui/react";
// import { type RoomType } from "@prisma/client";

// import { Navigation } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import checkout from "@/pages/checkout";
// import { type AmenityTranslationsType } from "@/server/types";
// import { TbCheck } from "react-icons/tb";
// import { getRoomTypePrice } from "@/pages/listing/[id]";

// export default function ListingRoomCard({ roomType }: { roomType: RoomType }) {

  
//   return (
//     <Flex
//       flexDirection={"column"}
//       gap={2}
//       border={"1px solid"}
//       borderColor={"inherit"}
//       borderRadius={"xl"}
//       boxShadow={"sm"}
//       p={5}
//     >
//       <Text variant={"header"} fontSize={"lg"}>
//         {roomType.name}
//       </Text>
//       <Flex
//         flexDirection={{
//           base: "column",
//           md: "row",
//         }}
//         gap={{
//           base: 5,
//           md: 10,
//         }}
//       >
//         <Box maxW={"350px"}>
//           <Swiper
//             modules={[Navigation]}
//             navigation
//             loop={true}
//             slidesPerView={1}
//             className="mySwiper"
//           >
//             {roomType.images
//               ? roomType.images.map((image, index) => {
//                   if (image)
//                     return (
//                       <SwiperSlide key={image + "_" + index}>
//                         <Image
//                           src={image}
//                           width={350}
//                           height={150}
//                           alt={image}
//                           style={{
//                             borderRadius: "0.5rem",
//                             overflow: "hidden",
//                             objectFit: "cover",
//                             minHeight: "150px",
//                           }}
//                         />
//                       </SwiperSlide>
//                     );
//                 })
//               : null}
//           </Swiper>
//         </Box>
//         <Box>
//           <Text variant={"header"} fontSize={"lg"}>
//             Servizi
//           </Text>
//           <Flex maxW={"350px"} flexWrap={"wrap"}>
//             {roomType.RoomTypeAmenity.map((amenity, index) => {
//               if (
//                 (amenity.amenity.nameTranslations as AmenityTranslationsType).it
//               )
//                 return (
//                   <Flex
//                     key={roomType.id + "_" + index + "_" + amenity.amenity.id}
//                     mr={2}
//                     gap={1}
//                     alignItems={"center"}
//                   >
//                     <TbCheck color="green" />
//                     <Text fontSize={"sm"}>
//                       {
//                         (
//                           amenity.amenity
//                             .nameTranslations as AmenityTranslationsType
//                         ).it
//                       }
//                     </Text>
//                   </Flex>
//                 );
//             })}
//           </Flex>
//         </Box>
//         <Box>
//           <Text variant={"header"} fontSize={"lg"}>
//             Numero di ospiti
//           </Text>
//           <Text>Min: {roomType.minOccupancy}</Text>
//           <Text>Max: {roomType.maxOccupancy}</Text>
//         </Box>
//         <Box>
//           <Text variant={"header"} fontSize={"lg"}>
//             {`Prezzo per ${night} notti`}
//           </Text>
//           <Text variant={"header"} fontSize={"md"}>
//             {getRoomTypePrice(
//               roomType.RoomTypePricesAvailability.find(
//                 (roomTypePrice) =>
//                   roomTypePrice.dateFrom &&
//                   checkin &&
//                   roomTypePrice.dateFrom <= checkin &&
//                   roomTypePrice.dateTo &&
//                   checkout &&
//                   roomTypePrice.dateTo >= checkout
//               )?.price,
//               night,
//               true
//             )}
//           </Text>
//           <Text fontSize={"sm"} color={"var(--light-border-hover)"}>
//             {getRoomTypePrice(
//               roomType.RoomTypePricesAvailability.find(
//                 (roomTypePrice) =>
//                   roomTypePrice.dateFrom &&
//                   checkin &&
//                   roomTypePrice.dateFrom <= checkin &&
//                   roomTypePrice.dateTo &&
//                   checkout &&
//                   roomTypePrice.dateTo >= checkout
//               )?.price,
//               night,
//               true,
//               true
//             )}
//           </Text>
//         </Box>
//         <Box mt={"auto"} ml={"auto"}>
//           <Button
//             textTransform={"capitalize"}
//             variant={
//               Number(
//                 getRoomTypePrice(
//                   roomType.RoomTypePricesAvailability.find(
//                     (roomTypePrice) =>
//                       roomTypePrice.dateFrom &&
//                       checkin &&
//                       roomTypePrice.dateFrom <= checkin &&
//                       roomTypePrice.dateTo &&
//                       checkout &&
//                       roomTypePrice.dateTo >= checkout
//                   )?.price,
//                   night
//                 )
//               ) > 0
//                 ? "primary"
//                 : "notAvailable"
//             }
//             onClick={() => {
//               if (
//                 Number(
//                   getRoomTypePrice(
//                     roomType.RoomTypePricesAvailability.find(
//                       (roomTypePrice) =>
//                         roomTypePrice.dateFrom &&
//                         checkin &&
//                         roomTypePrice.dateFrom <= checkin &&
//                         roomTypePrice.dateTo &&
//                         checkout &&
//                         roomTypePrice.dateTo >= checkout
//                     )?.price,
//                     night
//                   )
//                 ) > 0
//               ) {
//                 if (roomType.name) {
//                   setValue("roomName", roomType.name);
//                   setLabelChoosenPrice(
//                     getRoomTypePrice(
//                       roomType.RoomTypePricesAvailability.find(
//                         (roomTypePrice) =>
//                           roomTypePrice.dateFrom &&
//                           checkin &&
//                           roomTypePrice.dateFrom <= checkin &&
//                           roomTypePrice.dateTo &&
//                           checkout &&
//                           roomTypePrice.dateTo >= checkout
//                       )?.price,
//                       night,
//                       false,
//                       true
//                     ).toString()
//                   );
//                   onCloseRoom();
//                 }
//               } else {
//                 console.log("Non disponibile");
//               }
//             }}
//           >
//             {Number(
//               getRoomTypePrice(
//                 roomType.RoomTypePricesAvailability.find(
//                   (roomTypePrice) =>
//                     roomTypePrice.dateFrom &&
//                     checkin &&
//                     roomTypePrice.dateFrom <= checkin &&
//                     roomTypePrice.dateTo &&
//                     checkout &&
//                     roomTypePrice.dateTo >= checkout
//                 )?.price,
//                 night
//               )
//             ) > 0
//               ? "Seleziona"
//               : "Non disponibile"}
//           </Button>
//         </Box>
//       </Flex>
//     </Flex>
//   );
// }
