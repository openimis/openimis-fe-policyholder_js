import React, { Component } from "react"
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { withModulesManager, formatMessage, TextInput, PublishedComponent, decodeId } from "@openimis/fe-core";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import { GREATER_OR_EQUAL_LOOKUP, LESS_OR_EQUAL_LOOKUP, STARTS_WITH_LOOKUP, DATE_TO_DATETIME_SUFFIX } from "../constants"
import PolicyHolderContributionPlanBundlePicker from "../pickers/PolicyHolderContributionPlanBundlePicker";

const StyledForm = styled('div')(({ theme }) => ({
  padding: 0
}));

const StyledItem = styled('div')(({ theme }) => ({
  padding: theme.spacing(1)
}));

class PolicyHolderInsureeFilter extends Component {
    _filterValue = k => {
        const { filters } = this.props;
        return !!filters[k] ? filters[k].value : null
    }

    _filterTextFieldValue = k => {
        const { filters } = this.props;
        return !!filters[k] ? filters[k].value : "";
    }

    _onChangeFilter = (k, v) => {
        this.props.onChangeFilters([
            {
                id: k,
                value: v,
                filter: `${k}: ${v}`
            }
        ])
    }

    _onChangeStringFilter = (k, v, lookup) => {
        this.props.onChangeFilters([
            {
                id: k,
                value: v,
                filter: `${k}_${lookup}: "${v}"`
            }
        ])
    }

    _onChangeDateFilter = (k, v, lookup) => {
        this.props.onChangeFilters([
            {
                id: k,
                value: v,
                filter: `${k}_${lookup}: "${v}${DATE_TO_DATETIME_SUFFIX}"`
            }
        ])
    }

    render() {
        const { intl, onChangeFilters, policyHolder } = this.props;
        return (
            <Grid container component={StyledForm}>
                <Grid size={3} component={StyledItem}>
                    <TextInput
                        module="policyHolder" 
                        label="insureeCHFID"
                        value={this._filterTextFieldValue('insuree_ChfId')}
                        onChange={v => this._onChangeStringFilter('insuree_ChfId', v, STARTS_WITH_LOOKUP)}
                    />
                </Grid>
                <Grid size={3} component={StyledItem}>
                    <PolicyHolderContributionPlanBundlePicker
                        withNull
                        nullLabel={formatMessage(intl, "policyHolder", "policyHolderContributionPlanBundle.any")}
                        policyHolderId={!!policyHolder && decodeId(policyHolder.id)}
                        value={this._filterValue('contributionPlanBundle_Id')}
                        onChange={v => onChangeFilters([{
                            id: 'contributionPlanBundle_Id',
                            value: v,
                            filter: `contributionPlanBundle_Id: "${!!v && decodeId(v.id)}"`
                        }])}
                    />
                </Grid>
                <Grid size={2} component={StyledItem}>
                    <PublishedComponent
                        pubRef="core.DatePicker"
                        module="policyHolder"
                        label="dateValidFrom"
                        value={this._filterValue('dateValidFrom')}
                        onChange={v => this._onChangeDateFilter('dateValidFrom', v, GREATER_OR_EQUAL_LOOKUP)}
                    />
                </Grid>
                <Grid size={2} component={StyledItem}>
                    <PublishedComponent
                        pubRef="core.DatePicker"
                        module="policyHolder"
                        label="dateValidTo"
                        value={this._filterValue('dateValidTo')}
                        onChange={v => this._onChangeDateFilter('dateValidTo', v, LESS_OR_EQUAL_LOOKUP)}
                    />
                </Grid>
                <Grid size={2} component={StyledItem}>
                    <FormControlLabel
                        control={<Checkbox 
                            checked={!!this._filterValue('isDeleted')}
                            onChange={event => this._onChangeFilter('isDeleted', event.target.checked)}
                            name="isDeleted" 
                        />}
                        label={formatMessage(intl, "policyHolder", "policyHolderInsuree.isDeleted")}
                    />
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    policyHolder: !!state.policyHolder.policyHolder ? state.policyHolder.policyHolder : null
});

export { StyledForm };
export default withModulesManager(injectIntl(connect(mapStateToProps, null)(PolicyHolderInsureeFilter)));
