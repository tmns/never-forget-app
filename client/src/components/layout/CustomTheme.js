import { createMuiTheme } from '@material-ui/core/styles';

const CustomTheme = createMuiTheme({
  overrides: {
    MuiIconButton: {
      root: {
        padding: 8
      }
    }
  },
  palette: {
    primary: { main: '#1c1f2b' }, // or maybe 303030 ??
    secondary: { main: '#C51162' }  
  }
});

export default CustomTheme;