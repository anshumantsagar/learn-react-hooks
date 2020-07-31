import React, { useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

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

const httpReducer = (curHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false, error: null };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return {...curHttpState, error: null };
    default:
      throw new Error('httpReducer Should Not Get There!');
  }
} 

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer,[]);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });
  // const [ userIngredients, setUserIngredients] = useState([]);
  // const [ isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('Rerendering Ingredients' , userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredients = ingredient => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-66b80.firebaseio.com/ingredients.json',{
      method:'POST',
      body: JSON.stringify({ingredient}),
      headers: { 'Content-Type' : 'application/json' }
    })
      .then(resoponse => {
        // setIsLoading(false);
        dispatchHttp({type: 'RESPONSE'});
        return resoponse.json();
    })
      .then(resoponseData => {
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients, 
      //   { id: resoponseData.name, ...ingredient}
      // ] );
      dispatch({type: 'ADD', ingredient: { id: resoponseData.name, ...ingredient}});
    });

  }

  const removeIngredientHandler = ingredientId => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-66b80.firebaseio.com/ingredients/${ingredientId}.json`,{
      method:'DELETE'
    })
    .then(resoponse => {
      // setIsLoading(false);
      dispatchHttp({type: 'RESPONSE'});
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({type: 'DELETE', id: ingredientId});
    }).catch(error => {
      // setError(error.message);
      // setIsLoading(false);
      dispatchHttp({type: 'ERROR', errorMessage: error.message});
    })
  };

  const clearError = () => {
    // setError(null);
    dispatchHttp({type: 'CLEAR'});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredients} 
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
