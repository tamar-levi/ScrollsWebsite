import React from 'react';
import Products from './components/AllProducts';
import AddProduct from './components/AddProduct';


function App() {
  return (
    <div className="App">
      <AddProduct />
      <Products />
    </div>
  );
}

export default App;

