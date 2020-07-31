import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients] = useState([]);
  const [ isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('Rerendering Ingredients' , userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredients = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-66b80.firebaseio.com/ingredients.json',{
      method:'POST',
      body: JSON.stringify({ingredient}),
      headers: { 'Content-Type' : 'application/json' }
    })
      .then(resoponse => {
        setIsLoading(false);
        return resoponse.json();
    })
      .then(resoponseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        { id: resoponseData.name, ...ingredient}
      ] );
    });

  }

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-66b80.firebaseio.com/ingredients/${ingredientId}.jon`,{
      method:'DELETE'
    })
    .then(resoponse => {
      setIsLoading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    }).catch(error => {
      setError(error.message);
      setIsLoading(false);
    })
  };

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredients} 
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
