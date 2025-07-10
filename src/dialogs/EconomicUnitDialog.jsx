import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useTranslations,
  useModulesManager,
  redirectToSamlLogout,
} from '@openimis/fe-core';
import { saveEconomicUnit } from '../actions';
import { ECONOMIC_UNIT_STORAGE_KEY, MODULE_NAME, REF_PUBLIC_GDPR_PAGE } from '../constants';
import EconomicUnitPicker from '../pickers/EconomicUnitPicker';

const useStyles = makeStyles((theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
  dialogWidth: {
    minWidth: '360px',
  },
  gdprLink: {
    cursor: 'pointer',
    fontWeight: 'bold',
  },
}));

const EconomicUnitDialog = ({ open, setEconomicUnitDialogOpen, history }) => {
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage, formatMessageWithValues } = useTranslations(
    MODULE_NAME,
    modulesManager
  );
  const {
    policyHolderUsers: economicUnitsWithUser,
    fetchingPolicyHolderUsers: fetchingEconomicUnitsWithUser,
  } = useSelector((store) => store.policyHolder);

  const [value, setValue] = useState(null);
  const storageEconomicUnit = localStorage.getItem(ECONOMIC_UNIT_STORAGE_KEY);

  const onChange = (option) => {
    setValue(option);
  };

  const onConfirm = () => {
    if (value) {
      localStorage.setItem(ECONOMIC_UNIT_STORAGE_KEY, JSON.stringify(value));
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

  useEffect(() => {
    const handleLocalStorageChange = () => {
      if (!storageEconomicUnit) {
        setEconomicUnitDialogOpen(true);
      }
    };

    window.addEventListener('storage', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleLocalStorageChange);
    };
  }, []);

  return (
    <Dialog open={open} maxWidth='xs'>
      <DialogTitle>{formatMessage('selectEconomicUnit.title')}</DialogTitle>
      <DialogContent className={classes.dialogWidth}>
        <DialogContentText>
          <i>
            {formatMessageWithValues('selectEconomicUnit.description', {
              link: (
                <Link
                  className={classes.gdprLink}
                  underline='always'
                  color='primary'
                  onClick={handleGdprDownload}
                >
                  {formatMessage('selectEconomicUnit.gdpr')}
                </Link>
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
      </DialogContent>
      <DialogActions>
        {!economicUnitsWithUser?.length && (
          <Button
            onClick={onLogoutAction}
            className={classes.primaryButton}
            disabled={
              fetchingEconomicUnitsWithUser || economicUnitsWithUser?.length
            }
          >
            {formatMessage('selectEconomicUnit.logout')}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          autoFocus
          className={classes.primaryButton}
          disabled={
            fetchingEconomicUnitsWithUser || !economicUnitsWithUser?.length
          }
        >
          {formatMessage('selectEconomicUnit.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EconomicUnitDialog;
