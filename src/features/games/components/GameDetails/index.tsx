import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext, AppContextType } from "../../../../context/AppContext";
import { Games } from "../../../../interfaces";
import { ROUTES } from "../../../../routes";
import styles from "./GameDetails.module.scss";
import ArrowIcon from "../../../../assets/svg/arrow-tiny.svg";

const GameDetails = () => {
  const { provider, name } = useParams();
  const { getActiveGame } = useContext<AppContextType>(AppContext);

  const [gameDetails, setGameDetails] = useState<Games.Game>({
    title: "",
    provider: "",
  });

  useEffect(() => {
    const result = getActiveGame({
      provider,
      name,
    });
    if (result) {
      setGameDetails(result);
    }
  }, [provider, name, getActiveGame]);

  return (
    <section className={styles.game__section}>
      <header>
        <Link to={`${ROUTES.GAMES}`} className={styles.link}>
          <img src={ArrowIcon} alt="arrow back" />
          Back to Games List
        </Link>
      </header>

      <div className={styles.details}>
        <h1 className={styles.details__title}>
          {gameDetails?.provider} / {gameDetails?.title}
        </h1>
        <div className={styles.game__wrapper}>
          <iframe
            title="test"
            allow="true"
            allowFullScreen={true}
            referrerPolicy="no-referrer"
            src={`${process.env.REACT_APP_BASE_URL}${gameDetails.demo}`}
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default GameDetails;
