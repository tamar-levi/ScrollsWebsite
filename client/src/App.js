import React from 'react';
import ProductDisplay from './components/AllProducts';
import AddProduct from './components/AddProduct';


function App() {
  return (
    <div className="App">
      <AddProduct />
      <ProductDisplay />
    </div>
  );
}

export default App;

