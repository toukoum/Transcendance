import { Toast } from "../../../../../../provider/toast-provider.js";
import { BaseScreen } from "./BaseScreen.js";

export class InitializingScreen extends BaseScreen {
    enter() {
        Toast.info("Game is initializing");
    }
}