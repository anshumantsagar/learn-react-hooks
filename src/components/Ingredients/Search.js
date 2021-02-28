import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredFilter === inputRef.current.value) {
        const query = 
      enteredFilter.length === 0
       ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch('https://react-hooks-66b80.firebaseio.com/ingredients.json' + query)
    .then(response => response.json())
    .then(resoponseData => {
      const loadedIngredients = [];
      for (const key in resoponseData) {
        loadedIngredients.push({
          id: key,
          title: resoponseData[key].ingredient.title,
          amount: resoponseData[key].ingredient.amount
        });
      }
      onLoadIngredients(loadedIngredients);
    });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text" 
            value={enteredFilter} 
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
