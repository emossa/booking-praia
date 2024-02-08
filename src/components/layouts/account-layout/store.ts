import { create } from "zustand";

interface AccountLayoutStore {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}
export const useAccountLayoutStore = create<AccountLayoutStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
