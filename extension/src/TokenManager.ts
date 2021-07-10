import type {Memento} from "vscode";

const KEY = "vstodotoken";

export class TokenManager {
  static globalState: Memento;

  static setToken(token: string) {
    return this.globalState.update(KEY, token);
  }

  static getToken(): string | undefined {
    return this.globalState.get(KEY);
  }
}
