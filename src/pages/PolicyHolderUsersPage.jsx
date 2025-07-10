import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  formatMessage,
  Helmet,
  clearCurrentPaginationPage,
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PolicyHolderUserSearcher from "../components/PolicyHolderUserSearcher";
import CreatePolicyHolderUserDialog from "../dialogs/CreatePolicyHolderUserDialog";
import {
  RIGHT_POLICYHOLDERUSER_SEARCH,
  RIGHT_PORTALPOLICYHOLDERUSER_SEARCH,
  RIGHT_POLICYHOLDERUSER_CREATE,
  RIGHT_PORTALPOLICYHOLDERUSER_CREATE,
} from "../constants";

const styles = (theme) => ({
  page: theme.page,
});

class PolicyHolderUsersPage extends Component {
  state = {
    reset: 0,
  };

  onSave = () =>
    this.setState((state) => ({
      reset: state.reset + 1,
    }));

  componentDidMount = () => {
    const moduleName = "policyHolder";
    const { module } = this.props;
    if (module !== moduleName) this.props.clearCurrentPaginationPage();
  };

  componentWillUnmount = () => {
    const { location, history } = this.props;
    const {
      location: { pathname },
    } = history;
    const urlPath = location.pathname;
    if (!pathname.includes(urlPath)) this.props.clearCurrentPaginationPage();
  };

  render() {
    const { classes, rights } = this.props;
    return (
      [RIGHT_POLICYHOLDERUSER_SEARCH, RIGHT_PORTALPOLICYHOLDERUSER_SEARCH].some(
        (right) => rights.includes(right)
      ) && (
        <div className={classes.page}>
          <Helmet
            title={formatMessage(
              this.props.intl,
              "policyHolder",
              "menu.policyHolderUsers"
            )}
          />
          <PolicyHolderUserSearcher
            rights={rights}
            reset={this.state.reset}
            onSave={this.onSave}
          />
          {[
            RIGHT_POLICYHOLDERUSER_CREATE,
            RIGHT_PORTALPOLICYHOLDERUSER_CREATE,
          ].some((right) => rights.includes(right)) && (
            <CreatePolicyHolderUserDialog onSave={this.onSave} />
          )}
        </div>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
  module: state.core?.savedPagination?.module,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ clearCurrentPaginationPage }, dispatch);

export default injectIntl(
  withTheme(
    withStyles(styles)(
      connect(mapStateToProps, mapDispatchToProps)(PolicyHolderUsersPage)
    )
  )
);
