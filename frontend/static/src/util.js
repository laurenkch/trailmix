export const handleError = (err) => {
    console.warn(err);
}

export const handleInput = (e, setState) => {
    const { name, value } = e.target

    setState((prevState) => ({
        ...prevState,
        [name]: value,
    }));
};

export const TRAIL_TYPES = {
    oab: 'Out and back',
    loop: 'Loop',
    seg: 'Trail segment',
};


export const TRAIL_FEEDBACK = [
    'Dog friendly',
    'No pets allowed',
    'Muddy',
    'Rocky',
    'Steep',
    'Shaded',
    'River crossing',
    'Limited parking',
    'Ample parking',
    'Clean bathrooms',
    'No bathrooms',
    'Dirty bathrooms',
    'No cell service',
    'Strong cell signal',
    'Weak cell signal',
    'Kid friendly',
    'Paved',
    'Wheelchair accessible',
]