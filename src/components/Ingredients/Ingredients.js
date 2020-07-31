import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-66b80.firebaseio.com/ingredients.json')
    .then(response => response.json())
    .then(resoponseData => {
      console.log(resoponseData);
      const loadedIngredients = [];
      for (const key in resoponseData) {
        loadedIngredients.push({
          id: key,
          title: resoponseData[key].ingredient.title,
          amount: resoponseData[key].ingredient.amount
        });
      }
      setUserIngredients(loadedIngredients);
    });
  }, []);

  const addIngredients = ingredient => {
    fetch('https://react-hooks-66b80.firebaseio.com/ingredients.json',{
      method:'POST',
      body: JSON.stringify({ingredient}),
      headers: { 'Content-Type' : 'application/json' }
    })
      .then(resoponse => {
      return resoponse.json();
    })
      .then(resoponseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        { id: resoponseData.name, ...ingredient}
      ] );
    });
    
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredients}/>

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}}/>
      </section>
    </div>
  );
}

export default Ingredients;
