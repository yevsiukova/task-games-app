export namespace Games {
  export type CurrencyTypes =
    | "RUB"
    | "BTC"
    | "BRL"
    | "USD"
    | "LTC"
    | "EUR"
    | "PLN"
    | "BCH"
    | "DOG"
    | "CAD"
    | "NZD"
    | "NOK"
    | "JPY"
    | "USDT"
    | "ETH"
    | "AUD";

  export interface Currency {
    id: number;
    jackpot?: number;
  }

  export interface Collection {
    [key: string]: number;
  }

  export interface Game {
    title: string;
    provider: string;
    collections?: Collection;
    real?: { [CurrencyType in keyof CurrencyTypes]: Currency };
    demo?: string;
  }

  export interface Response {
    [game: string]: Game;
  }
}
