import "./styles/styles.css";
import Clarity from "@microsoft/clarity";

Clarity.init("xozpebxxlp");

import MainController from "./controller/main.controller.js";
const controller = new MainController();
controller.init();
