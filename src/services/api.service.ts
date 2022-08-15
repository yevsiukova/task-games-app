import { Games, Providers } from "../interfaces";

export class Api {
  private baseUrl = `${process.env.REACT_APP_BASE_URL}/api`;

  private async requestData<TResponse>(
    url: string,
    config: RequestInit = {}
  ): Promise<TResponse> {
    return fetch(url, config)
      .then((response) => response.json())
      .then((data) => data as TResponse);
  }

  public async getGames() {
    return await this.requestData<Games.Response>(
      `${this.baseUrl}/games/allowed_desktop`
    );
  }

  public async getProviders() {
    return await this.requestData<Providers.Provider[]>(
      `${this.baseUrl}/games/providers`
    );
  }
  // TODO: error handler
}
