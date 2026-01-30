import React, { Component, Fragment } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { FormattedMessage, formatMessageWithValues, PublishedComponent, formatMessage } from "@openimis/fe-core";
import { Grid, Tooltip, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { updatePolicyHolderContributionPlanBundle, replacePolicyHolderContributionPlanBundle } from "../actions";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH } from "../constants"

const StyledItem = styled('div')(({ theme }) => ({
  ...theme.paper.item
}));

class UpdatePolicyHolderContributionPlanBundleDialog extends Component {
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
            policyHolderContributionPlanBundle: props.policyHolderContributionPlanBundle
        }));
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSave = () => {
        const { intl, policyHolder, isReplacing = false, onSave,
            updatePolicyHolderContributionPlanBundle, replacePolicyHolderContributionPlanBundle } = this.props;
        if (isReplacing) {
            replacePolicyHolderContributionPlanBundle(
                this.state.policyHolderContributionPlanBundle,
                formatMessageWithValues(
                    intl,
                    "policyHolder",
                    "ReplacePolicyHolderContributionPlanBundle.mutationLabel",
                    {
                        code: policyHolder.code,
                        tradeName: policyHolder.tradeName
                    }
                ).slice(ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH)
            );
        } else {
            updatePolicyHolderContributionPlanBundle(
                this.state.policyHolderContributionPlanBundle,
                formatMessageWithValues(
                    intl,
                    "policyHolder",
                    "UpdatePolicyHolderContributionPlanBundle.mutationLabel",
                    {
                        code: policyHolder.code,
                        tradeName: policyHolder.tradeName
                    }
                ).slice(ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH)
            );
        }
        onSave();
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
        const { intl, disabled, isReplacing = false } = this.props;
        const { open, policyHolderContributionPlanBundle } = this.state;
        return (
            <Fragment>
                {isReplacing ? (
                    <Tooltip title={formatMessage(intl, "policyHolder", "replaceButton.tooltip")}>
                        <div>
                            <IconButton
                                onClick={this.handleOpen}
                                disabled={disabled}>
                                <NoteAddIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                ) : (
                    <Tooltip title={formatMessage(intl, "policyHolder", "editButton.tooltip")}>
                        <div>
                            <IconButton
                                onClick={this.handleOpen}
                                disabled={disabled}>
                                <EditIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                )}
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        {isReplacing ? (
                            <FormattedMessage module="policyHolder" id="policyHolderContributionPlanBundle.dialog.replace.title" />
                        ) : (
                            <FormattedMessage module="policyHolder" id="policyHolderContributionPlanBundle.dialog.edit.title" />
                        )}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" component={StyledItem}>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="contributionPlan.ContributionPlanBundlePicker"
                                    required
                                    value={!!policyHolderContributionPlanBundle.contributionPlanBundle && policyHolderContributionPlanBundle.contributionPlanBundle}
                                    onChange={v => this.updateAttribute('contributionPlanBundle', v)}
                                    readOnly={!isReplacing}
                                />
                            </Grid>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidFrom"
                                    required
                                    value={!!policyHolderContributionPlanBundle.dateValidFrom && policyHolderContributionPlanBundle.dateValidFrom}
                                    onChange={v => this.updateAttribute('dateValidFrom', v)}
                                    readOnly={!isReplacing}
                                />
                            </Grid>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidTo"
                                    value={!!policyHolderContributionPlanBundle.dateValidTo && policyHolderContributionPlanBundle.dateValidTo}
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
                            {isReplacing ? (
                                <FormattedMessage module="policyHolder" id="dialog.replace" />
                            ) : (
                                <FormattedMessage module="policyHolder" id="dialog.update" />
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updatePolicyHolderContributionPlanBundle, replacePolicyHolderContributionPlanBundle }, dispatch);
};

export { StyledItem };
export default injectIntl(connect(null, mapDispatchToProps)(UpdatePolicyHolderContributionPlanBundleDialog));
