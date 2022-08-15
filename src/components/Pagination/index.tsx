import clx from "classnames";
import { SetStateAction, useEffect, useRef, useState } from "react";

import ArrowDoubleIcon from "../../assets/svg/arrow-double.svg";
import ArrowIcon from "../../assets/svg/arrow-tiny.svg";
import styles from "./Pagination.module.scss";

interface Props {
  currentPage: number;
  setCurrentPage: (value: any) => void;
  noOfPages: number;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  setCurrentPage,
  noOfPages,
}) => {
  const pageInput = useRef<HTMLInputElement | null>(null);
  const [inputVal, setIntputVal] = useState<string | number>(1);

  useEffect(() => {
    if (currentPage) {
      setIntputVal(currentPage);
    }
  }, [currentPage]);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(+currentPage - 1);
      setIntputVal(+currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < noOfPages) {
      setCurrentPage(+currentPage + 1);
      setIntputVal(+currentPage + 1);
    }
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string | number> };
  }) => {
    setCurrentPage(+e.target.value);
    setIntputVal(+e.target.value);
  };

  return (
    <footer className={styles.pagination}>
      <span className={styles.line} />
      <div className={styles.pagination__actions}>
        <img
          src={ArrowDoubleIcon}
          alt="to the end"
          className={clx(styles.arrow__start, {
            [styles.arrow__disabled]: currentPage <= 1,
          })}
          onClick={() => {
            setCurrentPage(1);
          }}
        />
        <img
          src={ArrowIcon}
          alt="next"
          className={clx(styles.arrow__prev, {
            [styles.arrow__disabled]: currentPage - 1 <= 1,
          })}
          onClick={handlePrevClick}
        />
      </div>
      <div className={styles.pages}>
        <span>Page:</span>
        <input
          className={styles.page__input}
          type="number"
          value={inputVal}
          onChange={handleInputChange}
          ref={pageInput}
        />
        <span>of {noOfPages}</span>
      </div>
      <div className={styles.pagination__actions}>
        <img
          src={ArrowIcon}
          alt="next"
          className={clx(styles.arrow__next, {
            [styles.arrow__disabled]: currentPage + 1 > noOfPages,
          })}
          onClick={handleNextClick}
        />
        <img
          src={ArrowDoubleIcon}
          alt="to the end"
          className={clx(styles.arrow__end, {
            [styles.arrow__disabled]: currentPage + 1 > noOfPages,
          })}
          onClick={() => {
            setCurrentPage(+noOfPages);
          }}
        />
      </div>
    </footer>
  );
};

export default Pagination;
