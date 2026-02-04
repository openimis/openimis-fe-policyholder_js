import React, { Component, Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import {
    FormattedMessage,
    formatMessageWithValues,
    PublishedComponent,
    decodeId,
    Contributions
} from "@openimis/fe-core";
import { Fab, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { createPolicyHolderInsuree } from "../actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PolicyHolderContributionPlanBundlePicker from "../pickers/PolicyHolderContributionPlanBundlePicker";
import {
    ZERO,
    MAX_CLIENTMUTATIONLABEL_LENGTH,
    POLICYHOLDERINSUREE_CALCULATION_CONTRIBUTION_KEY,
    POLICYHOLDERINSUREE_CLASSNAME,
    RIGHT_CALCULATION_WRITE
} from "../constants";

const StyledItem = styled('div')(({ theme }) => ({
  ...theme?.paper?.item ?? {}
}));

class CreatePolicyHolderInsureeDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            policyHolderInsuree: {},
            jsonExtValid: true
        }
    }

    handleOpen = () => {
        this.setState((_, props) => ({
            open: true,
            policyHolderInsuree: {
                policyHolder: props.policyHolder,
                policy: {}
            },
            jsonExtValid: true
        }));
    };

    handleClose = () => {
        this.setState({ open: false, policyHolderInsuree: {} });
    };

    handleSave = () => {
        const { intl, policyHolder, onSave, createPolicyHolderInsuree } = this.props;
        createPolicyHolderInsuree(
            this.state.policyHolderInsuree,
            formatMessageWithValues(intl, "policyHolder", "CreatePolicyHolderInsuree.mutationLabel", {
                code: policyHolder.code,
                tradeName: policyHolder.tradeName
            }).slice(ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH)
        );
        onSave();
        this.handleClose();
    };

    updateAttribute = (attribute, value) => {
        this.setState(state => ({
            policyHolderInsuree: {
                ...state.policyHolderInsuree,
                [attribute]: value
            }
        }));
    }

    canSave = () => {
        const { policyHolderInsuree, jsonExtValid } = this.state;
        return !!policyHolderInsuree.policyHolder &&
            !!policyHolderInsuree.insuree &&
            !!policyHolderInsuree.contributionPlanBundle &&
            !!policyHolderInsuree.dateValidFrom &&
            !!jsonExtValid;
    }

    setJsonExtValid = (valid) => this.setState({ jsonExtValid: !!valid });

    render() {
        const { intl } = this.props;
        const { open, policyHolderInsuree } = this.state;
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
                        <FormattedMessage module="policyHolder" id="policyHolderInsuree.createPolicyHolderInsuree" />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" component={StyledItem}>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="insuree.InsureeChfIdPicker"
                                    required
                                    value={!!policyHolderInsuree.insuree && policyHolderInsuree.insuree}
                                    onChange={v => this.updateAttribute('insuree', v)}
                                />
                            </Grid>
                            <Grid component={StyledItem}>
                                <PolicyHolderContributionPlanBundlePicker
                                    withNull={false}
                                    required
                                    policyHolderId={!!policyHolderInsuree.policyHolder && decodeId(policyHolderInsuree.policyHolder.id)}
                                    value={!!policyHolderInsuree.contributionPlanBundle && policyHolderInsuree.contributionPlanBundle}
                                    onChange={v => this.updateAttribute('contributionPlanBundle', v)}
                                />
                            </Grid>
                            <Contributions
                                contributionKey={POLICYHOLDERINSUREE_CALCULATION_CONTRIBUTION_KEY}
                                intl={intl}
                                className={POLICYHOLDERINSUREE_CLASSNAME}
                                entity={policyHolderInsuree}
                                requiredRights={[RIGHT_CALCULATION_WRITE]}
                                value={!!policyHolderInsuree.jsonExt && policyHolderInsuree.jsonExt}
                                onChange={this.updateAttribute}
                                gridItemStyle={StyledItem}
                                setJsonExtValid={this.setJsonExtValid}
                            />
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
    return bindActionCreators({ createPolicyHolderInsuree }, dispatch);
};

export { StyledItem };
export default injectIntl(connect(null, mapDispatchToProps)(CreatePolicyHolderInsureeDialog));
