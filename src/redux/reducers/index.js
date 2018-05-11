import { GO_BACK } from "../constants/action-types";
import { GO_FORWARD } from "../constants/action-types";
import { VIEW_FORWARD } from "../constants/action-types";

const initialState = {
    panelBack: [],
    panelForward: [],
    activePanel: 'Main',
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case GO_BACK:
            return { ...state,
                panelBack: state.panelBack.slice(0, -1),
                panelForward: [...state.panelForward, action.payload],
                activePanel: state.panelBack[state.panelBack.length - 1], };
        case GO_FORWARD:
            return { ...state,
                panelBack: [...state.panelBack, action.payload],
                panelForward: state.panelForward.slice(0, -1),
                activePanel: state.panelForward[state.panelForward.length - 1] };
        case VIEW_FORWARD:
            let newPanelBack = state.panelBack.slice();
            newPanelBack.push(action.payload.oldView);
            return { ...state,
                panelBack: newPanelBack,
                panelForward: [],
                activePanel: action.payload.newView };
        default:
            return state;
    }
};

export default rootReducer;