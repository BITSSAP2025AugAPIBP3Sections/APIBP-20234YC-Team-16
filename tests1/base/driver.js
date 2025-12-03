import { Builder } from "selenium-webdriver";
import edge from "selenium-webdriver/edge.js";

export default async function buildDriver() {
  const service = new edge.ServiceBuilder("./msedgedriver.exe");

  const options = new edge.Options();
  // options.addArguments("--headless=new"); // enable headless if needed

  const driver = await new Builder()
    .forBrowser("MicrosoftEdge")
    .setEdgeOptions(options)
    .setEdgeService(service)
    .build();

  return driver;
}
