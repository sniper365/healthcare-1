import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { EventNote, OpenInNew } from '@material-ui/icons';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useTranslator } from '../../hooks/useTranslator';
import { getFormattedDate } from '../../lib/helpers/DateHelper';
import { PatientRecord } from '../../lib/types/PatientRecord';

export function RecordOverview(props: { patientRecord: PatientRecord }) {
  const match = useRouteMatch();
  const history = useHistory();
  const { translate } = useTranslator();
  const openDetailedView = () =>
    history.push(`${match.url}/${props.patientRecord.id}`);

  return (
    <ListItem>
      <ListItemIcon>
        <EventNote />
      </ListItemIcon>
      <ListItemText
        primary={props.patientRecord.title}
        secondary={getFormattedDate(props.patientRecord)}
      />
      <ListItemSecondaryAction>
        <Tooltip title={translate('tooltips.open-record-button')}>
          <IconButton edge="end" onClick={openDetailedView}>
            <OpenInNew />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
