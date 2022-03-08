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



