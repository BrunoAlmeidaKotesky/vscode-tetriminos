// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { MainPanel } from "./MainPanel";
import { TokenManager } from "./TokenManager";

export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(beaker) Add Todo";
  item.command = "tetriminos.play";
  item.show();

  
  context.subscriptions.push(
    vscode.commands.registerCommand("tetriminos.play", () => {
      vscode.window.showInformationMessage(
        "token value is: " + TokenManager.getToken()
      );
      MainPanel.createOrShow(context.extensionUri);
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
