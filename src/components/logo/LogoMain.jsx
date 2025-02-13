import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
// project-import
import { ThemeMode } from 'config';
import logo from '../../assets/images/icons/logo.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain({ reverse }) {
  const theme = useTheme();
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Mantis" width="100" />
     *
     */
    <>
      <img src={logo} alt="Signalify" width="100" />
    </>
  );
}

LogoMain.propTypes = { reverse: PropTypes.bool };
