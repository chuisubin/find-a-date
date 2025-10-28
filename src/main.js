import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye,
  faEyeSlash,
  faSquare,
  faSquareCheck,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faXmark,
  faCrown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import vcalendar from "./plugins/vcalendar";
import "v-calendar/style.css";
import "vue3-toastify/dist/index.css";
import Vue3Toasity, { toast } from "vue3-toastify";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
const app = createApp(App);
library.add(
  faEye,
  faEyeSlash,
  faSquareCheck,
  faPenToSquare,
  faCheck,
  faXmark,
  faCrown,
  faChevronLeft,
  faChevronRight
);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.use(vcalendar);
app.use(FloatingVue);
app.use(Vue3Toasity, {
  autoClose: 3000, //自動關閉時間
  position: toast.POSITION.BOTTOM_RIGHT, //提示窗位置
  theme: "colored",
});
app.mount("#app");
