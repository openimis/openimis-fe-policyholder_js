import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TextField } from '@material-ui/core';

import { useModulesManager, Autocomplete } from '@openimis/fe-core';
import { fetchPolicyHolderUsers as fetchEconomicUnits } from '../actions';

const EconomicUnitPicker = ({
  onChange,
  label = ' ',
  readOnly = false,
  required,
  value,
}) => {
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const {
    policyHolderUsers: economicUnitsWithUser,
    fetchingPolicyHolderUsers: fetchingEconomicUnitsWithUser,
    errorPolicyHolderUsers: errorEconomicUnitsWithUser,
  } = useSelector((store) => store.policyHolder);
  const userId = useSelector((store) => store.core.user?.id);

  const economicUnits = economicUnitsWithUser.map(
    (economicUnit) => economicUnit.policyHolder
  );

  const fetchAvailableEconomicUnits = async () => {
    try {
      const filters = ['isDeleted: false', `user_Id: "${userId}"`];
      await dispatch(fetchEconomicUnits(modulesManager, filters));
    } catch (error) {
      console.error('Failed to fetch economic units:', error);
    }
  };

  useEffect(() => {
    fetchAvailableEconomicUnits();
  }, []);

  useEffect(() => {
    if (economicUnits.length === 1) {
      onChange(economicUnits[0]);
    }
  }, [economicUnits]);

  return (
    <Autocomplete
      error={errorEconomicUnitsWithUser}
      readOnly={readOnly}
      options={economicUnits}
      isLoading={fetchingEconomicUnitsWithUser}
      value={value}
      getOptionLabel={(economicUnit) =>
        `${economicUnit.code} - ${economicUnit.tradeName}`
      }
      onChange={(value) => onChange(value)}
      onInputChange={() => {}}
      renderInput={(inputProps) => (
        <TextField {...inputProps} required={required} label={label} />
      )}
    />
  );
};

export default EconomicUnitPicker;
