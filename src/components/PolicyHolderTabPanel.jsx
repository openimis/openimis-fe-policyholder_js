import React from "react";
import { Paper, Grid } from "@mui/material";
import { withModulesManager, FormPanel, Contributions } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { styled } from "@mui/material/styles";
import {
    RIGHT_POLICYHOLDERINSUREE_SEARCH,
    POLICYHOLDERINSUREE_TAB_VALUE,
    RIGHT_PORTALPOLICYHOLDERINSUREE_SEARCH
} from "../constants";

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme?.paper?.paper ?? {},
}));

const StyledTableTitle = styled('div')(({ theme }) => ({
  ...theme?.table?.title ?? {},
  padding: 0
}));

const StyledSelectedTab = styled('div')(({ theme }) => ({
  borderBottom: "4px solid white"
}));

const StyledUnselectedTab = styled('div')(({ theme }) => ({
  borderBottom: "4px solid transparent"
}));

const POLICYHOLDER_TABS_PANEL_CONTRIBUTION_KEY = "policyHolder.TabPanel.panel";
const POLICYHOLDER_TABS_LABEL_CONTRIBUTION_KEY = "policyHolder.TabPanel.label";

class PolicyHolderTabPanel extends FormPanel {
    constructor(props) {
        super(props);
        this.state = {
            value:
                (props.rights.includes(RIGHT_POLICYHOLDERINSUREE_SEARCH) ||
                    props.rights.includes(RIGHT_PORTALPOLICYHOLDERINSUREE_SEARCH))
                    ? POLICYHOLDERINSUREE_TAB_VALUE
                    : undefined
        };
    }

    isSelected = value => value === this.state.value;

    tabStyle = value => this.isSelected(value) ? StyledSelectedTab : StyledUnselectedTab;

    handleChange = (_, value) => this.setState({ value });

    render() {
        const { intl, rights, edited, mandatoryFieldsEmpty } = this.props;
        const { value } = this.state;
        const isTabsEnabled = !!edited && !!edited.id && !mandatoryFieldsEmpty;
        return (
            <StyledPaper>
                <Grid container component={StyledTableTitle}>
                    <Contributions
                        contributionKey={POLICYHOLDER_TABS_LABEL_CONTRIBUTION_KEY}
                        intl={intl}
                        rights={rights}
                        value={value}
                        onChange={this.handleChange}
                        isSelected={this.isSelected}
                        tabStyle={this.tabStyle}
                        disabled={!isTabsEnabled}
                    />
                </Grid>
                <Contributions
                    contributionKey={POLICYHOLDER_TABS_PANEL_CONTRIBUTION_KEY}
                    rights={rights}
                    value={value}
                    isTabsEnabled={isTabsEnabled}
                    policyHolder={edited}
                />
            </StyledPaper>
        )
    }
}

export { StyledPaper };
export default withModulesManager(injectIntl(PolicyHolderTabPanel));
