import { createContext } from "react";
import { Games, Providers } from "../interfaces";

export interface ActiveGameParams {
  provider: string | undefined;
  name: string | undefined;
}

export type AppContextType = {
  games: Games.Response | {};
  providers: Providers.Provider[] | [];
  filterGamesWithProvider: (value: string[]) => void;
  getActiveGame: (params: ActiveGameParams) => Games.Game | undefined;
  isLoading: boolean;
};

export const AppContext = createContext<AppContextType>({
  games: {},
  providers: [],
  filterGamesWithProvider: () => {},
  getActiveGame: () => {
    return {
      title: "",
      provider: "",
    };
  },
  isLoading: false,
});
