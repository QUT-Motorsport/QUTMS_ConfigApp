import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

const { NODE_ENV } = process.env;

if (NODE_ENV === "production") {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  // Can't use app.on('ready',...)
  // https://github.com/sindresorhus/electron-serve/issues/15
  await app.whenReady();
  const mainWindow = createWindow("QUTMS EV2 Config", {
    width: 1000,
    height: 600
  });

  if (NODE_ENV === "production") {
    await mainWindow.loadURL("app://");
  } else {
    await mainWindow.loadURL("http://localhost:8888/");
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
