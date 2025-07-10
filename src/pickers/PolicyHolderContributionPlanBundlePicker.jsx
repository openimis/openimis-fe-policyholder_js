import React, { Component } from "react";
import { withModulesManager, FormattedMessage, SelectInput } from "@openimis/fe-core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { fetchPickerPolicyHolderContributionPlanBundles } from "../actions"

class PolicyHolderContributionPlanBundlePicker extends Component {
    componentDidMount() {
        if (!!this.props.policyHolderId) {
            this.props.fetchPickerPolicyHolderContributionPlanBundles(this.props.modulesManager, [`policyHolder_Id: "${this.props.policyHolderId}"`]);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.policyHolderId !== this.props.policyHolderId && !!this.props.policyHolderId) {
            this.props.fetchPickerPolicyHolderContributionPlanBundles(this.props.modulesManager, [`policyHolder_Id: "${this.props.policyHolderId}"`]);
        }
    }

    render() {
        const { value, onChange, required = false, withNull = false, nullLabel = null, withLabel = true,
            readOnly = false, policyHolderId, pickerPolicyHolderContributionPlanBundles } = this.props;
        let distinctContributionPlanBundles = _.uniqWith(pickerPolicyHolderContributionPlanBundles.map(v => v.contributionPlanBundle), _.isEqual);
        let options = !!policyHolderId ? [
            ...distinctContributionPlanBundles.map(v => ({
                value: v,
                label: `${v.code} - ${v.name}`
            }))
        ] : [];
        if (withNull) {
            options.unshift({
                value: null,
                label: nullLabel || <FormattedMessage module="policyHolder" id="emptyLabel"/>
            })
        }
        return (
            <SelectInput
                module="policyHolder"
                label={withLabel ? "contributionPlanBundle" : null}
                required={required}
                options={options}
                value={!!value ? value : null}
                onChange={onChange}
                readOnly={readOnly}
            />
        )
    }
}

const mapStateToProps = state => ({
    pickerPolicyHolderContributionPlanBundles: state.policyHolder.pickerPolicyHolderContributionPlanBundles
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPickerPolicyHolderContributionPlanBundles }, dispatch);
}

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderContributionPlanBundlePicker));
