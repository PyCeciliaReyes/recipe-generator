import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import '../index.css'

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    const data = await response.json();
    setRecipe(data.recipe);
    setLoading(false);
  };
  const formatRecipe = (recipeText) => {
    if (!recipeText) return { title: '', content:[]};
    const [title, ...content] = recipeText.split('\n\n');
    const formattedContent = content.join('\n').split('\n').filter(line => line.trim() !== '');

    return { title, content: formattedContent };
  };

  const {title, content} = formatRecipe(recipe);


  return (
    <div>
      <h1>Generador de recetas con OpenAI</h1>
      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Escribe los ingredientes..."
      />
      <Button variant='contained' color='primary' onClick={generateRecipe} disabled={loading}>
        {loading ? <CircularProgress size={24}/> : 'Generar Receta'}
      </Button>
      <div>
        <h2>Receta Generada:</h2>
        {title && <h3 className='recipe-title'>{title}</h3>}
        <div className='recipe-content'>
          {content.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
