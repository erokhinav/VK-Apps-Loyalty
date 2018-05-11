import { GO_BACK } from "../constants/action-types";
import { GO_FORWARD } from "../constants/action-types";
import { VIEW_FORWARD } from "../constants/action-types";

export const goBack = view => ({ type: GO_BACK, payload: view });
export const goForward = view => ({ type: GO_FORWARD, payload: view });
export const viewForward = views => ({ type: VIEW_FORWARD, payload: views });