import React, { useState } from 'react';
import { Button, CircularProgress, Accordion as MuiAccordion, AccordionSummary as MuiAccordionSummary, AccordionDetails as MuiAccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {styled} from '@mui/material/styles';
import '../index.css';

const RecipeGenerator = () => {
  const [inputIngredients, setInputIngredients] = useState(''); 
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: inputIngredients }), 
      });

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRecipe = (recipeText) => {
    if (!recipeText) return { title: '', ingredients: [], instructions: [] };

    const lines = recipeText.split('\n').filter(line => line.trim() !== '');
    const title = lines.shift();
    const ingredientsIndex = lines.findIndex(line => line.toLowerCase().includes('ingredientes:'));
    const instructionsIndex = lines.findIndex(line => line.toLowerCase().includes('instrucciones:'));

    const ingredients = lines.slice(ingredientsIndex + 1, instructionsIndex);
    const instructions = lines.slice(instructionsIndex + 1);

    return { title, ingredients, instructions };
  };

  const { title, ingredients, instructions } = formatRecipe(recipe);

  const DarkAccordion = styled(MuiAccordion)(({ theme }) => ({
    backgroundColor: '#333',
    color: '#fff',
  }));

  const DarkAccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
    backgroundColor: '#444',
  }));

  const DarkAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    backgroundColor: '#555',
  }));

  return (
    <div>
      <h1>Generador de recetas con OpenAI</h1>
      <textarea
        value={inputIngredients} 
        onChange={(e) => setInputIngredients(e.target.value)} 
        placeholder="Escribe los ingredientes..."
      />
      <Button variant='contained' color='primary' onClick={generateRecipe} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Generar Receta'}
      </Button>
      <div>
        <h2>Receta Generada:</h2>
        {title && <h3 className='recipe-title'>{title}</h3>}
        <div className='recipe-content'>
        <DarkAccordion>
            <DarkAccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#fff' }} />}>
              <Typography>Ingredientes</Typography>
            </DarkAccordionSummary>
            <DarkAccordionDetails>
              <div>
                {ingredients.map((line, index) => (
                  <Typography key={index}>{line}</Typography>
                ))}
              </div>
            </DarkAccordionDetails>
          </DarkAccordion>
          <DarkAccordion>
            <DarkAccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#fff' }} />}>
              <Typography>Instrucciones</Typography>
            </DarkAccordionSummary>
            <DarkAccordionDetails>
              <div>
                {instructions.map((line, index) => (
                  <Typography key={index}>{line}</Typography>
                ))}
              </div>
            </DarkAccordionDetails>
          </DarkAccordion>
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;

