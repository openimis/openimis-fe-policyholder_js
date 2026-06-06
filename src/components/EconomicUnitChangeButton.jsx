import React from 'react';
import { useSelector } from 'react-redux';

import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { GetIconComponent } from "@openimis/fe-core";
const PinDrop = GetIconComponent("PinDrop")

import { useTranslations, useModulesManager } from '@openimis/fe-core';
import { MODULE_NAME, RIGHT_VIEW_EU_MODAL } from '../constants';

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const EconomicUnitChangeButton = ({ onEconomicDialogOpen }) => {
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
    <StyledButton
      variant='contained'
      color='secondary'
      startIcon={<PinDrop />}
      onClick={() => onEconomicDialogOpen()}
    >
      <strong> {formatMessage('EconomicUnitChangeButton.label')} </strong>
    </StyledButton>
  );
};

export default EconomicUnitChangeButton;
