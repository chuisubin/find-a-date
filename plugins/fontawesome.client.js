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
  faBars,
  faCalendar,
  faCopy,
  faPlus,
  faChevronDown,
  faChevronUp,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineNuxtPlugin((nuxtApp) => {
  library.add(
    faEye,
    faEyeSlash,
    faSquareCheck,
    faPenToSquare,
    faCheck,
    faXmark,
    faCrown,
    faChevronLeft,
    faChevronRight,
    faBars,
    faCalendar,
    faCopy,
    faPlus,
    faChevronDown,
    faChevronUp,
    faShare
  );

  nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon);
});
