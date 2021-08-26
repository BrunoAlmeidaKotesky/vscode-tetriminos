// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { MainPanel } from "./MainPanel";

export function activate(context: vscode.ExtensionContext) {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "Play the game!";
  item.command = "tetriminos.play";
  item.show();
  //Execute an command when clicking the sidebar item
  
  context.subscriptions.push(
    vscode.commands.registerCommand("tetriminos.play", () => {
      MainPanel.createOrShow(context.extensionUri);
    }),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
