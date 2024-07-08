import React, { useState } from 'react';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');

  const generateRecipe = async () => {
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    const data = await response.json();
    setRecipe(data.recipe);
  };

  return (
    <div>
      <h1>Generador de recetas con OpenAI</h1>
      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Escribe los ingredientes..."
      />
      <button onClick={generateRecipe}>Generar Receta</button>
      <div>
        <h2>Receta Generada:</h2>
        <p>{recipe}</p>
      </div>
    </div>
  );
};

export default RecipeGenerator;
