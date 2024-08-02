import { useState, useEffect } from 'react';
import { firestore } from '../firebase/config.js';
import { Box, Modal, Typography, Stack, TextField, Button, CircularProgress } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, differenceInDays } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import RecipeDisplay from './RecipeDisplay';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'white',
  color: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const hideScrollbarStyles = {
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
};

// Function to check if the item is expired
const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  const today = new Date();
  return expiryDate <= today;
};

// Function to get the number of days until expiration
// Function to get the number of days until expiration
const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return 'No Expiry Date';

  const expiry = expiryDate instanceof Timestamp ? expiryDate.toDate() : expiryDate;
  const today = new Date();
  const days = differenceInDays(expiry, today);

  if (days === 0) return 'Expires today';
  if (days < 0) return 'Expired';
  return `Expires in ${days} day${days > 1 ? 's' : ''}`;
};


async function getRecipe(items) {
  try {
    const response = await fetch('/api/recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Recipe data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export default function PantryTracker() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState(null);
  const [recipe, setRecipe] = useState('');
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [isRecipeOpen, setRecipeOpen] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null; // Get current user's UID

  useEffect(() => {
    if (userId) {
      updateInventory();
    }
  }, [userId]);

  const updateInventory = async () => {
    if (!userId) return;

    const snapshot = query(collection(firestore, 'users', userId, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      console.log('Fetched item:', doc.id, data);
      inventoryList.push({
        name: doc.id,
        quantity: data.quantity,
        expiryDate: data.expiryDate ? data.expiryDate.toDate() : null,
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!userId) return;

    const itemNameLower = item.toLowerCase();
    const docRef = doc(collection(firestore, 'users', userId, 'inventory'), itemNameLower);
    const docSnap = await getDoc(docRef);
    const expiryTimestamp = newExpiryDate ? Timestamp.fromDate(newExpiryDate) : null;

    if (docSnap.exists()) {
      const { quantity, expiryDate: existingExpiryDate } = docSnap.data();
      console.log('Updating item:', itemNameLower);
      await setDoc(docRef, { quantity: quantity + 1, expiryDate: existingExpiryDate || expiryTimestamp });
    } else {
      console.log('Adding new item:', itemNameLower);
      await setDoc(docRef, { quantity: 1, expiryDate: expiryTimestamp });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    if (!userId) return;

    const itemNameLower = item.toLowerCase();
    const docRef = doc(collection(firestore, 'users', userId, 'inventory'), itemNameLower);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, expiryDate } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
          expiryDate: expiryDate
        });
      }
      await updateInventory();
    }
  };

  const updateItem = async () => {
    if (!userId || !selectedItem) return;

    const itemNameLower = newItemName.toLowerCase();
    const docRef = doc(collection(firestore, 'users', userId, 'inventory'), itemNameLower);
    const expiryTimestamp = newExpiryDate ? Timestamp.fromDate(newExpiryDate) : null;

    await setDoc(docRef, { quantity: selectedItem.quantity, expiryDate: expiryTimestamp });
    await updateInventory();
  };

  const handleOpen = (item = null) => {
    setSelectedItem(item);
    setNewItemName(item ? item.name : '');
    setNewExpiryDate(item ? item.expiryDate : null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const closeRecipe = () => {
    setRecipeOpen(false);
    setRecipe(''); // Clear the recipe content if needed
  };
  


  const handleGetRecipe = async () => {
    setLoadingRecipe(true);
    setRecipe('');

    const itemsArray = filteredInventory.map(item => item.name);

    const data = await getRecipe(itemsArray);
    console.log('API response:', data); // Debug API response

    if (data) {
      const rawRecipe = data.choices[0]?.message?.content || 'No recipe found';
      setRecipe(rawRecipe);
      setRecipeOpen(true);
    } else {
      setRecipe('Failed to fetch recipe');
    }

    setLoadingRecipe(false);
  };
  


  return (
    <Box
  width="100vw"
  height="calc(100vh - 100px)" // Adjusted to avoid overlapping with the fixed header
  display="flex"
  flexDirection="column"
  alignItems="center"
  bgcolor="black"
  overflow="auto"
  sx={hideScrollbarStyles}
>
<Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {selectedItem ? 'Update Item' : 'Add Item'}
        </Typography>
        <Stack spacing={2}>
          <TextField
            variant="outlined"
            label="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            fullWidth
          />
          <DatePicker
            label="Expiry Date"
            value={newExpiryDate}
            onChange={(date) => setNewExpiryDate(date)}
            renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
          />
          <Button
            variant="outlined"
            sx={{
              backgroundColor: 'darkred',
              color: 'white',
              '&:hover': {
                backgroundColor: 'red',
              },
            }}
            onClick={() => {
              if (selectedItem) {
                updateItem();
              } else {
                addItem(newItemName);
              }
              setNewItemName('');
              setNewExpiryDate(null);
              handleClose();
            }}
            fullWidth
          >
            {selectedItem ? 'Update' : 'Add'}
          </Button>
        </Stack>
      </Box>
    </Modal>


















  <Box
    display="flex"
    flexDirection={{ xs: 'column', sm: 'row' }} // Stack vertically on small screens
    alignItems="center"
    justifyContent="center"
    gap={2}
    mb={2}
    width="75%"
  >
    <Button
      variant="contained"
      sx={{
        backgroundColor: 'darkred',
        color: 'white',
        '&:hover': {
          backgroundColor: 'red',
        },
        width: { xs: '100%', sm: 200 }, // Full width on small screens
        maxWidth: 200,
      }}
      onClick={() => handleOpen()}
    >
      Add Item
    </Button>
    <TextField
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        height: 40,
        width: { xs: '100%', sm: 300 }, // Full width on small screens
        maxWidth: 300,
        '& .MuiOutlinedInput-root': {
          height: '100%',
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover fieldset': {
            borderColor: 'transparent',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'transparent',
          },
        },
        '& .MuiInputBase-input': {
          textAlign: 'center',
          padding: '0 13px',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
        },
      }}
      variant="outlined"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search Items"
    />
  </Box>

  <Box
    display="flex"
    flexDirection="column"
    width="100%"
    alignItems="center"
    justifyContent="center"
    height="fixed"
  >
    <Box
      overflow="auto"
      width="75%"
      maxWidth="800px"
      bgcolor="darkred"
      p={2}
      borderRadius={2}
      mb={2}
      display="flex"
      justifyContent="center"
    >
      <Typography variant="h4" color="white" textAlign="center">
        Inventory Items
      </Typography>
    </Box>

    <Box
      width="75%"
      maxWidth="800px"
      height="calc(100vh - 450px)"
      display="flex"
      flexDirection="column"
      overflow="auto"
      sx={hideScrollbarStyles}
    >
      {filteredInventory.length === 0 ? (
        <Typography textAlign="center" color="white" mt={4}>No items found</Typography>
      ) : (
        filteredInventory.map((item) => (
          <Box
            key={item.name}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            bgcolor="white"
            color="black"
            p={2}
            borderRadius={2}
            
            mb={2}
            flexWrap="wrap" // Wrap items on smaller screens
          >
            <Typography
    variant="body1"
    sx={{
      flexGrow: 1,
      maxWidth: 'calc(100% - 100px)', // Adjust as needed to fit the container's layout
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      
    }}
  >
    {item.name}
  </Typography>

            <Box
              display="flex"
               
              alignItems="center"

              flexWrap="wrap"
              justifyContent="center"
            >
              <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              flexWrap="wrap"
             alignItems="center"
              >
              <Typography
                variant="body2"
                display="flex"
                marginRight={2}
                color={isExpired(item.expiryDate) ? 'red' : 'green'}
              >
                {getDaysUntilExpiry(item.expiryDate)}
              </Typography>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'darkred',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'red',
                  },
                  mr: 2,
                  minWidth: '80px',
                  display: 'flex',
                }}
                onClick={() => handleOpen(item)}
              >
                Edit
              </Button>
</Box>
              <Box
                display="flex"
                flexDirection="column"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                sx={{ gap: 1}}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'darkred',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'red',
                    },
                    
                    minWidth: '50px',
                  }}
                  onClick={() => addItem(item.name)}
                >
                  +
                </Button>
                <Typography variant="body1" sx={{ mx: 2 }}>
                  {item.quantity}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'darkred',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'red',
                    },
                    
                    minWidth: '50px',
                  }}
                  onClick={() => removeItem(item.name)}
                >
                  -
                </Button>
              </Box>
            </Box>
          </Box>
        ))
      )}
    </Box>
  </Box>

  <Button
    variant="contained"
    sx={{ mb: 5, mt: 2, bgcolor: 'darkred', '&:hover': { bgcolor: 'red' } }}
    onClick={handleGetRecipe}
    disabled={loadingRecipe}
  >
    {loadingRecipe ? <CircularProgress size={24} /> : 'Get Recipe'}
  </Button>
  <RecipeDisplay
    open={isRecipeOpen}
    handleClose={closeRecipe}
    recipe={recipe}
  />
</Box>

  );
}