
import { createMuiTheme } from '@material-ui/core/styles';

export default  createMuiTheme({
  palette: {
    primary: {
      main:'#0277BD',
  },
    secondary: {
      main: '#FF1744',
    },
  },
  overrides: {
  	MuiInputLabel: {
  		formControl: {
  			left: 'auto',
  			right: 0,
  		}
  	},
    MuiListItem: {
      root: {
        textAlign: 'start'
      }
    }
  }
});