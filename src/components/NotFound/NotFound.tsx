import { Typography } from '@material-ui/core';
import { useTranslator } from '../../hooks/useTranslator';
import './NotFound.css';
import ErrorLogo from './error-404.png';

export function NotFound() {
  const { translate } = useTranslator();
  return (
    <div className="not-found">
      <img src={ErrorLogo} alt="errorfound" style={{width:'300px'}}/>
    </div>
  );
}
