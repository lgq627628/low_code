export const PROPS_TYPE_MAP = {
    INPUT: 'input',
    COLOR: 'color',
    SELECT: 'selection',
    SWITCH: 'switch'
}

export function createInputProp(label) {
    return {
        type: PROPS_TYPE_MAP.INPUT,
        label
    }
}

export function createColorProp(label) {
    return {
        type: PROPS_TYPE_MAP.COLOR,
        label
    }
}

export function createSelectProp(label, opts) {
    return {
        type: PROPS_TYPE_MAP.SELECT,
        label,
        opts
    }
}

export function createSwitchProp(label, opts) {
    return {
        type: PROPS_TYPE_MAP.SWITCH,
        label
    }
}