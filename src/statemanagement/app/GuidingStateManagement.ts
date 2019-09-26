import { isPointOnLeftOfRight } from "../../helpers/utils";
import GuidingLines from '../../helpers/guidinglines';

interface GuidingState {
    referenceLine: Array<Array<number>>;
    equipmentWidth: number;
    distanceToClosestGuidingLine: number;
    bearingToClosestGuidingLine: number;
    isGuidingLineOnRightOrLeft: string;
    guidingLines: any;
    isDefiningGuidingLines: boolean;
}

const getInitialState = (): GuidingState => {
    return {
        referenceLine: [],
        equipmentWidth: 5,
        distanceToClosestGuidingLine: null,
        bearingToClosestGuidingLine: null,
        isGuidingLineOnRightOrLeft: null,
        guidingLines: null,
        isDefiningGuidingLines: false
    };
};


const SET_REFERENCE_LINE = 'Guiding/SET_REFERENCE_LINE';
const SET_EQUIPMENT_WIDTH = 'Guiding/SET_EQUIPMENT_WIDTH';
const SET_DISTANCE_TO_CLOSEST_GUIDINGLINE = 'Guiding/SET_DISTANCE_TO_CLOSEST_GUIDINGLINE';
const SET_BEARING_TO_CLOSEST_GUIDINGLINE = 'Guiding/SET_BEARING_TO_CLOSEST_GUIDINGLINE';
const SET_GUIDING_LINE_LEFT_OR_RIGHT = 'Guiding/SET_GUIDING_LINE_LEFT_OR_RIGHT';
const CREATE_OR_UPDATE_GUIDING_LINES = 'Guiding/CREATE_OR_UPDATE_GUIDING_LINES';
const START_DEFINING_GUIDINGLINES = 'Guiding/START_DEFINING_GUIDINGLINES';
const RESET = 'Guiding/RESET';


export function setReferenceLine(referenceLine) {
    return {
        type: SET_REFERENCE_LINE,
        payload: referenceLine
    }
}

export function setEquipmentWidth(equipmentWidth) {
    return {
        type: SET_EQUIPMENT_WIDTH,
        payload: equipmentWidth
    }
}

export function setDistanceToClosestGuidingLine(distanceToClosestGuidingLine) {
    return {
        type: SET_DISTANCE_TO_CLOSEST_GUIDINGLINE,
        payload: distanceToClosestGuidingLine
    }
}

export function startDefiningGuidingLines() {
    return {
        type: START_DEFINING_GUIDINGLINES,
        payload: true
    }
}

export function setBearingToClosestGuidingLine(bearingToClosestGuidingLine) {
    return (dispatch, getState) => {

        var heading = getState().geolocation.position.coords.heading;
        var isLeftOrRight = isPointOnLeftOfRight(heading, bearingToClosestGuidingLine);

        dispatch({
            type: SET_GUIDING_LINE_LEFT_OR_RIGHT,
            payload: isLeftOrRight
        })

        dispatch({
            type: SET_BEARING_TO_CLOSEST_GUIDINGLINE,
            payload: bearingToClosestGuidingLine
        })
    }
}

export function resetGuidingState() {
    return {
        type: RESET
    }
}

export function createOrUpdateGuidingLines() {
    return (dispatch, getState) => {

        const equipmentWidth = getState().guiding.equipmentWidth;
        const referenceLine = getState().guiding.referenceLine;

        const guidingLines = new GuidingLines(
            equipmentWidth,
            referenceLine
        );

        dispatch({
            type: CREATE_OR_UPDATE_GUIDING_LINES, 
            payload: guidingLines
        })

    }
}

const guidingStateReducer = (
    state = getInitialState(),
    action: any
): GuidingState => {
    switch (action.type) {
        case SET_REFERENCE_LINE: {
            return {
                ...state,
                referenceLine: action.payload
            };
        }
        case SET_EQUIPMENT_WIDTH: {
            return {
                ...state,
                equipmentWidth: action.payload
            };
        }
        case SET_DISTANCE_TO_CLOSEST_GUIDINGLINE: {
            return {
                ...state,
                distanceToClosestGuidingLine: action.payload
            };
        }
        case SET_BEARING_TO_CLOSEST_GUIDINGLINE: {
            return {
                ...state,
                bearingToClosestGuidingLine: action.payload
            };
        }
        case SET_GUIDING_LINE_LEFT_OR_RIGHT: {
            return {
                ...state,
                isGuidingLineOnRightOrLeft: action.payload
            };
        }
        case START_DEFINING_GUIDINGLINES: {
            return {
                ...state,
                isDefiningGuidingLines: true
            };
        }
        case CREATE_OR_UPDATE_GUIDING_LINES: {
            return {
                ...state,
                guidingLines: action.payload,
                isDefiningGuidingLines: false
            };
        }
        case RESET: {
            return getInitialState();
        }

    }
    return state;
};

export default guidingStateReducer;