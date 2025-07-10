import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { FormattedMessage, formatMessageWithValues, PublishedComponent } from "@openimis/fe-core";
import { Fab, Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { createPolicyHolderContributionPlanBundle } from "../actions";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH } from "../constants"

const styles = theme => ({
    item: theme.paper.item
});

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
        const { classes } = this.props;
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
                        <Grid container direction="column" className={classes.item}>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="contributionPlan.ContributionPlanBundlePicker"
                                    withNull={false}
                                    required
                                    value={!!policyHolderContributionPlanBundle.contributionPlanBundle && policyHolderContributionPlanBundle.contributionPlanBundle}
                                    onChange={v => this.updateAttribute('contributionPlanBundle', v)}
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidFrom"
                                    required
                                    onChange={v => this.updateAttribute('dateValidFrom', v)}
                                />
                            </Grid>
                            <Grid item className={classes.item}>
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

export default injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(CreatePolicyHolderContributionPlanBundleDialog))));
