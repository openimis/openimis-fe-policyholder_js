import React, { Component, Fragment } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { FormattedMessage, formatMessageWithValues, PublishedComponent } from "@openimis/fe-core";
import { Fab, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { createPolicyHolderContributionPlanBundle } from "../actions";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH } from "../constants"

const StyledItem = styled('div')(({ theme }) => ({
  ...theme.paper.item
}));

class CreatePolicyHolderContributionPlanBundleDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            policyHolderContributionPlanBundle: {}
        }
    }

    handleOpen = () => {
        this.setState((_, props) => ({
            open: true,
            policyHolderContributionPlanBundle: {
                policyHolder: props.policyHolder
            }
        }));
    };

    handleClose = () => {
        this.setState({ open: false, policyHolderContributionPlanBundle: {} });
    };

    handleSave = () => {
        this.props.createPolicyHolderContributionPlanBundle(
            this.state.policyHolderContributionPlanBundle,
            formatMessageWithValues(
                this.props.intl,
                "policyHolder",
                "CreatePolicyHolderContributionPlanBundle.mutationLabel",
                {
                    code: this.props.policyHolder.code,
                    tradeName: this.props.policyHolder.tradeName
                }
            ).slice(ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH)
        );
        this.props.onSave();
        this.handleClose();
    };

    updateAttribute = (attribute, value) => {
        this.setState(state => ({
            policyHolderContributionPlanBundle: {
                ...state.policyHolderContributionPlanBundle,
                [attribute]: value
            }
        }));
    }

    canSave = () => {
        const { policyHolderContributionPlanBundle } = this.state;
        return !!policyHolderContributionPlanBundle.policyHolder
            && !!policyHolderContributionPlanBundle.contributionPlanBundle
            && !!policyHolderContributionPlanBundle.dateValidFrom;
    }

    render() {
        const { open, policyHolderContributionPlanBundle } = this.state;
        return (
            <Fragment>
                <Fab
                    size="small"
                    color="primary"
                    onClick={this.handleOpen}>
                    <AddIcon />
                </Fab>
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        <FormattedMessage module="policyHolder" id="policyHolderContributionPlanBundle.createPolicyHolderContributionPlanBundle" />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" component={StyledItem}>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="contributionPlan.ContributionPlanBundlePicker"
                                    withNull={false}
                                    required
                                    value={!!policyHolderContributionPlanBundle.contributionPlanBundle && policyHolderContributionPlanBundle.contributionPlanBundle}
                                    onChange={v => this.updateAttribute('contributionPlanBundle', v)}
                                />
                            </Grid>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidFrom"
                                    required
                                    onChange={v => this.updateAttribute('dateValidFrom', v)}
                                />
                            </Grid>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidTo"
                                    onChange={v => this.updateAttribute('dateValidTo', v)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="outlined">
                            <FormattedMessage module="policyHolder" id="dialog.cancel" />
                        </Button>
                        <Button onClick={this.handleSave} disabled={!this.canSave()} variant="contained" color="primary" autoFocus>
                            <FormattedMessage module="policyHolder" id="dialog.replace" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createPolicyHolderContributionPlanBundle }, dispatch);
};

export { StyledItem };
export default injectIntl(connect(null, mapDispatchToProps)(CreatePolicyHolderContributionPlanBundleDialog));
