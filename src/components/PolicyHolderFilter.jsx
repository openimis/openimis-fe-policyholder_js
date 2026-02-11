import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import {
  withModulesManager,
  formatMessage,
  TextInput,
  PublishedComponent,
  GRID_RESPONSIVE_STANDARD,
  GRID_RESPONSIVE_SMALL,
} from '@openimis/fe-core';
import { Grid, FormControlLabel, Checkbox } from '@mui/material';
import {
  GREATER_OR_EQUAL_LOOKUP,
  LESS_OR_EQUAL_LOOKUP,
  DATE_TO_DATETIME_SUFFIX,
  CONTAINS_LOOKUP,
} from '../constants';

const StyledForm = styled('div')(({ theme }) => ({
  padding: 0,
}));

const StyledItem = styled('div')(({ theme }) => ({
  padding: theme?.spacing?.(1),
}));

class PolicyHolderFilter extends Component {
  _filterValue = (k) => {
    const { filters } = this.props;
    return !!filters[k] ? filters[k].value : null;
  };

  _filterTextFieldValue = (key) => {
    const { filters } = this.props;
    return !!filters[key] ? filters[key].value : '';
  };

  _onChangeFilter = (k, v) => {
    this.props.onChangeFilters([
      {
        id: k,
        value: v,
        filter: `${k}: ${v}`,
      },
    ]);
  };

  _onChangeStringFilter = (k, v, lookup) => {
    this.props.onChangeFilters([
      {
        id: k,
        value: v,
        filter: `${k}_${lookup}: "${v}"`,
      },
    ]);
  };

  _onChangeDateFilter = (k, v, lookup) => {
    this.props.onChangeFilters([
      {
        id: k,
        value: v,
        filter: `${k}_${lookup}: "${v}${DATE_TO_DATETIME_SUFFIX}"`,
      },
    ]);
  };

  render() {
    const { intl, filters, onChangeFilters } = this.props;
    return (
      <Grid container component={StyledForm}>
        <Grid size={12}>
          <PublishedComponent
            pubRef='location.DetailedLocationFilter'
            withNull={true}
            filters={filters}
            onChangeFilters={onChangeFilters}
            anchor='parentLocation'
            split
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
          <TextInput
            module='policyHolder'
            label='code'
            value={this._filterTextFieldValue('code')}
            onChange={(v) =>
              this._onChangeStringFilter('code', v, CONTAINS_LOOKUP)
            }
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
          <TextInput
            module='policyHolder'
            label='tradeName'
            value={this._filterTextFieldValue('tradeName')}
            onChange={(v) =>
              this._onChangeStringFilter('tradeName', v, CONTAINS_LOOKUP)
            }
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
          <PublishedComponent
            pubRef='policyHolder.LegalFormPicker'
            module='policyHolder'
            label='legalForm'
            withNull
            nullLabel={formatMessage(intl, 'policyHolder', 'any')}
            value={this._filterValue('legalForm')}
            onChange={(v) => this._onChangeFilter('legalForm', v)}
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
          <PublishedComponent
            pubRef='policyHolder.ActivityCodePicker'
            module='policyHolder'
            label='activityCode'
            withNull
            nullLabel={formatMessage(intl, 'policyHolder', 'any')}
            value={this._filterValue('activityCode')}
            onChange={(v) => this._onChangeFilter('activityCode', v)}
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
          <PublishedComponent
            pubRef='core.DatePicker'
            module='policyHolder'
            label='dateValidFrom'
            value={this._filterValue('dateValidFrom')}
            onChange={(v) =>
              this._onChangeDateFilter(
                'dateValidFrom',
                v,
                GREATER_OR_EQUAL_LOOKUP,
              )
            }
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
          <PublishedComponent
            pubRef='core.DatePicker'
            module='policyHolder'
            label='dateValidTo'
            value={this._filterValue('dateValidTo')}
            onChange={(v) =>
              this._onChangeDateFilter('dateValidTo', v, LESS_OR_EQUAL_LOOKUP)
            }
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_SMALL} component={StyledItem}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!this._filterValue('isDeleted')}
                onChange={(event) =>
                  this._onChangeFilter('isDeleted', event.target.checked)
                }
                name='isDeleted'
              />
            }
            label={formatMessage(intl, 'policyHolder', 'isDeleted')}
          />
        </Grid>
      </Grid>
    );
  }
}

export { StyledForm };
export default withModulesManager(injectIntl(PolicyHolderFilter));
