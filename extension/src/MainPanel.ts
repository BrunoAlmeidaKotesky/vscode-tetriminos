import * as vscode from "vscode";

export class MainPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: MainPanel | undefined;

  public static readonly viewType = "tetriminos";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (MainPanel.currentPanel) {
      MainPanel.currentPanel._panel.reveal(column);
      MainPanel.currentPanel._update();
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      MainPanel.viewType,
      "Tetriminos",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      }
    );

    MainPanel.currentPanel = new MainPanel(panel, extensionUri);
  }

  public static kill() {
    MainPanel.currentPanel?.dispose();
    MainPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    MainPanel.currentPanel = new MainPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    MainPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        // case "tokens": {
        //   await Util.globalState.update(accessTokenKey, data.accessToken);
        //   await Util.globalState.update(refreshTokenKey, data.refreshToken);
        //   break;
        // }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out/compiled", "MainAppPage.js")
    );

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const stylesMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    // const cssUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.css")
    // );

    // // Use a nonce to only allow specific scripts to be run
    const nonce = this.getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${stylesResetUri}" rel="stylesheet">
        <link href="${stylesMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
        </script>
			</head>
      <body>
			</body>
      <script src="${scriptUri}" nonce="${nonce}">
			</html>`;
  }

  private getNonce() {
    console.log('here2');
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  
}
