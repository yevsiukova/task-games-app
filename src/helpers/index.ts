import { Games } from "../interfaces";

export const paginate = (
  data: Games.Response,
  page_size: number,
  page_number: number
) =>
  Object.keys(data)
    .slice((page_number - 1) * page_size, page_number * page_size)
    .reduce((result: Games.Response, key: string) => {
      result[key] = data[key];

      return result;
    }, {});
