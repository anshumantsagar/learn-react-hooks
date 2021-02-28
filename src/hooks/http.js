import { useReducer, useCallback } from 'react';

const httpReducer = (curHttpState, action) => {
    switch(action.type) {
      case 'SEND':
        return { loading: true, error: null, data: null };
      case 'RESPONSE':
        return { ...curHttpState, loading: false, error: null, data: action.resoponseData };
      case 'ERROR':
        return { loading: false, error: action.errorMessage };
      case 'CLEAR':
        return {...curHttpState, error: null };
      default:
        throw new Error('httpReducer Should Not Get There!');
    }
};

const useHttp = (url, method, body) => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {
        loading: false, 
        error: null,
        data: null
    });

    const sendRequest = useCallback(() => {
        dispatchHttp({type: 'SEND'});   
        fetch(
            url,
            {
                method: method,
                body: body,
                headers: {
                    'Content-Type' : 'application/json'
                }
            }
        )
        .then(response => {
            return response.json();
        })
        .then(resoponseData => {
            dispatchHttp({ type: 'RESPONSE', resoponseData: resoponseData})
        })
        .catch(error => {
        dispatchHttp({type: 'ERROR', errorMessage: error.message});
        });
    },[body, method,url]);
    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest
    };
};

export default useHttp;