import { Room, RoomType } from "@prisma/client";
import { getCookie } from "cookies-next";
import { createContext, useState, useContext, useEffect } from "react";

export const months = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

export const languages = [
  { code: "it_IT", name: "Italiano", flag: "/flags/italy.svg" },
  { code: "en_GB", name: "English", flag: "/flags/united-kingdom.svg" },
  { code: "fr_FR", name: "Français", flag: "/flags/france.svg" },
  { code: "de_DE", name: "Deutsch", flag: "/flags/germany.svg" },
  { code: "es_ES", name: "Español", flag: "/flags/spain.svg" },
  { code: "pt_PT", name: "Português", flag: "/flags/portugal.svg" },
] as {
  code: string;
  name: string;
  flag: string;
}[];

export const getDate = (date: Date | undefined): string => {
  return date ? convertDate(date) : "Aggiungi le date";
};

// Tipo del contesto
type FiltersContextType = {
  checkin: Date | undefined;
  checkout: Date | undefined;
  chi_adulti: number;
  chi_bambini: number;
  chi_neonati: number;
  chi_pets: number;
  language: string;
  roomType: RoomType | undefined;
  updateFilters: (newFilters: Partial<FiltersContextType>) => void; // Aggiunto il tipo per il metodo updateFilters
};

// Creazione del contesto
const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

// Hook custom per accedere al contesto
const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error(
      "useFiltersContext deve essere utilizzato all'interno di un FiltersContextProvider"
    );
  }
  return context;
};

// Provider del contesto
const FiltersContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {


  useEffect(() => {
    const checkinCookie = getCookie("checkin");
    const checkoutCookie = getCookie("checkout");
    const chiAdultiCookie = getCookie("chi_adulti");
    const chiBambiniCookie = getCookie("chi_bambini");
    const chiNeonatiCookie = getCookie("chi_neonati");
    const chiPetsCookie = getCookie("chi_pets");

    setFilters((prevFilters) => ({
      ...prevFilters,
      checkin: checkinCookie ? new Date(checkinCookie) : undefined,
      checkout: checkoutCookie ? new Date(checkoutCookie) : undefined,
      language: "it_IT",
      chi_adulti: chiAdultiCookie ? parseInt(chiAdultiCookie) : 0,
      chi_bambini: chiBambiniCookie ? parseInt(chiBambiniCookie) : 0,
      chi_neonati: chiNeonatiCookie ? parseInt(chiNeonatiCookie) : 0,
      chi_pets: chiPetsCookie ? parseInt(chiPetsCookie) : 0,
    }));
  }, [])
  const [filters, setFilters] = useState<Omit<FiltersContextType, 'updateFilters'>>({
    checkin: undefined,
    checkout: undefined,
    language: "it_IT",
    chi_adulti: 0,
    chi_bambini: 0,
    chi_neonati: 0,
    chi_pets: 0,
    roomType: undefined
  });
  const updateFilters = (newFilters: Partial<FiltersContextType>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  }
  return (
    <FiltersContext.Provider value={{ ...filters, updateFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

const getMonthName = (monthNumber: number) => {
  const monthIndex = monthNumber - 1;

  if (monthIndex >= 0 && monthIndex < months.length) {
    return months[monthIndex];
  }
  return "-";
};

const convertDate = (date: Date) => {
  const day = date.getDate();
  const month = getMonthName(date.getMonth() + 1);
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month} ${year}`;
};

export {
  FiltersContext,
  useFiltersContext,
  FiltersContextProvider,
  convertDate,
};
