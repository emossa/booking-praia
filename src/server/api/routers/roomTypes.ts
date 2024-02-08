import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getAuthToken } from "@/server/utils";
import {
  type GetPricesNAvailability,
  type GetListings,
  type GetRoomTypes,
} from "@/server/types";

export const roomTypesRouter = createTRPCRouter({
  importRoomTypes: protectedProcedure
    .input(z.object({ user: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = input;
      try {
        // const authToken = await getAuthToken(user, ctx.db);
        // console.log("@@user authToken", authToken);

        await ctx.db.roomTypePricesAvailability.deleteMany({
          where: {
            roomType: {
              Property: {
                merchantId: user,
              },
            },
          },
        });

        await ctx.db.roomTypeAmenity.deleteMany({
          where: {
            roomType: {
              Property: {
                merchantId: user,
              },
            },
          },
        });

        await ctx.db.roomType.deleteMany({
          where: {
            Property: {
              merchantId: user,
            },
          },
        });

        await ctx.db.property.deleteMany({
          where: {
            merchantId: user,
          },
        });

        // #### INIT - get property info ####
        // const responseGetListings = await fetch(
        //   "https://api.krossbooking.com/v5/otas/get-listings",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${authToken.token}`,
        //     },
        //     body: JSON.stringify({
        //       with_images: true,
        //     }),
        //   }
        // );
        // const jsonProperyFromListing =
        //   (await responseGetListings.json()) as GetListings;
        // console.log("@@jsonProperyFromListing", jsonProperyFromListing);
        const jsonProperyFromListing = {
          data: [
            {
              id_ota_property: 1,
              name_property: "Hotel Praia Magica Esempio",
              address: "Via Fratelli Cervi, 27, 87028 Praia a Mare CS",
              city: "Praia a mare",
              area: "Cosenza",
              post_code: "87029",
              country: "IT",
              latitude: 39.911162,
              longitude: 15.769622,
              id_room_type: 1,
              name_room_type: "Camera matrimoniale",
            },
            {
              id_ota_property: 1,
              name_property: "Hotel Praia Magica Esempio",
              address: "Via Fratelli Cervi, 27, 87028 Praia a Mare CS",
              city: "Praia a mare",
              area: "Cosenza",
              post_code: "87029",
              country: "IT",
              latitude: 39.911162,
              longitude: 15.769622,
              id_room_type: 2,
              name_room_type: "Camera Quadrupla con Balcone",
            },
            {
              id_ota_property: 1,
              name_property: "Hotel Praia Magica Esempio",
              address: "Via Fratelli Cervi, 27, 87028 Praia a Mare CS",
              city: "Praia a mare",
              area: "Cosenza",
              post_code: "87029",
              country: "IT",
              latitude: 39.911162,
              longitude: 15.769622,
              id_room_type: 3,
              name_room_type: "Camera Matrimoniale Deluxe con Balcone",
            },
          ],
          total_count: 3,
          count: 3,
          limit: 100,
          offset: 0,
          ruid: "OUR5NW9DTGUwcmQzRW8vQmRsUGVPQT09OjpKSf3IbsJhfxHTfRezWTm/",
        } as GetListings;

        // populate property table with data from get-listings
        const propertyData = jsonProperyFromListing.data
          .filter(
            (thing, index, self) =>
              index ===
              self.findIndex((t) => t.id_ota_property === thing.id_ota_property)
          )
          .map((property) => {
            return {
              propertyCode: property.id_ota_property,
              name: property.name_property,
              address: property.address,
              city: property.city,
              area: property.area,
              postCode: property.post_code,
              codCountry: property.country,
              latitude: property.latitude,
              longitude: property.longitude,
              merchantId: user,
              typeId: 1, // TODO: automatically create property type
            };
          });

        await ctx.db.property.createMany({
          data: propertyData.map((property) => ({
            ...property,
          })),
        });
        const properies = await ctx.db.property.findMany({
          where: {
            merchantId: user,
          },
        });
        // console.log("@@properies", properies);
        // #### END - get property info ####

        // #### INIT - get room types ####
        // const responseRoomType = await fetch(
        //   "https://api.krossbooking.com/v5/rooms/get-room-types",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${authToken.token}`,
        //     },
        //     body: JSON.stringify({
        //       with_images: true,
        //       with_be_info: true,
        //       with_mandatory_services: true,
        //       with_additional_info: true,
        //       with_account_manager: true,
        //       with_custom_fields: true,
        //       with_bed_bath_details: true,
        //       with_amenities: true,
        //     }),
        //   }
        // );
        // const jsonRoomTypes = (await responseRoomType.json()) as GetRoomTypes;
        // console.log("@@jsonRoomTypes", jsonRoomTypes);

        const jsonRoomTypes = {
          data: [
            {
              id_property: 1,
              id_room_type: 4,
              name_room_type: "Camera bella",
              address: "via turati 1",
              city: "tortora",
              post_code: "87020",
              cod_country: "IT",
              qt_guests: 4,
              min_occupancy: 2,
              max_occupancy: 5,
              date_creation: "2024-01-29 16:37:16",
              size_sqm: 50,
              floor: 2,
              n_bedrooms: 1,
              hide_be: false,
              number_of_bedrooms: 1,
              number_of_bathrooms: 1,
              non_smoking: false,
              amenities: [
                {
                  cod_amenity: "monument_view",
                  name_amenity: "Monument View",
                  name_amenity_translations: {
                    en: "Monument View",
                    es: "Vistas al monumento",
                    de: "Ansicht des Denkmals",
                    he: "נוף הרים",
                    it: "Vista del monumento",
                    fr: "Vue monument",
                    pt: "Vista do monumento",
                    ru: "Вид на памятник",
                    nl: "Uitzicht op monument/bezienswaardigheid",
                    ro: "Vedere la munte",
                  },
                },
                {
                  cod_amenity: "single_bed",
                  name_amenity: "Single bed",
                  name_amenity_translations: {
                    it: "Letto singolo",
                    en: "Single bed",
                    es: "Cama individual",
                    de: "Einzelbett",
                    fr: "Lit simple",
                    he: "מיטת יחיד",
                    pt: "Cama de solteiro",
                    ru: "Односпальная кровать",
                    nl: "Eenpersoonsbed",
                    ro: "Pat de o persoana",
                  },
                },
                {
                  cod_amenity: "mosquito_nets",
                  name_amenity: "Mosquito nets in living area",
                  name_amenity_translations: {
                    it: "Zanzariere zona giorno",
                    en: "Mosquito nets in living area",
                    nl: "Muskietennetten in leefruimte",
                    es: "Mosquitera en sala de estar",
                    ro: "Plase de țânțari in living",
                  },
                },
                {
                  cod_amenity: "sofa_bed",
                  name_amenity: "Sofa",
                  name_amenity_translations: {
                    de: "Sofa",
                    fr: "Canapé",
                    he: "ספה נפתחת",
                    it: "Divano",
                    en: "Sofa",
                    es: "Sofá",
                    pt: "Sofá",
                    ru: "Диван",
                    nl: "Slaapbank",
                    gr: "καναπές",
                    ro: "Canapea",
                  },
                },
                {
                  cod_amenity: "pets_allowed",
                  name_amenity: "Pets on request",
                  name_amenity_translations: {
                    it: "Animali su richiesta",
                    en: "Pets on request",
                    nl: "Huisdieren toegestaan op aanvraag",
                    es: "Aniamles bajo petición",
                    ro: "Animale de companie la cerere",
                  },
                },
                {
                  cod_amenity: "pets_allowed",
                  name_amenity: "Small pets",
                  name_amenity_translations: {
                    it: "Animali taglia piccola",
                    en: "Small pets",
                    nl: "Kleine huisdieren toegestaan",
                    es: "Mascotas pequeñas",
                    ro: "Animale de companie de talie mică",
                  },
                },
                {
                  cod_amenity: "home_step_free_access",
                  name_amenity: "Home Step Free Access",
                  name_amenity_translations: {
                    es: "Entrada libre de impedimentos",
                    de: "Barrierefreier Zugang",
                    he: "כניסה ללא מדרגות",
                    it: "Ingresso libero da impedimenti",
                    en: "Home Step Free Access",
                    fr: "Entrée sans obstacle",
                    pt: "Entrada livre de impedimentos",
                    ru: "",
                    nl: "Toegang zonder drempels tot huis",
                    ro: "Intrare în casă gratuită",
                  },
                },
                {
                  cod_amenity: "separate_modem_line_available",
                  name_amenity: "Separate modem line available",
                  name_amenity_translations: {
                    it: "Linea modem separata",
                    en: "Separate modem line available",
                    es: "Línea de módem separada",
                    de: "Separate Modemleitung",
                    he: "קו מודם נפרד זמין",
                    fr: "Ligne modem séparée",
                    pt: "Linha de modem separada",
                    ru: "Доступна отдельная модемная линия",
                    nl: "Aparte modemlijn beschikbaar",
                    ro: "Linie de modem separată disponibilă",
                  },
                },
                {
                  cod_amenity: "hairdryer",
                  name_amenity: "Hairdryer",
                  name_amenity_translations: {
                    it: "Phon",
                    en: "Hairdryer",
                    es: "Secador de pelo",
                    de: "Phon",
                    he: "מייבש שיער",
                    fr: "Sèche-cheveux",
                    pt: "Secador de cabelo",
                    ru: "Фен",
                    nl: "Haardroger",
                    ro: "Uscător de păr",
                  },
                },
                {
                  cod_amenity: "collect_calls",
                  name_amenity: "Collect calls",
                  name_amenity_translations: {
                    it: "Collect calls",
                    en: "Collect calls",
                    es: "Collect calls",
                    de: "Collect calls",
                    fr: "Appels en PCV",
                    he: "איסוף שיחות",
                    pt: "Collect calls",
                    ru: "",
                    nl: "Incassogesprekken",
                    ro: "Apeluri colectate",
                  },
                },
                {
                  cod_amenity: "ceiling_hoist",
                  name_amenity: "Ceiling Hoist",
                  name_amenity_translations: {
                    it: "Braccio disabili da soffitto",
                    es: "Grúa de techo",
                    de: "Unterstützung an der Decke für Behinderte",
                    he: "מנף תקרה",
                    en: "Ceiling Hoist",
                    fr: "Palan plafond",
                    pt: "Alça de apoio no teto",
                    nl: "Plafondlift",
                    ro: "Palan de tavan",
                  },
                },
                {
                  cod_amenity: "towels",
                  name_amenity: "Towels",
                  name_amenity_translations: {
                    en: "Towels",
                    es: "Toallas",
                    de: "Handtücher",
                    he: "מגבות",
                    fr: "Serviettes de toilette",
                    pt: "Toalhas",
                    ru: "Полотенца",
                    nl: "Handdoeken",
                    it: "Asciugamani",
                    ro: "Prosoape",
                  },
                },
                {
                  cod_amenity: "limited_accessibility",
                  name_amenity: "Limited Accessibility",
                  name_amenity_translations: {
                    es: "Accesibilidad limitada para discapacitados",
                    de: "Eingeschränkter Zugang für Rollstuhlfahrer",
                    he: "גישה מוגבלת",
                    it: "Accessibilità limitata ai disabili",
                    en: "Limited Accessibility",
                    fr: "Accès limité pour les PMR",
                    pt: "Acessibilidade limitada a deficientes",
                    ru: "Ограниченная доступность",
                    nl: "Beperkte toegankelijkheid",
                    ro: "Accesibilitate limitată",
                  },
                },
                {
                  cod_amenity: "separate_toilet_area",
                  name_amenity: "Separate toilet area",
                  name_amenity_translations: {
                    it: "Area toilet separata",
                    en: "Separate toilet area",
                    es: "Área de baño separada",
                    de: "Separater Toilettenbereich",
                    he: "אזור שירותים נפרד",
                    fr: "Salle de bain séparée",
                    pt: "WC separado",
                    ru: "Отдельный санузел",
                    nl: "Apart toiletgebied",
                    ro: "Zonă de toaletă separată",
                  },
                },
                {
                  cod_amenity: "smoking",
                  name_amenity: "Smoking",
                  name_amenity_translations: {
                    it: "Area fumatori",
                    en: "Smoking",
                    es: "Área fumadores",
                    de: "Raucherbereich",
                    fr: "Zone fumeurs",
                    he: "עישון",
                    pt: "Área de fumantes",
                    ru: "Курящий",
                    nl: "\tRoken toegestaan",
                    gr: "κάπνισμα",
                    ro: "Fumat",
                  },
                },
                {
                  cod_amenity: "nude_beach",
                  name_amenity: "Nude Beach",
                  name_amenity_translations: {
                    it: "Spiaggia nudista",
                    en: "Nude Beach",
                    es: "Playa nudista",
                    de: "FKK-Strand",
                    he: "חוף נודיסטים",
                    fr: "Plage nudiste",
                    pt: "Praia de nudismo",
                    ru: "Нудистский пляж",
                    nl: "Naaktstrand",
                    ro: "Plajă de nudiști",
                  },
                },
                {
                  cod_amenity: "live_theater",
                  name_amenity: "Live Theater",
                  name_amenity_translations: {
                    it: "Teatro dal vivo",
                    en: "Live Theater",
                    es: "Teatro en vivo",
                    de: "Live-Theater",
                    he: "תיאטרון חי",
                    fr: "Théâtre",
                    pt: "Teatro ao vivo",
                    ru: "Живой театр",
                    nl: "Theater",
                    ro: "Teatru live",
                  },
                },
                {
                  cod_amenity: "tub",
                  name_amenity: "Tub",
                  name_amenity_translations: {
                    it: "Vasca",
                    en: "Tub",
                    es: "Bañera",
                    de: "Badewanne",
                    he: "אמבטיה",
                    fr: "Baignoire",
                    pt: "Bacia",
                    ru: "Ванна",
                    nl: "\tBad",
                    ro: "Cadă",
                  },
                },
                {
                  cod_amenity: "feather_bed",
                  name_amenity: "Feather bed",
                  name_amenity_translations: {
                    it: "Letto in piuma",
                    en: "Feather bed",
                    es: "Cama en plumas",
                    de: "Federbett",
                    fr: "Lit de plume",
                    he: "מיטת נוצות",
                    pt: "Cama de plumas",
                    ru: "Перина",
                    nl: "Verenbed",
                    ro: "Pat cu pene",
                  },
                },
                {
                  cod_amenity: "queen_bed",
                  name_amenity: "Queen bed",
                  name_amenity_translations: {
                    en: "Queen bed",
                    es: "Cama Queen",
                    de: "Queen-Bett",
                    he: "מיטת קווין",
                    it: "Letto queen",
                    fr: "Lit Queen",
                    pt: "Cama queen",
                    ru: "Кровать размера Queen",
                    nl: "Queensize bed",
                    ro: "Pat tip Queen (160x200)",
                  },
                },
                {
                  cod_amenity: "free_parking",
                  name_amenity: "Free Parking",
                  name_amenity_translations: {
                    it: "Parcheggio gratuito",
                    en: "Free Parking",
                    es: "Estacionamiento gratis",
                    de: "Kostenloses Parken",
                    he: "חניה חינם",
                    fr: "Parking gratuit",
                    pt: "Estacionamento grátis",
                    ru: "Бесплатный паркинг",
                    nl: "Gratis parkeren",
                    ro: "Parcare gratuită",
                  },
                },
              ],
              bedroom_details: [
                {
                  type: "BEDROOM",
                  beds: {
                    king_bed: "1",
                    sofa_bed: "1",
                    bunk_bed: "1",
                    toddler_bed: "1",
                  },
                  amenities: [],
                },
              ],
              bathroom_details: [
                {
                  type: "FULL_BATH",
                  amenities: [
                    "AMENITY_BIDET",
                    "AMENITY_COMBO_TUB_SHOWER",
                    "AMENITY_SHOWER",
                    "AMENITY_TOILET",
                  ],
                },
              ],
              images: [
                "https://cdn.krbo.eu/praiaamare/images/3/4/1706543961724.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/4/17065439634870.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/4/17065439658284.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/4/17065439651584.jpg",
              ],
              be_name: {
                df: "Camera bella",
                it: "Camera bella",
                en: "Beautiful room",
                de: "Schönes Zimmer",
                es: "Bonita habitación",
                fr: "Belle chambre",
              },
              be_description: {
                df: "Relax, benessere e tranquillità. Camera accogliente con tutti i servizi di cui necessiti.",
                it: "Relax, benessere e tranquillità. Camera accogliente con tutti i servizi di cui necessiti.",
                en: "Relaxation, well-being and tranquillity. Cosy room with all the amenities you need.",
                de: "Entspannung, Wohlbefinden und Ruhe. Gemütliches Zimmer mit allen Annehmlichkeiten, die Sie brauchen.",
                es: "Relajación, bienestar y tranquilidad. Habitación acogedora con todas las comodidades que necesita.",
                fr: "Détente, bien-être et tranquillité. Chambre confortable avec tout le confort nécessaire. ",
              },
            },
            {
              id_property: 1,
              id_room_type: 5,
              name_room_type: "Camera bellaassai",
              address: "via turati 1",
              city: "tortora",
              post_code: "87020",
              cod_country: "IT",
              qt_guests: 3,
              min_occupancy: 1,
              max_occupancy: 3,
              date_creation: "2024-01-29 16:38:01",
              size_sqm: 35,
              n_bedrooms: 1,
              hide_be: false,
              number_of_bedrooms: 1,
              number_of_bathrooms: 1,
              non_smoking: false,
              amenities: [
                {
                  cod_amenity: "double_beds",
                  name_amenity: "Double beds",
                  name_amenity_translations: {
                    it: "Letti matrimoniali",
                    en: "Double beds",
                    es: "Camas dobles",
                    de: "Doppelbetten",
                    he: "מיטות זוגיות",
                    fr: "Lits doubles",
                    pt: "Cama de casal",
                    ru: "Двуспальная кровать",
                    nl: "Tweepersoonsbedden",
                    ro: "Paturi duble",
                  },
                },
                {
                  cod_amenity: "ceiling_fan",
                  name_amenity: "Ceiling fan",
                  name_amenity_translations: {
                    it: "Ventilatore a soffitto",
                    en: "Ceiling fan",
                    es: "Ventilador de techo",
                    de: "Deckenventilator",
                    fr: "Ventilateur au plafond",
                    he: "מאוורר תקרה",
                    pt: "Ventilador de teto",
                    ru: "Потолочный вентилятор",
                    nl: "Plafondventilator",
                    ro: "Ventilator",
                  },
                },
                {
                  cod_amenity: "mosquito_nets",
                  name_amenity: "Mosquito nets in living area",
                  name_amenity_translations: {
                    it: "Zanzariere zona giorno",
                    en: "Mosquito nets in living area",
                    nl: "Muskietennetten in leefruimte",
                    es: "Mosquitera en sala de estar",
                    ro: "Plase de țânțari in living",
                  },
                },
                {
                  cod_amenity: "ocean_front",
                  name_amenity: "Ocean Front",
                  name_amenity_translations: {
                    en: "Ocean Front",
                    es: "Frente al oceano",
                    de: "Ozeanfront",
                    he: "מול האוקיינוס",
                    it: "Fronte oceano",
                    fr: "Face à l'océan",
                    pt: "Frente mar",
                    ru: "Перед океаном",
                    nl: "Aan de oceaan",
                    ro: "Front la ocean",
                  },
                },
                {
                  cod_amenity: "bathtub",
                  name_amenity: "Bathtub",
                  name_amenity_translations: {
                    it: "Vasca da bagno",
                    en: "Bathtub",
                    es: "Bañera",
                    de: "Badewanne",
                    fr: "Baignoire",
                    he: "אַמבַּטִיָה",
                    pt: "banheira",
                    ru: "Ванна",
                    nl: "Bad",
                    gr: "μπανιέρα",
                    ro: "Cadă",
                  },
                },
                {
                  cod_amenity: "extra_person_charge_for_rollaway_use",
                  name_amenity: "Extra person charge for rollaway use",
                  name_amenity_translations: {
                    it: "Costo extra per letto extra",
                    en: "Extra person charge for rollaway use",
                    es: "Coste adicional para cama adicional",
                    de: "Mehrkosten für Zusatzbett",
                    fr: "Supplément pour lit extra",
                    he: "תשלום עבור אדם נוסף עבור שימוש מתקפל",
                    pt: "Custo extra para cama extra",
                    nl: "Extra kosten persoon bij gebruik uitklapbed",
                    gr: "",
                    ro: "Taxă suplimentară de persoană pentru pat pliabil",
                  },
                },
                {
                  cod_amenity: "restaurants",
                  name_amenity: "Restaurants",
                  name_amenity_translations: {
                    it: "Ristoranti",
                    en: "Restaurants",
                    es: "Restaurantes",
                    de: "Restaurants",
                    he: "מסעדות",
                    fr: "Restaurants",
                    pt: "Restaurante",
                    ru: "Рестораны",
                    nl: "\tRestaurants",
                    ro: "Restaurant",
                  },
                },
                {
                  cod_amenity: "ergonomic_chair",
                  name_amenity: "Ergonomic chair",
                  name_amenity_translations: {
                    it: "Sedia ergonomica",
                    en: "Ergonomic chair",
                    es: "Silla ergonomica",
                    de: "Ergonomischer Stuhl",
                    he: "כסא ארגונומי",
                    fr: "Chaise ergonomique",
                    pt: "Cadeira ergonômica",
                    ru: "Эргономичный стул",
                    nl: "Ergonomische stoel",
                    ro: "Scaun ergonomic",
                  },
                },
                {
                  cod_amenity: "rural",
                  name_amenity: "Rural",
                  name_amenity_translations: {
                    en: "Rural",
                    es: "Rural",
                    de: "Ländlich",
                    he: "עירוני",
                    it: "Rurale",
                    fr: "Rural",
                    pt: "Rural",
                    ru: "Деревенский",
                    nl: "Landelijk",
                    ro: "Rural",
                  },
                },
                {
                  cod_amenity: "bathrobe",
                  name_amenity: "Bathrobe",
                  name_amenity_translations: {
                    it: "Accappatoio",
                    en: "Bathrobe",
                    es: "Albornoz",
                    de: "Bademantel",
                    fr: "Peignoir",
                    he: "חלוק רחצה",
                    pt: "Roupão de banho\n",
                    ru: "Халат",
                    nl: "Badjas",
                    gr: "Μουρνούζι",
                    ro: "Halat de baie",
                  },
                },
                {
                  cod_amenity: "elevator",
                  name_amenity: "Elevator",
                  name_amenity_translations: {
                    en: "Elevator",
                    es: "Ascensor",
                    de: "Aufzug",
                    he: "מַעֲלִית",
                    it: "Ascensore",
                    fr: "Ascenseur",
                    pt: "Elevador",
                    ru: "Лифт",
                    nl: "Lift",
                    ro: "Lift",
                  },
                },
                {
                  cod_amenity: "foam_pillows",
                  name_amenity: "Foam pillows",
                  name_amenity_translations: {
                    it: "Cuscini in schiuma",
                    en: "Foam pillows",
                    es: "Almohadas de espuma",
                    de: "Schaumstoff-Kissen",
                    fr: "Coussins en mousse",
                    he: "כריות קצף",
                    pt: "Almofadas de espuma",
                    ru: "Подушки с памятью",
                    nl: "Kussens van schuim",
                    ro: "Pernă cu memorie",
                  },
                },
                {
                  cod_amenity: "adaptor_available_for_telephone_pc_use",
                  name_amenity: "Adaptor available for telephone PC use",
                  name_amenity_translations: {
                    it: "Adattatori per telefono",
                    en: "Adaptor available for telephone PC use",
                    es: "Adaptador para móvil",
                    de: "Telefon-Adapter",
                    fr: "Adaptateur pour téléphone",
                    he: "מתאם זמין לשימוש במחשב טלפוני",
                    pt: "Adaptadores para telefone",
                    ru: "",
                    nl: "Adapter beschikbaar voor telefonie PC gebruik",
                    ro: "Adaptor disponibil pentru utilizarea telefonului PC",
                  },
                },
                {
                  cod_amenity: "tub_with_shower_bench",
                  name_amenity: "Tub With Shower Bench",
                  name_amenity_translations: {
                    it: "Vasca da bagno con panca",
                    en: "Tub With Shower Bench",
                    es: "Bañera con banco",
                    de: "Badewanne mit Sitzbank",
                    he: "אמבטיה עם ספסל מקלחת",
                    fr: "Baignoire avec banc",
                    pt: "banheira com bancada",
                    ru: "Ванна с душевой скамейкой",
                    nl: "Badkuip met douchebank",
                    ro: "Cadă cu bancă de duș",
                  },
                },
                {
                  cod_amenity: "handheld_shower_head",
                  name_amenity: "Handheld Shower Head",
                  name_amenity_translations: {
                    it: "Soffione doccia accessibile",
                    en: "Handheld Shower Head",
                    es: "Grifo ducha accesible",
                    de: "Zugänglicher Duschkopf",
                    he: "ראש מקלחת כף יד",
                    fr: "Pommeau de douche PMR",
                    pt: "Chuveiro acessível",
                    ru: "Ручная насадка для душа",
                    nl: "Handdouche",
                    ro: "Cap de dus portabil",
                  },
                },
                {
                  cod_amenity: "oversized_bathtub",
                  name_amenity: "Oversized bathtub",
                  name_amenity_translations: {
                    it: "Vasca da bagno grande",
                    en: "Oversized bathtub",
                    es: "Bañera grande",
                    de: "Große Badewanne",
                    fr: "Grande baignoire",
                    he: "אמבטיה גדולה במיוחד",
                    pt: "Banheira grande",
                    ru: "Большая ванна",
                    nl: "Overmaats bad",
                    ro: "Cadă supradimensionată",
                  },
                },
                {
                  cod_amenity: "synagogues",
                  name_amenity: "Synagogues",
                  name_amenity_translations: {
                    en: "Synagogues",
                    es: "Sinagogas",
                    de: "Synagogen",
                    he: "בתי כנסת",
                    it: "Sinagoghe",
                    fr: "Sinagogues",
                    pt: "Sinagoga",
                    ru: "Синагога",
                    nl: "Synagogen",
                    ro: "Sinagogi",
                  },
                },
                {
                  cod_amenity: "free_newspaper",
                  name_amenity: "Free newspaper",
                  name_amenity_translations: {
                    it: "Giornali gratuiti",
                    en: "Free newspaper",
                    es: "Periódicos gratuitos",
                    de: "Kostenlose Zeitungen",
                    fr: "Journaux gratuits",
                    he: "עיתון חינם",
                    pt: "Jornais gratuitos",
                    ru: "Бесплатная пресса",
                    nl: "Gratis krant",
                    ro: "Ziar gratuit",
                  },
                },
              ],
              bedroom_details: [
                {
                  type: "BEDROOM",
                  beds: {
                    king_bed: "1",
                    single_bed: "2",
                    toddler_bed: "1",
                    floor_mattress: "1",
                  },
                  amenities: {
                    en_suite_bathroom: "2",
                  },
                },
              ],
              bathroom_details: [
                {
                  type: "FULL_BATH",
                  amenities: [
                    "AMENITY_COMBO_TUB_SHOWER",
                    "AMENITY_TUB",
                    "AMENITY_TOILET",
                    "AMENITY_JETTED_TUB",
                  ],
                },
              ],
              images: [
                "https://cdn.krbo.eu/praiaamare/images/3/5/17065438943285.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/5/17065438957743.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/5/17065438975279.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/5/17065438988699.jpg",
              ],
              be_name: {
                df: "Peppe Test",
                it: null,
                en: null,
                de: null,
                es: null,
                fr: null,
              },
              be_description: {
                df: null,
                it: null,
                en: null,
                de: null,
                es: null,
                fr: null,
              },
            },
            {
              id_property: 1,
              id_room_type: 1,
              name_room_type: "Camera matrimoniale",
              address: "Via Fratelli Cervi, 27, 87028 Praia a Mare CS",
              city: "Praia a mare",
              area: "Cosenza",
              post_code: "87029",
              cod_country: "IT",
              qt_guests: 2,
              min_occupancy: 1,
              max_occupancy: 2,
              date_creation: "2024-01-17 12:17:14",
              n_bedrooms: 1,
              hide_be: false,
              number_of_bedrooms: 1,
              number_of_bathrooms: 1,
              non_smoking: false,
              amenities: [
                {
                  cod_amenity: "linens",
                  name_amenity: "Bed Linen",
                  name_amenity_translations: {
                    es: "Ropa de cama",
                    de: "Bettwäsche",
                    he: "מצעים",
                    fr: "Linge de lit",
                    pt: "Roupa de cama",
                    ru: "Постельное белье",
                    nl: "\tLinnengoed",
                    en: "Bed Linen",
                    it: "Biancheria da letto",
                    ro: "Lenjerie de pat",
                  },
                },
                {
                  cod_amenity: "beach_view",
                  name_amenity: "Beach View",
                  name_amenity_translations: {
                    it: "Vista sulla spiaggia",
                    en: "Beach View",
                    es: "Vistas al mar",
                    de: "Blick aufs Wasser",
                    he: "נוף לחוף",
                    fr: "Vue sur la plage",
                    pt: "Vista para praia",
                    ru: "Вид на пляж",
                    nl: "Uitzicht op het strand",
                    ro: "Vedere la plajă",
                  },
                },
                {
                  cod_amenity: "hot_water",
                  name_amenity: "Hot Water",
                  name_amenity_translations: {
                    it: "Acqua calda",
                    en: "Hot Water",
                    es: "Agua caliente",
                    de: "Heißes Wasser",
                    he: "מים חמים",
                    fr: "Eau chaude",
                    pt: "Água quente",
                    ru: "Горячая вода",
                    nl: "Warm water",
                    ro: "Apă caldă",
                  },
                },
                {
                  cod_amenity: "downtown",
                  name_amenity: "Downtown",
                  name_amenity_translations: {
                    en: "Downtown",
                    es: "Centro",
                    de: "Zentrum",
                    he: "במרכז העיר",
                    it: "Centro",
                    fr: "Centre",
                    pt: "Centro",
                    ru: "Даунтаун",
                    nl: "Centrum",
                    ro: "Centru orașului",
                  },
                },
                {
                  cod_amenity: "shower",
                  name_amenity: "Shower",
                  name_amenity_translations: {
                    it: "Doccia",
                    en: "Shower",
                    es: "Ducha",
                    de: "Dusche",
                    fr: "Douche",
                    he: "מִקלַחַת",
                    pt: "Banho",
                    ru: "Душ",
                    nl: "Douche",
                    ro: "Duș",
                  },
                },
                {
                  cod_amenity: "forests",
                  name_amenity: "Forests",
                  name_amenity_translations: {
                    en: "Forests",
                    es: "Bosques",
                    de: "Wälder",
                    he: "יערות",
                    it: "Foreste",
                    fr: "Forets",
                    pt: "Floresta",
                    ru: "Леса",
                    nl: "Bossen",
                    ro: "Păduri",
                  },
                },
                {
                  cod_amenity: "bay",
                  name_amenity: "Bay",
                  name_amenity_translations: {
                    it: "Baia",
                    en: "Bay",
                    es: "Bahía",
                    de: "Bucht",
                    he: "מפרץ",
                    fr: "Baie",
                    pt: "Baía",
                    ru: "Залив",
                    nl: "\tBaai",
                    ro: "Golf",
                  },
                },
                {
                  cod_amenity: "double_beds",
                  name_amenity: "Double beds",
                  name_amenity_translations: {
                    it: "Letti matrimoniali",
                    en: "Double beds",
                    es: "Camas dobles",
                    de: "Doppelbetten",
                    he: "מיטות זוגיות",
                    fr: "Lits doubles",
                    pt: "Cama de casal",
                    ru: "Двуспальная кровать",
                    nl: "Tweepersoonsbedden",
                    ro: "Paturi duble",
                  },
                },
                {
                  cod_amenity: "bathrobe",
                  name_amenity: "Bathrobe",
                  name_amenity_translations: {
                    it: "Accappatoio",
                    en: "Bathrobe",
                    es: "Albornoz",
                    de: "Bademantel",
                    fr: "Peignoir",
                    he: "חלוק רחצה",
                    pt: "Roupão de banho\n",
                    ru: "Халат",
                    nl: "Badjas",
                    gr: "Μουρνούζι",
                    ro: "Halat de baie",
                  },
                },
                {
                  cod_amenity: "bidet",
                  name_amenity: "Bidet",
                  name_amenity_translations: {
                    it: "Bidet",
                    en: "Bidet",
                    es: "Bidet",
                    de: "Bidet",
                    fr: "Bidet",
                    he: "בידה",
                    pt: "Bidê",
                    ru: "Биде",
                    nl: "Bidet",
                    ro: "Bideu",
                  },
                },
                {
                  cod_amenity: "house_cleaning_included",
                  name_amenity: "House Cleaning Included",
                  name_amenity_translations: {
                    it: "Pulizia della casa inclusa",
                    en: "House Cleaning Included",
                    es: "Limpieza de la casa incluida",
                    de: "Hausreinigung inklusive",
                    he: "ניקיון הבית כלול",
                    fr: "Ménage inclus",
                    pt: "Limpeza da casa incluída",
                    ru: "Уборка включена",
                    nl: "Schoonmaak inbegrepen",
                    ro: "Curățenia casei este inclusă",
                  },
                },
                {
                  cod_amenity: "hangers",
                  name_amenity: "Hangers",
                  name_amenity_translations: {
                    it: "Appendini",
                    en: "Hangers",
                    es: "Perchas",
                    de: "Aufhänger",
                    he: "כולבים",
                    fr: "Cintres",
                    pt: "Cabides",
                    ru: "Вешалки",
                    nl: "Hangers",
                    ro: "Umerașe",
                  },
                },
                {
                  cod_amenity: "king_bed",
                  name_amenity: "King bed",
                  name_amenity_translations: {
                    it: "Letto matrimoniale",
                    en: "King bed",
                    es: "Cama de matrimonio",
                    de: "Doppelbett",
                    he: "מיטת קינג",
                    fr: "Lit double",
                    pt: "Cama de casal",
                    ru: "Кровать размера King",
                    nl: "Kingsize bed",
                    ro: "Pat tip King (180x200)",
                  },
                },
                {
                  cod_amenity: "free_parking",
                  name_amenity: "Free Parking",
                  name_amenity_translations: {
                    it: "Parcheggio gratuito",
                    en: "Free Parking",
                    es: "Estacionamiento gratis",
                    de: "Kostenloses Parken",
                    he: "חניה חינם",
                    fr: "Parking gratuit",
                    pt: "Estacionamento grátis",
                    ru: "Бесплатный паркинг",
                    nl: "Gratis parkeren",
                    ro: "Parcare gratuită",
                  },
                },
                {
                  cod_amenity: "elevator",
                  name_amenity: "Elevator",
                  name_amenity_translations: {
                    en: "Elevator",
                    es: "Ascensor",
                    de: "Aufzug",
                    he: "מַעֲלִית",
                    it: "Ascensore",
                    fr: "Ascenseur",
                    pt: "Elevador",
                    ru: "Лифт",
                    nl: "Lift",
                    ro: "Lift",
                  },
                },
                {
                  cod_amenity: "pets_allowed",
                  name_amenity: "Pets allowed",
                  name_amenity_translations: {
                    it: "Animali domestici permessi",
                    en: "Pets allowed",
                    es: "Mascotas permitidas",
                    de: "Haustiere erlaubt",
                    fr: "Animaux domestiques bienvenus",
                    he: "חיות מחמד מורשות",
                    pt: "Permitidos animais",
                    ru: "Разрешены животные",
                    nl: "Huisdieren toegestaan",
                    ro: "Se acceptă animale de companie",
                  },
                },
                {
                  cod_amenity: "bathroom_amenities",
                  name_amenity: "Bathroom amenities",
                  name_amenity_translations: {
                    it: "Accessori bagno",
                    en: "Bathroom amenities",
                    es: "Accesorios de baño",
                    de: "Badezimmerzubehör",
                    fr: "Accessoires salle de bain",
                    he: "טואלטיקה",
                    pt: "Acessórios de banheiro\n",
                    ru: "Банные принадлежности",
                    nl: "Badkamer voorzieningen",
                    gr: "προϊόντα μπάνιου",
                    ro: "Articole de baie",
                  },
                },
                {
                  cod_amenity: "air_conditioning",
                  name_amenity: "Air conditioning",
                  name_amenity_translations: {
                    it: "Aria condizionata",
                    en: "Air conditioning",
                    es: "Aire acondicionado",
                    de: "Klimatisierung",
                    fr: "Climatisation",
                    he: "מזגן",
                    pt: "Ar condicionado",
                    ru: "Кондиционер",
                    nl: "Airconditioning",
                    ro: "Aer condiționat",
                  },
                },
              ],
              bedroom_details: [
                {
                  type: "BEDROOM",
                  beds: null,
                  amenities: null,
                },
              ],
              bathroom_details: [
                {
                  type: "FULL_BATH",
                  amenities: [
                    "AMENITY_BIDET",
                    "AMENITY_SHOWER",
                    "AMENITY_TOILET",
                  ],
                },
              ],
              images: [
                "https://cdn.krbo.eu/praiaamare/images/3/1/17054915089426.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/1/17065457144185.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/1/17065457156869.jpg",
              ],
              be_name: {
                df: "Hotel Praia Magica Esempio",
                it: null,
                en: null,
                de: null,
                es: null,
                fr: null,
              },
              be_description: {
                df: "L'esposizione a sud della terrazza permette di godere a pieno del sole anche nei mesi meno caldi A CAUSA DI UNA FORTE MAREGGIATA LA SPIAGGIA NELLA PRIMA FOTO, CHE SI TROVA SOTTO L'APPARTAMENTO, È STATA DANNEGGIATA E AL MOMENTO NON È ACCESSIBILE. SI PUÒ USUFRUIRE DELLA SPIAGGIA PRINCIPALE DI ZOAGLI, DISTA 10 MINUTI A PIEDI POSTO AUTO PRIVATO all'interno del residence, dista 150 metri dall'appartamento, sono presenti alcuni scalini lungo il percorso",
                it: null,
                en: null,
                de: null,
                es: null,
                fr: null,
              },
            },
            {
              id_property: 1,
              id_room_type: 3,
              name_room_type: "Camera Matrimoniale Deluxe con Balcone",
              address: "Via Fratelli Cervi, 27, 87028 Praia a Mare CS",
              city: "Praia a mare",
              area: "Cosenza",
              post_code: "87029",
              cod_country: "IT",
              qt_guests: 2,
              min_occupancy: 1,
              max_occupancy: 2,
              date_creation: "2024-01-17 12:17:14",
              n_bedrooms: 1,
              hide_be: false,
              number_of_bedrooms: 1,
              number_of_bathrooms: 1,
              non_smoking: false,
              amenities: [
                {
                  cod_amenity: "free_parking",
                  name_amenity: "Free Parking",
                  name_amenity_translations: {
                    it: "Parcheggio gratuito",
                    en: "Free Parking",
                    es: "Estacionamiento gratis",
                    de: "Kostenloses Parken",
                    he: "חניה חינם",
                    fr: "Parking gratuit",
                    pt: "Estacionamento grátis",
                    ru: "Бесплатный паркинг",
                    nl: "Gratis parkeren",
                    ro: "Parcare gratuită",
                  },
                },
                {
                  cod_amenity: "single_bed",
                  name_amenity: "Single bed",
                  name_amenity_translations: {
                    it: "Letto singolo",
                    en: "Single bed",
                    es: "Cama individual",
                    de: "Einzelbett",
                    fr: "Lit simple",
                    he: "מיטת יחיד",
                    pt: "Cama de solteiro",
                    ru: "Односпальная кровать",
                    nl: "Eenpersoonsbed",
                    ro: "Pat de o persoana",
                  },
                },
                {
                  cod_amenity: "childrens_playpen",
                  name_amenity: "Children's playpen",
                  name_amenity_translations: {
                    it: "Box bambini",
                    en: "Children's playpen",
                    es: "Box niños",
                    de: "Kinderlaufstall",
                    he: "לול לילדים",
                    fr: "Parc enfant",
                    pt: "Chiqueirinho",
                    ru: "",
                    nl: "Speelgoedbox voor kinderen",
                    ro: "Țarc pentru copii",
                  },
                },
                {
                  cod_amenity: "cave",
                  name_amenity: "Cave",
                  name_amenity_translations: {
                    en: "Cave",
                    es: "Cueva",
                    de: "Höhle",
                    he: "המערה",
                    it: "Grotta",
                    fr: "Grotte",
                    pt: "Caverna",
                    ru: "Пещера",
                    nl: "Grot",
                    ro: "Peșteră",
                  },
                },
                {
                  cod_amenity: "home_step_free_access",
                  name_amenity: "Home Step Free Access",
                  name_amenity_translations: {
                    es: "Entrada libre de impedimentos",
                    de: "Barrierefreier Zugang",
                    he: "כניסה ללא מדרגות",
                    it: "Ingresso libero da impedimenti",
                    en: "Home Step Free Access",
                    fr: "Entrée sans obstacle",
                    pt: "Entrada livre de impedimentos",
                    ru: "",
                    nl: "Toegang zonder drempels tot huis",
                    ro: "Intrare în casă gratuită",
                  },
                },
                {
                  cod_amenity: "double_beds",
                  name_amenity: "Double beds",
                  name_amenity_translations: {
                    it: "Letti matrimoniali",
                    en: "Double beds",
                    es: "Camas dobles",
                    de: "Doppelbetten",
                    he: "מיטות זוגיות",
                    fr: "Lits doubles",
                    pt: "Cama de casal",
                    ru: "Двуспальная кровать",
                    nl: "Tweepersoonsbedden",
                    ro: "Paturi duble",
                  },
                },
                {
                  cod_amenity: "waterfront",
                  name_amenity: "Waterfront",
                  name_amenity_translations: {
                    en: "Waterfront",
                    es: "Paseo marítimo",
                    de: "Wasserfront",
                    he: "מול הים",
                    it: "Lungomare",
                    fr: "Front de mer",
                    pt: "Beira-Mar",
                    ru: "Перед водой",
                    nl: "Aan het water",
                    ro: "Malul apei",
                  },
                },
                {
                  cod_amenity: "pocket_wifi",
                  name_amenity: "Pocket Wifi",
                  name_amenity_translations: {
                    it: "Pocket Wifi",
                    en: "Pocket Wifi",
                    es: "Pocket Wifi",
                    de: "Pocket Wifi",
                    he: "וויפי נייד",
                    fr: "Pocket Wifi",
                    pt: "Pocket Wifi",
                    ru: "",
                    nl: "Wifi-to-go",
                    ro: "Wi-Fi de buzunar",
                  },
                },
                {
                  cod_amenity: "village",
                  name_amenity: "Village",
                  name_amenity_translations: {
                    en: "Village",
                    es: "Pueblo",
                    de: "Dorf",
                    he: "כפר",
                    it: "Villaggio",
                    fr: "Village",
                    pt: "Vilarejo",
                    ru: "Деревня",
                    nl: "\tDorp",
                    ro: "Sat",
                  },
                },
                {
                  cod_amenity: "home_wide_doorway",
                  name_amenity: "Home Wide Doorway",
                  name_amenity_translations: {
                    it: "Ampia porta d'ingresso",
                    en: "Home Wide Doorway",
                    es: "Entrada amplia",
                    de: "Breite Zugangstür zu den Gemeinschaftsräumen",
                    he: "דלתות רחבות ",
                    fr: "Large porte d'entrée",
                    pt: "Porta de entrada ampla",
                    ru: "",
                    nl: "Brede doorgang naar huis",
                    ro: "Ușă cu intrare largă",
                  },
                },
                {
                  cod_amenity: "shampoo",
                  name_amenity: "Shampoo",
                  name_amenity_translations: {
                    it: "Shampoo",
                    es: "Champú",
                    de: "Shampoo",
                    he: "שמפו",
                    en: "Shampoo",
                    fr: "Shampooing",
                    pt: "Shampoo",
                    ru: "Шампунь",
                    nl: "\tShampoo",
                    ro: "Șampon",
                  },
                },
                {
                  cod_amenity: "pets_allowed",
                  name_amenity: "Pets allowed",
                  name_amenity_translations: {
                    it: "Animali domestici permessi",
                    en: "Pets allowed",
                    es: "Mascotas permitidas",
                    de: "Haustiere erlaubt",
                    fr: "Animaux domestiques bienvenus",
                    he: "חיות מחמד מורשות",
                    pt: "Permitidos animais",
                    ru: "Разрешены животные",
                    nl: "Huisdieren toegestaan",
                    ro: "Se acceptă animale de companie",
                  },
                },
                {
                  cod_amenity: "near_ocean",
                  name_amenity: "Near Ocean",
                  name_amenity_translations: {
                    en: "Near Ocean",
                    es: "Cerca del Oceano",
                    de: "In der Nähe des Ozeans",
                    he: "ליד האוקיינוס",
                    it: "Vicino l'oceano",
                    fr: "Près de l'océan",
                    pt: "Perto do mar",
                    ru: "Рядом океан",
                    nl: "Dichtbij de oceaan",
                    ro: "Aproape de ocean",
                  },
                },
                {
                  cod_amenity: "meal_included_breakfast",
                  name_amenity: "Meal included - breakfast",
                  name_amenity_translations: {
                    it: "Colazione inclusa",
                    en: "Meal included - breakfast",
                    es: "Desayuno incluido",
                    de: "Inklusive Frühstück",
                    fr: "Petit-déjeuner inclus",
                    he: "ארוחה כלולה - ארוחת בוקר",
                    pt: "Café da manhã incluso",
                    ru: "Завтрак",
                    nl: "Maaltijd inbegrepen - ontbijt",
                    ro: "Masă inclusă - Mic-dejun",
                  },
                },
                {
                  cod_amenity: "coin_laundry",
                  name_amenity: "Coin Laundry",
                  name_amenity_translations: {
                    en: "Coin Laundry",
                    es: "Lavandería con monedas",
                    de: "Münzwäscherei",
                    he: "כביסה למטבעות",
                    it: "Lavanderia a gettoni",
                    fr: "Laverie à jetons",
                    pt: "Lavanderia por fichas",
                    ru: "Чистка монет",
                    nl: "Muntenwasserette",
                    ro: "Spălătorie cu monede",
                  },
                },
                {
                  cod_amenity: "queen_bed",
                  name_amenity: "Queen bed",
                  name_amenity_translations: {
                    en: "Queen bed",
                    es: "Cama Queen",
                    de: "Queen-Bett",
                    he: "מיטת קווין",
                    it: "Letto queen",
                    fr: "Lit Queen",
                    pt: "Cama queen",
                    ru: "Кровать размера Queen",
                    nl: "Queensize bed",
                    ro: "Pat tip Queen (160x200)",
                  },
                },
                {
                  cod_amenity: "web_enabled",
                  name_amenity: "Web enabled",
                  name_amenity_translations: {
                    it: "Abilitato web",
                    en: "Web enabled",
                    es: "Web habilitado",
                    de: "Webfähig",
                    he: "אינטרנט מופעל",
                    fr: "Web accessible",
                    pt: "Habilitado para web",
                    ru: "",
                    nl: "Web-enabled",
                    ro: "Web activat",
                  },
                },
              ],
              bedroom_details: [
                {
                  type: "BEDROOM",
                  beds: {
                    king_bed: "1",
                    queen_bed: "1",
                    sofa_bed: "1",
                    bunk_bed: "1",
                    toddler_bed: "2",
                    crib: "2",
                  },
                  amenities: {
                    en_suite_bathroom: "2",
                  },
                },
              ],
              bathroom_details: [
                {
                  type: "FULL_BATH",
                  amenities: [
                    "AMENITY_BIDET",
                    "AMENITY_TUB",
                    "AMENITY_OUTDOOR_SHOWER",
                    "AMENITY_TOILET",
                  ],
                },
              ],
              images: [
                "https://cdn.krbo.eu/praiaamare/images/3/3/17060258487811.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/3/17065436255329.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/3/17065438507408.jpg",
              ],
            },
            {
              id_property: 1,
              id_room_type: 2,
              name_room_type: "Camera Quadrupla con Balcone",
              address: "Via Fratelli Cervi, 27, 87028 Praia a Mare CS",
              city: "Praia a mare",
              area: "Cosenza",
              post_code: "87029",
              cod_country: "IT",
              qt_guests: 4,
              min_occupancy: 1,
              max_occupancy: 4,
              date_creation: "2024-01-17 12:17:14",
              n_bedrooms: 1,
              hide_be: false,
              number_of_bedrooms: 1,
              number_of_bathrooms: 2,
              non_smoking: false,
              amenities: [
                {
                  cod_amenity: "free_parking",
                  name_amenity: "Free Parking",
                  name_amenity_translations: {
                    it: "Parcheggio gratuito",
                    en: "Free Parking",
                    es: "Estacionamiento gratis",
                    de: "Kostenloses Parken",
                    he: "חניה חינם",
                    fr: "Parking gratuit",
                    pt: "Estacionamento grátis",
                    ru: "Бесплатный паркинг",
                    nl: "Gratis parkeren",
                    ro: "Parcare gratuită",
                  },
                },
                {
                  cod_amenity: "river",
                  name_amenity: "River",
                  name_amenity_translations: {
                    en: "River",
                    es: "Río",
                    de: "Fluss",
                    he: "נחל",
                    it: "Fiume",
                    fr: "Fleuve",
                    pt: "Rio",
                    ru: "Река",
                    nl: "\tRivier",
                    ro: "Râu",
                  },
                },
                {
                  cod_amenity: "lake",
                  name_amenity: "Lake",
                  name_amenity_translations: {
                    it: "Lago",
                    en: "Lake",
                    es: "Lago",
                    de: "See",
                    he: "אגם",
                    fr: "Lac",
                    pt: "Lago",
                    ru: "Озеро",
                    nl: "\tMeer",
                    ro: "Lac",
                  },
                },
                {
                  cod_amenity: "rural",
                  name_amenity: "Rural",
                  name_amenity_translations: {
                    en: "Rural",
                    es: "Rural",
                    de: "Ländlich",
                    he: "עירוני",
                    it: "Rurale",
                    fr: "Rural",
                    pt: "Rural",
                    ru: "Деревенский",
                    nl: "Landelijk",
                    ro: "Rural",
                  },
                },
                {
                  cod_amenity: "lake_view",
                  name_amenity: "Lake View",
                  name_amenity_translations: {
                    en: "Lake View",
                    es: "Vistas al lago",
                    de: "Blick auf den See",
                    he: "נוף לאגם",
                    it: "Vista lago",
                    fr: "Vue lac",
                    pt: "Vista lago",
                    ru: "Вид на озеро",
                    nl: "\tUitzicht op het meer",
                    ro: "Vedere la Lac",
                  },
                },
                {
                  cod_amenity: "near_ocean",
                  name_amenity: "Near Ocean",
                  name_amenity_translations: {
                    en: "Near Ocean",
                    es: "Cerca del Oceano",
                    de: "In der Nähe des Ozeans",
                    he: "ליד האוקיינוס",
                    it: "Vicino l'oceano",
                    fr: "Près de l'océan",
                    pt: "Perto do mar",
                    ru: "Рядом океан",
                    nl: "Dichtbij de oceaan",
                    ro: "Aproape de ocean",
                  },
                },
              ],
              bedroom_details: [
                {
                  type: "BEDROOM",
                  beds: {
                    queen_bed: "1",
                    double_bed: "1",
                    single_bed: "1",
                    bunk_bed: "1",
                    floor_mattress: "1",
                  },
                  amenities: {
                    en_suite_bathroom: "2",
                  },
                },
              ],
              bathroom_details: [
                {
                  type: "FULL_BATH",
                  amenities: [
                    "AMENITY_BIDET",
                    "AMENITY_TOILET",
                    "AMENITY_JETTED_TUB",
                  ],
                },
                {
                  type: "FULL_BATH",
                  amenities: [
                    "AMENITY_BIDET",
                    "AMENITY_TOILET",
                    "AMENITY_JETTED_TUB",
                  ],
                },
              ],
              images: [
                "https://cdn.krbo.eu/praiaamare/images/3/2/17060258965244.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/2/17065435737179.jpg",
                "https://cdn.krbo.eu/praiaamare/images/3/2/17065435746841.jpg",
              ],
            },
          ],
          total_count: 5,
          count: 5,
          limit: 5000,
          offset: 0,
          ruid: "OFdRZWJ2cDI1dEJXWXduNmk4WUJNZz09Ojraxdo7dwULawldNa0nTlf2",
        } as unknown as GetRoomTypes;

        const amenitiesData = jsonRoomTypes.data.map((roomType) => {
          return roomType.amenities.flat().map((amenity) => ({
            code: amenity.cod_amenity,
            name: amenity.name_amenity,
            nameTranslations: amenity.name_amenity_translations,
          }));
        });

        // create amenities not already in db
        await ctx.db.amenity.createMany({
          data: amenitiesData.flat().map((amenity) => ({
            ...amenity,
          })),
          skipDuplicates: true,
        });

        // populate roomType table with data from get-room-types
        const roomTypeData = jsonRoomTypes.data.map((roomType) => {
          const propery = properies.find(
            (property) => property.propertyCode === roomType.id_property
          );
          if (propery) {
            return {
              propertyId: propery.id,
              code: roomType.id_room_type,
              name: roomType.name_room_type,
              address: roomType.address,
              city: roomType.city,
              postCode: roomType.post_code,
              codCountry: roomType.cod_country,
              standardOccupancy: roomType.qt_guests,
              minOccupancy: roomType.min_occupancy,
              maxOccupancy: roomType.max_occupancy,
              sizeMq: roomType.size_sqm,
              floor: roomType.floor,
              nBedrooms: roomType.number_of_bedrooms,
              nBathrooms: roomType.number_of_bathrooms,
              bedRoomDetails: roomType.bedroom_details,
              bathRoomDetails: roomType.bathroom_details,
              smoking: !roomType.non_smoking,
              images: roomType.images,
              hide: roomType.hide_be,
              BeName: roomType.be_name,
              BeDescription: roomType.be_description,
              // Amenity: {
              //   connect: roomType.amenities.flat().map((amenity) => ({
              //     code: amenity.cod_amenity,
              //   })),
              // },
            };
          }
        });

        await ctx.db.roomType.createMany({
          data: roomTypeData.map((roomType) => ({
            ...roomType,
          })),
        });

        // set Amenities for each room type
        const roomTypes = await ctx.db.roomType.findMany({
          where: {
            propertyId: {
              in: properies.map((property) => property.id),
            },
            code: {
              not: null,
            },
          },
        });
        const amenities = await ctx.db.amenity.findMany();
        const roomTypeAmenities = jsonRoomTypes.data.map((roomType) => {
          return roomType.amenities.flat().map((amenity) => ({
            roomTypeCode: roomType.id_room_type,
            amenityCode: amenity.cod_amenity,
          }));
        });

        for (const roomTypeAmenity of roomTypeAmenities) {
          for (const amenity of roomTypeAmenity) {
            const roomType = roomTypes.find(
              (roomType) => roomType.code === amenity.roomTypeCode
            );
            const amenityData = amenities.find(
              (amenityData) => amenityData.code === amenity.amenityCode
            );
            if (roomType && amenityData) {
              await ctx.db.roomTypeAmenity.create({
                data: {
                  roomTypeId: roomType.id,
                  amenityId: amenityData.id,
                },
              });
            }
          }
        }

        // console.log("@merchant@json", jsonRoomTypes);
        // #### END - get room types ####

        // #### INIT - get room type prices availability ####
        /**
         * https://api.krossbooking.com/v5/channel/get-prices-and-availability
          {
            "id_room_type": 3,
            "id_rate": 1,
            "cod_channel": "BE",
            "date_from": "2024-02-15",
            "date_to": "2024-03-05"
          }
         */

        const jsonGetPricesNAvailability = {
          data: [
            {
              date_from: "2024-01-15",
              date_to: "2024-06-15",
              id_room_type: 1,
              id_rate: 1,
              price: 35,
              closed: false,
              minimum_stay: null,
              minimum_stay_arrival: null,
              maximum_stay: null,
              maximum_stay_arrival: null,
              closed_arrival: false,
              closed_departure: false,
              total: 1,
              booked: 0,
              blocked: 0,
              free: 1,
            },
            {
              date_from: "2024-01-15",
              date_to: "2024-06-15",
              id_room_type: 2,
              id_rate: 1,
              price: 70,
              closed: false,
              minimum_stay: null,
              minimum_stay_arrival: null,
              maximum_stay: null,
              maximum_stay_arrival: null,
              closed_arrival: false,
              closed_departure: false,
              total: 1,
              booked: 0,
              blocked: 0,
              free: 1,
            },
            {
              date_from: "2024-01-15",
              date_to: "2024-06-15",
              id_room_type: 3,
              id_rate: 1,
              price: 90,
              closed: false,
              minimum_stay: null,
              minimum_stay_arrival: null,
              maximum_stay: null,
              maximum_stay_arrival: null,
              closed_arrival: false,
              closed_departure: false,
              total: 1,
              booked: 0,
              blocked: 0,
              free: 1,
            },
          ],
          count: 1,
          ruid: "NW1DcnBtdjh1dUJ4SUFxNEdJSkUrZz09OjoL9NvrmPo1AAGIjW1I7nf2",
        } as unknown as GetPricesNAvailability;

        if (jsonGetPricesNAvailability) {
          const newRoomTypes = await ctx.db.roomType.findMany({
            where: {
              propertyId: {
                in: properies.map((property) => property.id),
              },
              code: {
                not: null,
              },
            },
          });

          await ctx.db.roomTypePricesAvailability.createMany({
            data: jsonGetPricesNAvailability.data.map((roomType) => ({
              rateId: roomType.id_rate,
              dateFrom: new Date(roomType.date_from),
              dateTo: new Date(roomType.date_to),
              price: roomType.price,
              closed: roomType.closed,
              minimumStay: roomType.minimum_stay,
              minimumStayArrival: roomType.minimum_stay_arrival,
              maximumStay: roomType.maximum_stay,
              maximumStayArrival: roomType.maximum_stay_arrival,
              closedArrival: roomType.closed_arrival,
              closedDeparture: roomType.closed_departure,
              total: roomType.total,
              booked: roomType.booked,
              blocked: roomType.blocked,
              free: roomType.free,
              roomTypeId:
                newRoomTypes.find(
                  (newRoomType) => newRoomType.code === roomType.id_room_type
                )?.id ?? -1,
            })),
          });
        }

        // #### END - get room type prices availability ####
      } catch (error) {
        console.error("Error fetching authToken:", error);
      }
    }),

  list: publicProcedure
    .input(z.object({ property: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { property } = input;

      const include = {
        Property: true,
        RoomTypePricesAvailability: true,
        RoomTypeAmenity: {
          include: {
            amenity: true,
          },
        },
      };

      if (property) {
        const roomTypes = await ctx.db.roomType.findMany({
          where: {
            Property: {
              id: property,
            },
          },
          include: include,
        });
        return roomTypes;
      }

      const roomTypes = await ctx.db.roomType.findMany({
        include,
      });

      return roomTypes;
    }),
});
