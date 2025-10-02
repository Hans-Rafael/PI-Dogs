import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { post, getTemperament } from './../../redux/actions/index';
import style from './create.module.css';

// A robust validation function with clear, specific error messages
function validate(input) {
    let errors = {};

    // Name validation
    if (!input.name.trim()) errors.name = "Breed name is required.";
    else if (!/^[a-zA-Z\s]+$/.test(input.name)) errors.name = "Name can only contain letters and spaces.";
    else if (input.name.length > 50) errors.name = "Name cannot be longer than 50 characters.";

    // Convert string inputs to numbers for proper comparison
    const minH = Number(input.minHeight);
    const maxH = Number(input.maxHeight);
    const minW = Number(input.minWeight);
    const maxW = Number(input.maxWeight);
    const minL = Number(input.minLifeExp);
    const maxL = Number(input.maxLifeExp);

    // Height validation
    if (!minH) errors.minHeight = "Min height is required.";
    else if (minH <= 0) errors.minHeight = "Min height must be greater than 0.";
    if (!maxH) errors.maxHeight = "Max height is required.";
    else if (maxH <= 0) errors.maxHeight = "Max height must be greater than 0.";
    if (minH && maxH && minH >= maxH) errors.maxHeight = "Max height must be greater than min height.";

    // Weight validation
    if (!minW) errors.minWeight = "Min weight is required.";
    else if (minW <= 0) errors.minWeight = "Min weight must be greater than 0.";
    if (!maxW) errors.maxWeight = "Max weight is required.";
    else if (maxW <= 0) errors.maxWeight = "Max weight must be greater than 0.";
    if (minW && maxW && minW >= maxW) errors.maxWeight = "Max weight must be greater than min weight.";

    // Life Expectancy validation
    if (minL && minL <= 0) errors.minLifeExp = "Must be greater than 0.";
    if (maxL && maxL <= 0) errors.maxLifeExp = "Must be greater than 0.";
    if (minL && maxL && minL >= maxL) errors.maxLifeExp = "Max life expectancy must be greater than min.";

    // Image validation (optional field)
    if (input.img && !/^(ftp|http|https):\/\/[^ "]+$/.test(input.img)) {
        errors.img = "Please enter a valid image URL.";
    }

    // Temperament validation
    if (input.temperament.length === 0) {
        errors.temperament = "At least one temperament must be selected.";
    }

    return errors;
}

export default function Create() {
    const dispatch = useDispatch();
    const history = useHistory();
    const temperaments = useSelector((state) => state.temps);

    const [input, setInput] = useState({
        name: '',
        minHeight: '',
        maxHeight: '',
        minWeight: '',
        maxWeight: '',
        minLifeExp: '',
        maxLifeExp: '',
        img: '',
        temperament: [],
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getTemperament());
    }, [dispatch]);

    // Run validation on every input change
    useEffect(() => {
        setErrors(validate(input));
    }, [input]);

    function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    }

    function handleSelect(e) {
        const selectedTemp = e.target.value;
        if (selectedTemp && !input.temperament.includes(selectedTemp)) {
            setInput({
                ...input,
                temperament: [...input.temperament, selectedTemp],
            });
        }
    }

    function handleDelete(tempToDelete) {
        setInput({
            ...input,
            temperament: input.temperament.filter((temp) => temp !== tempToDelete),
        });
    }

    // FIX: Add try...catch to handle potential submission errors gracefully
    async function handleSubmit(e) {
        e.preventDefault();
        const finalErrors = validate(input);
        setErrors(finalErrors);

        if (Object.keys(finalErrors).length === 0) {
            try {
                await dispatch(post(input));
                alert('New dog breed saved successfully!');
                history.push('/home'); // This line will now be reached upon success
            } catch (error) {
                // If the backend rejects the post, show an alert with the error
                console.error('Submission failed:', error);
                alert(`Failed to save dog. Please check the data and try again.\nServer says: ${error.message}`);
            }
        }
    }

    // Determine if the form is valid for enabling the submit button
    const isFormValid = Object.keys(errors).length === 0 && input.name !== '' && input.temperament.length > 0;

    return (
        <div className={style.main}>
            <div className={style.header}>
                <button className={style.button} onClick={() => history.push('/home')} title="Return to home">
                    Home
                </button>
                <h1>Add the details for the new breed!</h1>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className={style.formGrid}>
                    {/* Name */}
                    <div className={style.formGroup}>
                        <label>Breed Name</label>
                        <input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={handleChange}
                            placeholder="e.g., Golden Retriever"
                            required
                        />
                        {errors.name && <p className={style.error}>{errors.name}</p>}
                    </div>

                    {/* Height */}
                    <div className={style.formGroup}>
                        <label>Height (cm)</label>
                        <div className={style.minMax}>
                            <input type="number" name="minHeight" value={input.minHeight} onChange={handleChange} placeholder="Min" required />
                            <input type="number" name="maxHeight" value={input.maxHeight} onChange={handleChange} placeholder="Max" required />
                        </div>
                        {errors.minHeight && <p className={style.error}>{errors.minHeight}</p>}
                        {errors.maxHeight && <p className={style.error}>{errors.maxHeight}</p>}
                    </div>

                    {/* Weight */}
                    <div className={style.formGroup}>
                        <label>Weight (kg)</label>
                        <div className={style.minMax}>
                            <input type="number" name="minWeight" value={input.minWeight} onChange={handleChange} placeholder="Min" required />
                            <input type="number" name="maxWeight" value={input.maxWeight} onChange={handleChange} placeholder="Max" required />
                        </div>
                        {errors.minWeight && <p className={style.error}>{errors.minWeight}</p>}
                        {errors.maxWeight && <p className={style.error}>{errors.maxWeight}</p>}
                    </div>

                    {/* Life Expectancy */}
                    <div className={style.formGroup}>
                        <label>Life Expectancy (years)</label>
                        <div className={style.minMax}>
                            <input type="number" name="minLifeExp" value={input.minLifeExp} onChange={handleChange} placeholder="Min" />
                            <input type="number" name="maxLifeExp" value={input.maxLifeExp} onChange={handleChange} placeholder="Max" />
                        </div>
                        {errors.minLifeExp && <p className={style.error}>{errors.minLifeExp}</p>}
                        {errors.maxLifeExp && <p className={style.error}>{errors.maxLifeExp}</p>}
                    </div>

                    {/* Image URL */}
                    <div className={style.formGroup}>
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="img"
                            value={input.img}
                            onChange={handleChange}
                            placeholder="http://..."
                        />
                        {errors.img && <p className={style.error}>{errors.img}</p>}
                    </div>

                    {/* Temperaments */}
                    <div className={style.formGroup}>
                        <label>Temperaments</label>
                        <select onChange={handleSelect} defaultValue="">
                            <option value="" disabled>Select one or more</option>
                            {temperaments.map((t) => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                        {errors.temperament && <p className={style.error}>{errors.temperament}</p>}
                        <div className={style.temperamentTags}>
                            {input.temperament.map((temp) => (
                                <div key={temp} className={style.tag}>
                                    {temp}
                                    <button type="button" onClick={() => handleDelete(temp)} title="Remove temperament">
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={style.submitContainer}>
                    <button className={style.button} type="submit" disabled={!isFormValid}>
                        Add Breed
                    </button>
                </div>
            </form>
        </div>
    );
}
