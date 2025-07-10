import React, { Component, Fragment } from "react";
import { Tab, Grid, Typography } from "@material-ui/core";
import { formatMessage, PublishedComponent, FormattedMessage } from "@openimis/fe-core";
import {
    RIGHT_POLICYHOLDERINSUREE_CREATE,
    RIGHT_POLICYHOLDERINSUREE_SEARCH,
    RIGHT_PORTALPOLICYHOLDERINSUREE_CREATE,
    RIGHT_PORTALPOLICYHOLDERINSUREE_SEARCH
} from "../constants";
import PolicyHolderInsureeSearcher from "./PolicyHolderInsureeSearcher";
import { POLICYHOLDERINSUREE_TAB_VALUE } from "../constants"
import CreatePolicyHolderInsureeDialog from "../dialogs/CreatePolicyHolderInsureeDialog";
import { connect } from "react-redux";

class PolicyHolderInsureesTabLabel extends Component {
    render() {
        const { intl, rights, onChange, disabled, tabStyle, isSelected } = this.props;
        return (
            (rights.includes(RIGHT_POLICYHOLDERINSUREE_SEARCH) ||
                rights.includes(RIGHT_PORTALPOLICYHOLDERINSUREE_SEARCH)) && (
                <Tab
                    onChange={onChange}
                    disabled={disabled}
                    className={tabStyle(POLICYHOLDERINSUREE_TAB_VALUE)}
                    selected={isSelected(POLICYHOLDERINSUREE_TAB_VALUE)}
                    value={POLICYHOLDERINSUREE_TAB_VALUE}
                    label={formatMessage(intl, "policyHolder", "policyHolderInsuree.label")}
                />
            )
        )
    }
}

class PolicyHolderInsureesTab extends Component {
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
            (rights.includes(RIGHT_POLICYHOLDERINSUREE_SEARCH) ||
                rights.includes(RIGHT_PORTALPOLICYHOLDERINSUREE_SEARCH)) && (
                <PublishedComponent
                    pubRef="policyHolder.TabPanel"
                    module="policyHolder"
                    index={POLICYHOLDERINSUREE_TAB_VALUE}
                    value={value}
                >
                    {isTabsEnabled ? (
                        <Fragment>
                            {(rights.includes(RIGHT_POLICYHOLDERINSUREE_CREATE) ||
                                rights.includes(RIGHT_PORTALPOLICYHOLDERINSUREE_CREATE)) && (
                                <Grid
                                    container
                                    justify="flex-end"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Typography>
                                            <FormattedMessage
                                                module="policyHolder"
                                                id="policyHolderInsuree.createPolicyHolderInsuree"
                                            />
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <CreatePolicyHolderInsureeDialog
                                            policyHolder={policyHolder}
                                            onSave={this.onSave}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            <PolicyHolderInsureeSearcher
                                policyHolder={policyHolder}
                                rights={rights}
                                reset={this.state.reset}
                                onSave={this.onSave}
                            />
                        </Fragment>
                    ) : (
                        <FormattedMessage
                            module="policyHolder"
                            id="policyHolderInsuree.tabDisabledError"
                        />
                    )}
                </PublishedComponent>
            )
        );
    }
}

const mapStateToProps = (state) => ({
    created: !!state.policyHolder ? state.policyHolder.policyholderCreatePolicyholderinsureeResp : false,
    updated: !!state.policyHolder ? state.policyHolder.policyholderUpdatePolicyholderinsureeResp : false,
    replaced: !!state.policyHolder ? state.policyHolder.policyholderReplacePolicyholderinsureeResp : false,
});
  
const PolicyHolderInsureesTabPanel = connect(mapStateToProps)(PolicyHolderInsureesTab) 


export {
    PolicyHolderInsureesTabLabel,
    PolicyHolderInsureesTabPanel
}
