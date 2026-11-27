import React, { Component, Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { GetIconComponent, injectIntl } from "@openimis/fe-core";

const AddIcon = GetIconComponent("Add")

import {
    FormattedMessage,
    formatMessage,
    formatMessageWithValues,
    PublishedComponent,
    decodeId
} from "@openimis/fe-core";
import { Fab, Grid, Tooltip } from "@mui/material";
import PolicyHolderPicker from "../pickers/PolicyHolderPicker";
import { styled } from "@mui/material/styles";
import { createPolicyHolderUser } from "../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    ZERO,
    MAX_CLIENTMUTATIONLABEL_LENGTH
} from "../constants";

const StyledItem = styled('div')(({ theme }) => ({
  ...theme?.paper?.item
}));

const StyledFab = styled('div')(({ theme }) => ({
  ...theme?.fab
}));

class CreatePolicyHolderUserDialog extends Component {
    state = {
        open: false,
        policyHolderUser: {}
    }

    // Only a predefined policy holder is filled in from the list. `policyHolders` is mapped
    // afresh on every store update, so overwriting here without one cleared the policy
    // holder the user had just picked whenever anything else was dispatched.
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { policyHolders, predefinedPolicyHolderId } = this.props;
        if (!predefinedPolicyHolderId || prevProps.policyHolders === policyHolders) return;
        const predefined = policyHolders.find((policyHolder) => policyHolder.id === predefinedPolicyHolderId);
        if (!!predefined && predefined.id !== this.state.policyHolderUser.policyHolder?.id) {
            this.updateAttribute("policyHolder", predefined);
        }
    }

    handleOpen = () => this.setState({ open: true });

    handleClose = () => this.setState({ open: false, policyHolderUser: {} });

    handleSave = () => {
        const { intl, onSave, createPolicyHolderUser } = this.props;
        const { policyHolderUser } = this.state;
        createPolicyHolderUser(
            this.state.policyHolderUser,
            formatMessageWithValues(intl, "policyHolder", "CreatePolicyHolderUser.mutationLabel", {
                user: policyHolderUser.user.username,
                policyHolder: `${policyHolderUser.policyHolder.code} - ${policyHolderUser.policyHolder.tradeName}`,
            }).slice(ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH)
        );
        onSave();
        this.handleClose();
    };

    updateAttribute = (attribute, value) =>
        this.setState((state) => ({
            policyHolderUser: {
                ...state.policyHolderUser,
                [attribute]: value,
            }
        }));

    canSave = () => {
        const { policyHolderUser } = this.state;
        return !!policyHolderUser.user && !!policyHolderUser.policyHolder && !!policyHolderUser.dateValidFrom;
    };

    render() {
        const { intl, tabView = false, predefinedPolicyHolderId = null } = this.props;
        const { open, policyHolderUser } = this.state;
        return (
            <Fragment>
                {tabView ? (
                    <Fab color="primary" onClick={this.handleOpen} size="small">
                        <AddIcon />
                    </Fab>
                ) : (
                    <StyledFab>
                        <Tooltip title={formatMessage(intl, "policyHolder", "policyHolderUser.createPolicyHolderUser")}>
                            <Fab color="primary" onClick={this.handleOpen}>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                    </StyledFab>
                )}
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        <FormattedMessage module="policyHolder" id="policyHolderUser.createPolicyHolderUser" />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" component={StyledItem}>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="admin.UserPicker"
                                    module="policyHolder"
                                    value={!!policyHolderUser.user && policyHolderUser.user}
                                    onChange={(v) => this.updateAttribute("user", v)}
                                    required
                                />
                            </Grid>
                            <Grid component={StyledItem}>
                                <PolicyHolderPicker
                                    module="policyHolder"
                                    value={!!policyHolderUser.policyHolder && policyHolderUser.policyHolder}
                                    onChange={(v) => this.updateAttribute("policyHolder", v)}
                                    readOnly={!!predefinedPolicyHolderId}
                                    required
                                />
                            </Grid>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="policyHolderUser.dateValidFrom"
                                    onChange={(v) => this.updateAttribute("dateValidFrom", v)}
                                    required
                                />
                            </Grid>
                            <Grid component={StyledItem}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="policyHolderUser.dateValidTo"
                                    onChange={(v) => this.updateAttribute("dateValidTo", v)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="outlined">
                            <FormattedMessage module="policyHolder" id="dialog.cancel" />
                        </Button>
                        <Button
                            onClick={this.handleSave}
                            disabled={!this.canSave()}
                            variant="contained"
                            color="primary"
                        >
                            <FormattedMessage module="policyHolder" id="dialog.replace" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    policyHolders: state.policyHolder.policyHolders.map(({ id: encodedId, ...other }) => ({
        id: decodeId(encodedId),
        ...other,
    })),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createPolicyHolderUser }, dispatch);
};

export { StyledItem, CreatePolicyHolderUserDialog };
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreatePolicyHolderUserDialog));
