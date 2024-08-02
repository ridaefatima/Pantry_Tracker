import { Box, Typography, Button } from '@mui/material';

export default function RecipeDisplay({ open, handleClose, recipe }) {
  // Function to remove * characters from the text
  const cleanText = (text) => text.replace(/\*/g, '');

  const formatRecipe = (recipe) => {
    const lines = recipe.split('\n');
    let section = '';
    let title = '';
    let ingredients = [];
    let instructions = [];

    lines.forEach((line) => {
      const cleanedLine = cleanText(line).trim();

      if (cleanedLine.endsWith(':') && (cleanedLine.includes('Ingredients') || cleanedLine.includes('Instructions'))) {
        if (cleanedLine.includes('Ingredients')) {
          section = 'ingredients';
          // If title was found before the current section, add it to the ingredients
          if (title) {
            ingredients.push(title);
            title = ''; // Reset title
          }
        } else if (cleanedLine.includes('Instructions')) {
          section = 'instructions';
        }
      } else if (section === '' && cleanedLine) {
        // Capture the title
        title = cleanedLine;
      } else if (section === 'ingredients' && cleanedLine) {
        ingredients.push(cleanedLine);
      } else if (section === 'instructions' && cleanedLine) {
        instructions.push(cleanedLine);
      }
    });

    return (
      <>
        {ingredients.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
              {ingredients[0]} {/* Display title before ingredients */}
            </Typography>
            <Typography variant="h6" fontWeight="normal" gutterBottom>
              Ingredients:
            </Typography>
            <ul style={{ textAlign: 'left', margin: '0 auto' }}>
              {ingredients.slice(1).map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </Box>
        )}

        {instructions.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight="normal" gutterBottom>
              Instructions:
            </Typography>
            <ol>
              {instructions.map((instruction, i) => (
                <li key={i}>{instruction}</li>
              ))}
            </ol>
          </Box>
        )}
      </>
    );
  };

  if (!open) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2} bgcolor="darkred" borderRadius="8px" boxShadow={3} color="white" width="70%">
      <Box mt={2}>
        {recipe ? formatRecipe(recipe) : 'No recipe found'}
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 2, bgcolor: 'darkred', color: 'white', '&:hover': { bgcolor: 'firebrick' } }}
        onClick={handleClose}
      >
        Close
      </Button>
    </Box>
  );
}
