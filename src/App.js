import React, { useState, useRef, useEffect } from 'react';

import './App.css';
import checkImg from './img/check.png';
import chekedImg from './img/checked.png';

function App() {

  const [todos, setTodos] = useLocalStorage('todos', [
    {id: 1, title: 'Buy new sweatshirt', check: true},
    {id: 2, title: 'Begin promotional phase', check: true},
    {id: 3, title: 'Read an article', check: false},
    {id: 4, title: 'Try not to fall asleep', check: false},
    {id: 5, title: 'Watch ‘Sherlock’', check: false},
    {id: 6, title: 'Begin QA for the product', check: false},
    {id: 7, title: 'Go for a walk', check: false}
  ]);

  const [open, setOpen] = useState(false);

  function getWeekDay(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = date.getDay();
    return days[day];
  }

  function getMonth(date) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = date.getMonth();
    return months[month];
  }

  const template = new Date();
  const year = template.getFullYear();
  const date = template.getDate();
  const day = getWeekDay(template).toUpperCase();
  const month = getMonth(template);

  const handlerTodo = id => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          todo.check = !todo.check
        }
        return todo;
      })
    )
  }  

  const idTodos = todos.map(item => {
    return [item.id];
  })

  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  const text = useRef();

  const addTodo = e => {
    e.preventDefault();
    const id = getMaxOfArray(idTodos)+1;
    const title = text.current.value;
    setTodos(todos.concat([
      {
        id,
        title,        
        check: false
      }
    ]));
    text.current.value = '';
    setOpen(!open);
  }

  const removeTodo = id => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  const updateOpen = () => {
    setOpen(!open);
  }

  useEffect(() => {
    window.localStorage.setItem("todos", JSON.stringify(todos));
  })

  const getTodos = todos.map((item, i) => {

    const checkBtn = item.check ? chekedImg : checkImg
    const checkActive = item.check ? 'active' : null
    
    return (
      <li key={i}>
        <p className={checkActive}>{item.title}</p>
        <div>
          <img 
            src={checkBtn} 
            alt="Check"
            onClick={handlerTodo.bind(null, item.id)}
          />
          <span className="remove" onClick={removeTodo.bind(null, item.id)}>&times;</span>
        </div>
      </li>
    );
  }) 

  return (
    <div className="container">
      <div className="card">
        <div className="card__title">
          <div className="card__title-date">
            <h1>{date}</h1>
            <div className="card__title-dateYear">
              <h6>{month}</h6>
              <div className="normal">{year}</div>
            </div>
          </div>
          <h6>{day}</h6>
        </div>
        <ul>
          {getTodos}
        </ul>
        {
          open && (
            <form onSubmit={addTodo} className="form">
              <div>
                <input placeholder="Input new todo here..." ref={text} />
                <button type="submit">Add Todo</button>
              </div>   
            </form>
          )
        }
        <div className="fab">
          <div onClick={updateOpen}>+</div>
        </div>       
      </div>      
    </div>    
  );
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }

  });

  const setValue = value => {

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }

  };

  return [storedValue, setValue];
}

export default App;
