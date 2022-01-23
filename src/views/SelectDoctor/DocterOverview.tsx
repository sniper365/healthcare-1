import {
  Chip,
  Fab,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { Add, Fingerprint, HowToReg, List, Wc,OpenInNew } from '@material-ui/icons';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useTranslator } from '../../hooks/useTranslator';
import { DoctorInfo } from '../../lib/types/DoctorInfo';
import './DoctorOverview.css';

interface DoctorOverviewProps {
  doctorInfo: DoctorInfo;
}

export function DoctorOverview(props: DoctorOverviewProps) {
  const history = useHistory();
  const match = useRouteMatch();
  const { translate } = useTranslator();

  console.info('inselect url',match.url);
  console.info('inselect',props.doctorInfo);
  // const onAdd = () => history.push(`${match.url}/new/${props.doctorInfo.id}`);
  const onView = () => history.push(`${match.url}/${props.doctorInfo.id}`);

  return (
    <ListItem>
      <ListItemIcon>
        <HowToReg color="primary" />
      </ListItemIcon>
      <ListItemText
        primary={props.doctorInfo.name}
        secondary={<DoctorSecondaryInfo doctorInfo={props.doctorInfo} />}
      />
      <ListItemSecondaryAction>
        {/* <Tooltip title={translate('tooltips.add-record')} placement="left">
          <Fab
            className="doctor-item-action"
            onClick={onAdd}
            color="primary"
            size="small"
          >
            <Add />
          </Fab>
        </Tooltip> */}
        <Tooltip title={translate('tooltips.view-records')} placement="right">
          <Fab
            className="doctor-item-action"
            onClick={onView}
            color="primary"
            size="small"
          >
            <OpenInNew />
          </Fab>          
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function DoctorSecondaryInfo(props: DoctorOverviewProps) {
  return (
    <div className="doctor-secondary-info">
      <Chip
        size="small"
        icon={<Fingerprint />}
        label={props.doctorInfo.nationalId}
        color="primary"
        variant="outlined"
      />
      <Chip
        size="small"
        icon={<Wc />}
        label={props.doctorInfo.gender}
        color="primary"
        variant="outlined"
      />
    </div>
  );
}
