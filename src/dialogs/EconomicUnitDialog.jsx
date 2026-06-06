import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  useTranslations,
  useModulesManager,
  useLocalStorage,
  redirectToSamlLogout,
} from '@openimis/fe-core';
import { saveEconomicUnit } from '../actions';
import { ECONOMIC_UNIT_STORAGE_KEY, MODULE_NAME, REF_PUBLIC_GDPR_PAGE } from '../constants';
import EconomicUnitPicker from '../pickers/EconomicUnitPicker';

const StyledPrimaryButton = styled(Button)(({ theme }) => ({
  ...theme?.dialog?.primaryButton ?? {},
}));

const StyledSecondaryButton = styled(Button)(({ theme }) => ({
  ...theme?.dialog?.secondaryButton ?? {},
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  minWidth: '360px',
}));

const StyledGdprLink = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 'bold',
}));

const EconomicUnitDialog = ({ open, setEconomicUnitDialogOpen, history }) => {
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const { formatMessage, formatMessageWithValues } = useTranslations(
    MODULE_NAME,
    modulesManager
  );
  const {
    policyHolderUsers: economicUnitsWithUser,
    fetchingPolicyHolderUsers: fetchingEconomicUnitsWithUser,
  } = useSelector((store) => store.policyHolder);

  const [value, setValue] = useState(null);
  const [storageEconomicUnit, setStorageEconomicUnit] = useLocalStorage(
    ECONOMIC_UNIT_STORAGE_KEY,
    null
  );

  const onChange = (option) => {
    setValue(option);
  };

  const onConfirm = () => {
    if (value) {
      setStorageEconomicUnit(value);
      dispatch(saveEconomicUnit(value));
      setEconomicUnitDialogOpen(false);
    }
  };

  const onLogoutAction = async (e) => {
    setEconomicUnitDialogOpen(false);
    await redirectToSamlLogout(e);
  };

  const handleGdprDownload = () => {
    const url = modulesManager.getRef(REF_PUBLIC_GDPR_PAGE);

    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} maxWidth='xs'>
      <DialogTitle>{formatMessage('selectEconomicUnit.title')}</DialogTitle>
      <StyledDialogContent>
        <DialogContentText>
          <i>
            {formatMessageWithValues('selectEconomicUnit.description', {
              link: (
                <StyledGdprLink
                  underline='always'
                  color='primary'
                  onClick={handleGdprDownload}
                >
                  {formatMessage('selectEconomicUnit.gdpr')}
                </StyledGdprLink>
              ),
            })}
          </i>
        </DialogContentText>
        <EconomicUnitPicker
          readOnly={false}
          value={value}
          onChange={onChange}
          label={formatMessage('EconomicUnitPicker.label')}
        />
      </StyledDialogContent>
      <DialogActions>
        {!economicUnitsWithUser?.length && (
          <StyledPrimaryButton
            onClick={onLogoutAction}
            disabled={
              fetchingEconomicUnitsWithUser || economicUnitsWithUser?.length
            }
          >
            {formatMessage('selectEconomicUnit.logout')}
          </StyledPrimaryButton>
        )}
        <StyledPrimaryButton
          onClick={onConfirm}
          autoFocus
          disabled={
            fetchingEconomicUnitsWithUser || !economicUnitsWithUser?.length
          }
        >
          {formatMessage('selectEconomicUnit.confirm')}
        </StyledPrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default EconomicUnitDialog;
