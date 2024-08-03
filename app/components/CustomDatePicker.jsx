import React from 'react';
import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme to override default MUI styles
const customTheme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: 'white', // Text color of each day
          backgroundColor: '#333', // Background color of each day
          '&:hover': {
            backgroundColor: 'darkred', // Background color on hover
          },
          '&.Mui-selected': {
            backgroundColor: 'darkred !important', // Background color when selected
            color: 'white', // Text color when selected
            '&:hover': {
              backgroundColor: 'darkred !important', // Darker background on hover when selected
            },
          },
          '&.MuiDay-current': {
            backgroundColor: 'darkred !important', // Background color for today's date
            color: 'white', // Text color for today's date
            '&:hover': {
              backgroundColor: 'darkred !important', // Background color on hover for today's date
            },
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          backgroundColor: '#222', // Background color of calendar header
          color: 'white',
        },
      },
    },
    MuiPickersCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: '#222', // Background color of main calendar area
        },
      },
    },
    MuiPickersStaticWrapper: {
      styleOverrides: {
        root: {
          backgroundColor: '#222', // Background color of static wrapper
          color: 'white',
        },
      },
    },
    MuiPickersBasePicker: {
      styleOverrides: {
        pickerView: {
          backgroundColor: '#222', // Background color of the base picker view
          color: 'white',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#222', // Background color of paper component
          color: 'white',
        },
      },
    },
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#333', // Background color of the toolbar
          color: 'white', // Text color in the toolbar
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'white', // Text color for typography components
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'white', // Color of icon buttons
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#222', // Background color of the input field
          '& fieldset': {
            borderColor: 'white !important', // Force border color
            borderWidth: '1px',
            borderStyle: 'solid',
          },
          '&:hover fieldset': {
            borderColor: 'white !important', // Force border color on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white !important', // Force border color when focused
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white', // Label color
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: 'white', // Input text color
        },
        input: {
          color: 'white', // Input text color
          '&::placeholder': {
            color: 'white', // Placeholder text color
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: 'white', // Helper text color
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          color: 'white', // Form control color
        },
      },
    },
  },
});

// Custom DatePicker component
const CustomDatePicker = ({ newExpiryDate, setNewExpiryDate }) => {
  return (
    <ThemeProvider theme={customTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Expiry Date"
          value={newExpiryDate}
          onChange={(date) => setNewExpiryDate(date)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: '#222',
                borderRadius: '10px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white !important', // Force border color
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white !important', // Force border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white !important', // Force border color when focused
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white', // Input text color
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'white', // Placeholder text color
                },
              }}
              InputLabelProps={{
                style: { color: 'white' }, // Label color
              }}
            />
          )}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomDatePicker;
