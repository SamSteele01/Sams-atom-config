import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
// import { withStyles } from '@material-ui/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Login from './Login';
import Register from './Register';
import EnterCode from './EnterCode';

const useStyles = makeStyles(theme => ({
  // const styles = theme => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    // fontWeight: theme.typography.fontWeightRegular,
    // marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      // fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},
  typography: {
    // padding: theme.spacing.unit * 3,
  },
}));

function TabsMUI(props) {
  const classes = useStyles();
  const { complex, setComplex } = props;
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
      >
        <Tab
          disableRipple
          classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          label="Login"
        />
        <Tab
          disableRipple
          classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
          label="Register"
        />
      </Tabs>
      {complex === 'login' && (
        <div>
          {value === 0 && <Login setComplex={setComplex} />}
          {value === 1 && <Register setComplex={setComplex} />}
        </div>
      )}
      {complex === 'code' && <EnterCode setComplex={setComplex} />}
    </div>
  );
}
TabsMUI.propTypes = {
  complex: PropTypes.oneOf(['login', 'code', 'merchant']).isRequired,
  setComplex: PropTypes.func.isRequired,
};

export default TabsMUI;
// export default withStyles(styles)(TabsMUI);
