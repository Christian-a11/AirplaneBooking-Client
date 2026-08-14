import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "notyf/notyf.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");
