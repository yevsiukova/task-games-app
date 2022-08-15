import clx from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext, AppContextType } from "../../../../context/AppContext";
import { paginate } from "../../../../helpers";
import { Games } from "../../../../interfaces";
import useDebounce from "../../../../utils/useDebounce";
import styles from "./GamesList.module.scss";
import { ReactComponent as CrossIcon } from "../../../../assets/svg/cross.svg";
import { ReactComponent as SearchIcon } from "../../../../assets/svg/search.svg";
import Pagination from "../../../../components/Pagination";
import useOutsideClick from "../../../../utils/useOutsideClick";
import ArrowIcon from "../../../../assets/svg/arrow-tiny.svg";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routes";
import Spinner from "../../../../components/Spinner";

const GamesList = () => {
  const { games, providers, filterGamesWithProvider, isLoading } =
    useContext<AppContextType>(AppContext);
  const [fileterdGames, setFileterdGames] = useState<Games.Response>({});

  const [activeDataPage, setActiveDataPage] = useState<Games.Response>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  const [isSearchInputOpen, setIsSearchInputOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [isResetFilteredValues, setIsResetFilteredValues] =
    useState<boolean>(false);
  const debounceSearch = useDebounce(searchText, 400, 1);

  const providersListRef = useRef<HTMLDivElement | null>(null);
  const [isProvidersListOpen, setIsProvidersListOpen] = useState(false);
  const [providersFilter, setProvidersFilter] = useState<string[]>([]);

  useOutsideClick(providersListRef, () => {
    if (isProvidersListOpen) setIsProvidersListOpen(false);
  });

  useEffect(() => {
    filterGamesWithProvider(providersFilter);
  }, [providersFilter, filterGamesWithProvider]);

  useEffect(() => {
    if (Object.keys(games)) {
      setFileterdGames(games);
      if (Object.keys(games)) {
        setActiveDataPage(paginate(games, 9, 1));
        setNoOfPages(Math.ceil(Object.keys(games)?.length / 9));
        setCurrentPage(1);
      } else {
        setActiveDataPage({});
        setNoOfPages(0);
        setCurrentPage(0);
      }
    }
  }, [games]);

  useEffect(() => {
    setActiveDataPage(paginate(fileterdGames, 9, currentPage));
  }, [fileterdGames, currentPage]);

  useEffect(() => {
    if (debounceSearch) {
      const initialValues: Games.Response = isResetFilteredValues
        ? games
        : fileterdGames;
      const results = Object.keys(initialValues)
        .filter((item) => {
          return item?.toLowerCase()?.includes(debounceSearch.toLowerCase());
        })
        .reduce((result: any, key: string) => {
          result[key] = initialValues[key];

          return result;
        }, {});

      if (Object.keys(results)?.length) {
        setFileterdGames(results);
        setNoOfPages(Math.ceil(Object.keys(results)?.length / 9));
        setCurrentPage(1);
      } else {
        setFileterdGames({});
        setNoOfPages(0);
        setCurrentPage(0);
      }
    } else {
      setFileterdGames(games);
      setNoOfPages(Math.ceil(Object.keys(games)?.length / 9));
      setCurrentPage(1);
    }
  }, [debounceSearch]);

  return (
    <section className={styles.games__section}>
      <header className={styles.section__header}>
        {isSearchInputOpen ? (
          <div className={styles.search__input}>
            <input
              name="searchText"
              value={searchText}
              placeholder="Search"
              onChange={(e) => {
                if (e.target.value >= searchText) {
                  setIsResetFilteredValues(false);
                } else {
                  setIsResetFilteredValues(true);
                }
                setSearchText(e.target.value);
              }}
              type="text"
            />
            <SearchIcon />
            <CrossIcon
              className={styles.cross__icon}
              onClick={() => {
                setIsSearchInputOpen(false);
                setSearchText("");
              }}
            />
          </div>
        ) : (
          <>
            <h1 className={styles.section__title}>Games</h1>

            <div className={styles.search__input}>
              <input
                name="searchText"
                value={searchText}
                placeholder="Search"
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
              />
              <SearchIcon />
            </div>
          </>
        )}
      </header>
      <div className={styles.filters__wrapper}>
        <div className={styles.item__wrapper} ref={providersListRef}>
          <div
            onClick={() => setIsProvidersListOpen((s) => !s)}
            className={clx(styles.filters__item, {
              [styles["item__active"]]: isProvidersListOpen,
            })}
          >
            Providers
            <img
              src={ArrowIcon}
              alt="arrow"
              className={clx(styles.item__arrow, {
                [styles.arrow__up]: isProvidersListOpen,
              })}
            />
          </div>
          {isProvidersListOpen && (
            <ul className={styles.categories__list}>
              {providers?.map((provider) => (
                <li key={provider?.id}>
                  <label
                    className={clx(styles.category__item, {
                      [styles.category__active]: providersFilter?.includes(
                        provider?.id
                      ),
                    })}
                  >
                    <input
                      id={provider?.id}
                      type="checkbox"
                      value={provider?.id}
                      className={styles["checkbox__field"]}
                      checked={providersFilter?.includes(provider?.id)}
                      onChange={() => {
                        if (providersFilter?.includes(provider?.id)) {
                          setProvidersFilter((s) =>
                            s?.filter((item) => item !== provider?.id)
                          );
                        } else {
                          setProvidersFilter((s) => [...s, provider?.id]);
                        }
                      }}
                    />
                    <span>{provider?.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className={styles.games__list}>
          {Object.keys(activeDataPage)?.map((item, idx) => (
            <li className={styles.game__item} key={idx}>
              <img
                src={`https://cdn.softswiss.net/i/s3/${item}.png`}
                alt="torneo"
                className={styles.item__banner}
              />
              <p className={styles.item__title}>
                {activeDataPage[item]?.title}
              </p>

              <Link
                className={styles.item__link}
                to={`${ROUTES.GAMES}game/${item}`}
              >
                Play
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        noOfPages={noOfPages}
      />
    </section>
  );
};

export default GamesList;
