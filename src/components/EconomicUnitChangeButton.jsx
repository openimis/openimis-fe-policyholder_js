import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { PinDrop } from '@material-ui/icons';

import { useTranslations, useModulesManager } from '@openimis/fe-core';
import { MODULE_NAME, RIGHT_VIEW_EU_MODAL } from '../constants';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

const EconomicUnitChangeButton = ({ onEconomicDialogOpen }) => {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const rights = useSelector((store) => store.core.user?.i_user?.rights ?? []);
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const economicUnitConfig = modulesManager.getConf(
    'fe-core',
    'App.economicUnitConfig',
    false
  );

  if (!economicUnitConfig || !rights.includes(RIGHT_VIEW_EU_MODAL)) return null;

  return (
    <Button
      variant='contained'
      color='secondary'
      startIcon={<PinDrop />}
      className={classes.button}
      onClick={() => onEconomicDialogOpen()}
    >
      <strong> {formatMessage('EconomicUnitChangeButton.label')} </strong>
    </Button>
  );
};

export default EconomicUnitChangeButton;
