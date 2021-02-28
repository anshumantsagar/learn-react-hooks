import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http'; 

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should Not Get There!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer,[]);
  const { isLoading, error, data, sendRequest } = useHttp();
  // const [ userIngredients, setUserIngredients] = useState([]);
  // const [ isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('Rerendering Ingredients' , userIngredients);
  }, [data,userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredients = useCallback(ingredient => {
    // setIsLoading(true);
    // dispatchHttp({type: 'SEND'});
    // fetch('https://react-hooks-66b80.firebaseio.com/ingredients.json',{
    //   method:'POST',
    //   body: JSON.stringify({ingredient}),
    //   headers: { 'Content-Type' : 'application/json' }
    // })
    //   .then(resoponse => {
    //     // setIsLoading(false);
    //     dispatchHttp({type: 'RESPONSE'});
    //     return resoponse.json();
    // })
    //   .then(resoponseData => {
    //   // setUserIngredients(prevIngredients => [
    //   //   ...prevIngredients, 
    //   //   { id: resoponseData.name, ...ingredient}
    //   // ] );
    //   dispatch({type: 'ADD', ingredient: { id: resoponseData.name, ...ingredient}});
    // });

  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(
    `https://react-hooks-66b80.firebaseio.com/ingredients/${ingredientId}.json`,
    'DELETE'
    );
  },[sendRequest]);

  const clearError = useCallback( () => {
    // setError(null);
    // dispatchHttp({type: 'CLEAR'});
  },[]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredients} 
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
