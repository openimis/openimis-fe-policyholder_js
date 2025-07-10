import React, { Component, Fragment } from "react";
import { Tab, Grid, Typography } from "@material-ui/core";
import { formatMessage, PublishedComponent, FormattedMessage } from "@openimis/fe-core";
import {
    POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE,
    RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH,
    RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_CREATE,
    RIGHT_PORTALPOLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH
} from "../constants";
import PolicyHolderContributionPlanBundleSearcher from "./PolicyHolderContributionPlanBundleSearcher";
import CreatePolicyHolderContributionPlanBundleDialog from "../dialogs/CreatePolicyHolderContributionPlanBundleDialog";
import { connect } from "react-redux";

class PolicyHolderContributionPlanBundlesTabLabel extends Component {
    render() {
        const { intl, rights, onChange, disabled, tabStyle, isSelected } = this.props;
        return (
            (rights.includes(RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH) ||
                rights.includes(RIGHT_PORTALPOLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH)) && (
                <Tab
                    onChange={onChange}
                    disabled={disabled}
                    className={tabStyle(POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE)}
                    selected={isSelected(POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE)}
                    value={POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE}
                    label={formatMessage(intl, "policyHolder", "contributionPlanBundle.label")}
                />
            )
        )
    }
}

class PolicyHolderContributionPlanBundlesTab extends Component {
    state = {
        reset: 0,
    }

    onSave = () => {
        this.setState(state => ({
            reset: state.reset + 1
        }));
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.created && this.props.created) {
          this.onSave();
        }
        if (!prevProps.updated && this.props.updated) {
          this.onSave();
        }
        if (!prevProps.replaced && this.props.replaced) {
          this.onSave();
        }
      }

    render() {
        const { rights, value, isTabsEnabled, policyHolder } = this.props;
        return (
            (rights.includes(RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH) ||
                rights.includes(RIGHT_PORTALPOLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH)) && (
                <PublishedComponent
                    pubRef="policyHolder.TabPanel"
                    module="policyHolder"
                    index={POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE}
                    value={value}
                >
                    {isTabsEnabled && (
                        <Fragment>
                            {rights.includes(RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_CREATE) && (
                                <Grid container justify="flex-end" alignItems="center" spacing={1}>
                                    <Grid item>
                                        <Typography>
                                            <FormattedMessage module="policyHolder" id="policyHolderContributionPlanBundle.createPolicyHolderContributionPlanBundle" />
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <CreatePolicyHolderContributionPlanBundleDialog
                                            policyHolder={policyHolder}
                                            onSave={() => {}}
                                            tabView
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            <PolicyHolderContributionPlanBundleSearcher
                                policyHolder={policyHolder}
                                rights={rights}
                                reset={this.state.reset}
                                onSave={this.onSave}
                            />
                        </Fragment>
                    )}
                </PublishedComponent>
            )
        )
    }
}

const mapStateToProps = (state) => ({
    created: !!state.policyHolder ? state.policyHolder.policyholderCreatePolicyholdercontributionplanbundleResp : false,
    updated: !!state.policyHolder ? state.policyHolder.policyholderReplacePolicyholdercontributionplanbundleResp : false,
    replaced: !!state.policyHolder ? state.policyHolder.policyholderUpdatePolicyholdercontributionplanbundleResp : false,
});
  

const PolicyHolderContributionPlanBundlesTabPanel = connect(mapStateToProps)(PolicyHolderContributionPlanBundlesTab) 

export {
    PolicyHolderContributionPlanBundlesTabLabel,
    PolicyHolderContributionPlanBundlesTabPanel
}
