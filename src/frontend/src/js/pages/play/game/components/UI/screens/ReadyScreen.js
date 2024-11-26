import { Toast } from "../../../../../../provider/toast-provider.js";
import { BaseScreen } from "./BaseScreen.js";

export class ReadyScreen extends BaseScreen {
    enter() {
        Toast.info("Game is ready to start");
    }
}