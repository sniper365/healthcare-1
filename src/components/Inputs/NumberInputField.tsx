import { isAddress } from '@ethersproject/address';
import { TextField } from '@material-ui/core';
import { useState } from 'react';
import { useTranslator } from '../../hooks/useTranslator';

interface NumberInputFieldProps {
  placeholder: string;
  value: number;
  type: string;
  className?: string;
  onChange?: (newValue: number) => void;
  required?: boolean;
  multiline?: boolean;
  disabled?: boolean;
  address?: boolean;
}

export function NumberInputField(props: NumberInputFieldProps) {
  const [isTouched, setIsTouched] = useState(false);
  const { translate } = useTranslator();
  const hasValue = () => props.value >= 0;
  const getError = () => {
    if (!isTouched) {
      return null;
    }
    if (props.required && !hasValue()) {
      return translate('input-labels.number-input-validation-messages.required');
    }
    if (props.address) {
      return translate('input-labels.number-input-validation-messages.address');
    }
    return null;
  };
  return (
    <TextField
      className={props.className}
      label={props.placeholder}
      value={props.value}
      type={props.type}
      onChange={(e) => props.onChange && props.onChange(Number(e.target.value))}
      error={!!getError()}
      helperText={getError()}
      onBlur={() => setIsTouched(true)}
      multiline={props.multiline}
      rows={props.multiline ? 4 : 1}
      rowsMax={props.multiline ? 10 : 1}
      disabled={props.disabled}
    />
  );
}
