import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import { ActiveGameParams, AppContext } from "./context/AppContext";
import { GameDetails, GamesList } from "./features/games";
import { Games, Providers } from "./interfaces";
import { ROUTES } from "./routes";
import { Api } from "./services/api.service";

const ApiInstance = new Api();

function App() {
  const [isLoading, seIisLoading] = useState<boolean>(false);
  const [gamesList, setGamesList] = useState<Games.Response>({});
  const [filteredGamesList, setFilteredGamesList] = useState<Games.Response>(
    {}
  );
  const [providersList, setProvidersList] = useState<Providers.Provider[]>([]);

  const getAllGames = useCallback(async () => {
    try {
      seIisLoading(true);
      const response = await ApiInstance.getGames();
      setGamesList(response);
      seIisLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getAllProviders = useCallback(async () => {
    try {
      const response = await ApiInstance.getProviders();
      setProvidersList(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getActiveGame = useCallback(
    ({ provider, name }: ActiveGameParams) => {
      const gameId = Object.keys(gamesList).find((item) =>
        item
          ?.toLowerCase()
          ?.includes(`${provider}/${name?.toLowerCase().replace(/-/g, "")}`)
      );
      if (gameId) {
        return gamesList[gameId];
      }
    },
    [gamesList]
  );

  const filterGamesWithProvider = useCallback(
    async (filters: string[]) => {
      if (filters?.length) {
        seIisLoading(true);
        const filteredValues = Object.keys(gamesList)
          .filter((item) => filters?.includes(gamesList[item]?.provider))
          .reduce((result: any, key: string) => {
            result[key] = gamesList[key];

            return result;
          }, {});

        setFilteredGamesList(filteredValues);
        seIisLoading(false);
      } else {
        setFilteredGamesList(gamesList);
      }
    },
    [gamesList]
  );

  useEffect(() => {
    if (!Object.keys(gamesList)?.length) {
      getAllGames();
    }
  }, [gamesList, getAllGames]);

  useEffect(() => {
    setFilteredGamesList(gamesList);
  }, [gamesList]);

  useEffect(() => {
    if (!providersList?.length) {
      getAllProviders();
    }
  }, [providersList, getAllProviders]);

  return (
    <AppContext.Provider
      value={{
        games: filteredGamesList,
        providers: providersList,
        filterGamesWithProvider,
        getActiveGame,
        isLoading,
      }}
    >
      <main className="container">
        <Routes>
          <Route path={ROUTES.GAMES} element={<Outlet />}>
            <Route index element={<GamesList />} />
            <Route
              path={`${ROUTES.GAMES}/game/:provider/:name`}
              element={<GameDetails />}
            />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.GAMES} />} />
        </Routes>
      </main>
    </AppContext.Provider>
  );
}

export default App;
