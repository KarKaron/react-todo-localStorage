import { useEffect, useState } from 'react';

// Usage
function Local() {
  // Similar to useState but first arg is key to the value in local storage.
  const [name, setName] = useLocalStorage('name', [
    {name: 'Bob'},
    {name: 'Serge'},
    {name: 'Ivan'},
    {name: 'Paul'}
  ]);

  const updateName = id => {
    console.log(id);
    setName(name.filter(item => item.name !== id))    
  }

  useEffect(() => {
    window.localStorage.setItem("name", JSON.stringify(name));
  })

  const Arr = name.map((item, i) => {
    return (
      <li key={i} onClick={updateName.bind(null, item.name)}>{item.name}</li>
    );
  })

  return (
    <div>
      <h1>TodoList</h1>
      <ul>
        {Arr}
      </ul>
      {/* <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
      /> */}
    </div>
  );
}

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default Local;