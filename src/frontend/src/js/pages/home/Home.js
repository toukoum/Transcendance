import { Component } from "../../utils/Component.js";
import { Toast } from "../../provider/toast-provider.js";
import { api } from "../../utils/api/Api.js";
import { Dashboard } from "./_components/Dashboard.js";

export class Home extends Component {
  constructor() {
    super("main-layout");
  }

  content() {
    const isLogged = !!window.auth;
    if (!isLogged) {
      return (/*html*/ `
        <div class="d-flex justify-content-center align-items-center h-100">
          WWSSSSSSSSHHHHH BATARD!!!!!!!!!!!!!
        </div>
      `);
    }
    return /*html*/ `
      <dashboard-component></dashboard-component>
    `;
  }
}

customElements.define("home-page", Home);