import React, { Component } from "react";
import { injectIntl } from "react-intl";
import {
  withModulesManager,
  formatMessageWithValues,
  Searcher,
  formatDateFromISO,
  journalize,
  withTooltip,
  coreConfirm,
  formatMessage,
  PublishedComponent,
  decodeId,
} from "@openimis/fe-core";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchPolicyHolderUsers, deletePolicyHolderUser } from "../actions";
import {
  DEFAULT_PAGE_SIZE,
  RIGHT_POLICYHOLDERUSER_DELETE,
  RIGHT_POLICYHOLDERUSER_REPLACE,
  RIGHT_POLICYHOLDERUSER_UPDATE,
  RIGHT_PORTALPOLICYHOLDERUSER_DELETE,
  RIGHT_PORTALPOLICYHOLDERUSER_REPLACE,
  RIGHT_PORTALPOLICYHOLDERUSER_UPDATE,
  ROWS_PER_PAGE_OPTIONS,
  ZERO,
  MAX_CLIENTMUTATIONLABEL_LENGTH,
} from "../constants";
import PolicyHolderUserFilter from "./PolicyHolderUserFilter";
import UpdatePolicyHolderUserDialog from "../dialogs/UpdatePolicyHolderUserDialog";
import PolicyHolderPicker from "../pickers/PolicyHolderPicker";

const DEFAULT_ORDER_BY = "id";

class PolicyHolderUserSearcher extends Component {
  state = {
    queryParams: null,
    toDelete: null,
    deleted: [],
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
    } else if (
      prevProps.confirmed !== this.props.confirmed &&
      !!this.props.confirmed &&
      !!this.state.confirmedAction
    ) {
      this.state.confirmedAction();
    } else if (
      prevState.toDelete !== this.state.toDelete &&
      !!this.state.toDelete
    ) {
      this.setState((state) => ({
        deleted: state.deleted.concat(state.toDelete),
        toDelete: null,
      }));
    } else if (
      prevState.deleted !== this.state.deleted ||
      prevProps.reset !== this.props.reset
    ) {
      this.refetch();
    }
  }

  fetch = (params) =>
    this.props.fetchPolicyHolderUsers(this.props.modulesManager, params);

  refetch = () => this.fetch(this.state.queryParams);

  filtersToQueryParams = (state) => {
    let params = Object.keys(state.filters)
      .filter((f) => !!state.filters[f]["filter"])
      .map((f) => state.filters[f]["filter"]);
    if (!state.beforeCursor && !state.afterCursor) {
      params.push(`first: ${state.pageSize}`);
    }
    if (!!state.afterCursor) {
      params.push(`after: "${state.afterCursor}"`);
      params.push(`first: ${state.pageSize}`);
    }
    if (!!state.beforeCursor) {
      params.push(`before: "${state.beforeCursor}"`);
      params.push(`last: ${state.pageSize}`);
    }
    if (!!state.orderBy) {
      params.push(`orderBy: ["${state.orderBy}"]`);
    }
    this.setState({ queryParams: params });
    return params;
  };

  headers = () => {
    const { rights, predefinedPolicyHolderId = null } = this.props;
    const result = ["policyHolder.policyHolderUser.userName"];
    if (predefinedPolicyHolderId === null) {
      result.push("policyHolder.policyHolder");
    }
    result.push(
      "policyHolder.policyHolderUser.dateValidFrom",
      "policyHolder.policyHolderUser.dateValidTo"
    );
    if (
      [
        RIGHT_POLICYHOLDERUSER_REPLACE,
        RIGHT_PORTALPOLICYHOLDERUSER_REPLACE,
      ].some((right) => rights.includes(right))
    ) {
      result.push("policyHolder.emptyLabel");
    }
    if (
      [RIGHT_POLICYHOLDERUSER_UPDATE, RIGHT_PORTALPOLICYHOLDERUSER_UPDATE].some(
        (right) => rights.includes(right)
      )
    ) {
      result.push("policyHolder.emptyLabel");
    }
    if (
      [RIGHT_POLICYHOLDERUSER_DELETE, RIGHT_PORTALPOLICYHOLDERUSER_DELETE].some(
        (right) => rights.includes(right)
      )
    ) {
      result.push("policyHolder.emptyLabel");
    }
    return result;
  };

  itemFormatters = () => {
    const {
      intl,
      modulesManager,
      rights,
      onSave,
      predefinedPolicyHolderId = null,
    } = this.props;
    const result = [
      (policyHolderUser) =>
        !!policyHolderUser.user
          ? `
        ${policyHolderUser.user.username}
        ${policyHolderUser.user.iUser.lastName}
        ${policyHolderUser.user.iUser.otherNames}
        `
          : "",
    ];
      result.push((policyHolderUser) => (
        !!policyHolderUser.policyHolder ? `${policyHolderUser.policyHolder.code} - ${policyHolderUser.policyHolder.tradeName}` : ''
      ));
    result.push(
      (policyHolderUser) =>
        !!policyHolderUser.dateValidFrom
          ? formatDateFromISO(
              modulesManager,
              intl,
              policyHolderUser.dateValidFrom
            )
          : "",
      (policyHolderUser) =>
        !!policyHolderUser.dateValidTo
          ? formatDateFromISO(
              modulesManager,
              intl,
              policyHolderUser.dateValidTo
            )
          : ""
    );
    if (
      [
        RIGHT_POLICYHOLDERUSER_REPLACE,
        RIGHT_PORTALPOLICYHOLDERUSER_REPLACE,
      ].some((right) => rights.includes(right))
    ) {
      result.push(
        (policyHolderUser) =>
          !this.isDeletedFilterEnabled(policyHolderUser) && (
            <UpdatePolicyHolderUserDialog
              onSave={onSave}
              policyHolderUser={policyHolderUser}
              disabled={this.state.deleted.includes(policyHolderUser.id)}
              isReplacing
              isPolicyHolderPredefined={!!predefinedPolicyHolderId}
            />
          )
      );
    }
    if (
      [RIGHT_POLICYHOLDERUSER_UPDATE, RIGHT_PORTALPOLICYHOLDERUSER_UPDATE].some(
        (right) => rights.includes(right)
      )
    ) {
      result.push(
        (policyHolderUser) =>
          !this.isDeletedFilterEnabled(policyHolderUser) && (
            <UpdatePolicyHolderUserDialog
              onSave={onSave}
              policyHolderUser={policyHolderUser}
              disabled={this.state.deleted.includes(policyHolderUser.id)}
              isPolicyHolderPredefined={!!predefinedPolicyHolderId}
            />
          )
      );
    }
    if (
      [RIGHT_POLICYHOLDERUSER_DELETE, RIGHT_PORTALPOLICYHOLDERUSER_DELETE].some(
        (right) => rights.includes(right)
      )
    ) {
      result.push(
        (policyHolderUser) =>
          !this.isDeletedFilterEnabled(policyHolderUser) &&
          withTooltip(
            <div>
              <IconButton
                onClick={() => this.onDelete(policyHolderUser)}
                disabled={this.state.deleted.includes(policyHolderUser.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>,
            formatMessage(intl, "policyHolder", "deleteButton.tooltip")
          )
      );
    }
    return result;
  };

  onDelete = (policyHolderUser) => {
    const { intl, coreConfirm, deletePolicyHolderUser } = this.props;
    let confirm = () =>
      coreConfirm(
        formatMessageWithValues(
          intl,
          "policyHolder",
          "policyHolderUser.dialog.delete.title",
          {
            user: policyHolderUser.user.username,
          }
        ),
        formatMessage(intl, "policyHolder", "dialog.delete.message")
      );
    let confirmedAction = () => {
      deletePolicyHolderUser(
        policyHolderUser,
        formatMessageWithValues(
          intl,
          "policyHolder",
          "DeletePolicyHolderUser.mutationLabel",
          {
            user: policyHolderUser.user.username,
            policyHolder: `${policyHolderUser.policyHolder.code} - ${policyHolderUser.policyHolder.tradeName}`,
          }
        ).slice(ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH)
      );
      this.setState({ toDelete: policyHolderUser.id });
    };
    this.setState({ confirmedAction }, confirm);
  };

  sorts = () => {
    const { predefinedPolicyHolderId = null } = this.props;
    const result = [["id", true]];
    if (predefinedPolicyHolderId === null) {
      result.push(["policyHolder", true]);
    }
    result.push(["dateValidFrom", true], ["dateValidTo", true]);
    return result;
  };

  defaultFilters = () => {
    const { predefinedPolicyHolderId } = this.props;
    const filters = {
      isDeleted: {
        value: false,
        filter: "isDeleted: false",
      },
      applyDefaultValidityFilter: {
        value: true,
        filter: "applyDefaultValidityFilter: true",
      },
    };
    if (!!predefinedPolicyHolderId) {
      filters.policyHolder_Id = {
        value: predefinedPolicyHolderId,
        filter: `policyHolder_Id: "${predefinedPolicyHolderId}"`,
      };
    }
    return filters;
  };

  isDeletedFilterEnabled = (policyHolderUser) => policyHolderUser.isDeleted;

  isRowDisabled = (_, policyHolderUser) =>
    this.state.deleted.includes(policyHolderUser.id) &&
    !this.isDeletedFilterEnabled(policyHolderUser);

  render() {
    const {
      intl,
      fetchingPolicyHolderUsers,
      fetchedPolicyHolderUsers,
      errorPolicyHolderUsers,
      policyHolderUsers,
      policyHolderUsersPageInfo,
      policyHolderUsersTotalCount,
      predefinedPolicyHolderId,
    } = this.props;
    return (
      <Searcher
        module='policyHolder'
        FilterPane={PolicyHolderUserFilter}
        fetch={this.fetch}
        items={policyHolderUsers}
        itemsPageInfo={policyHolderUsersPageInfo}
        fetchingItems={fetchingPolicyHolderUsers}
        fetchedItems={fetchedPolicyHolderUsers}
        errorItems={errorPolicyHolderUsers}
        tableTitle={formatMessageWithValues(
          intl,
          "policyHolder",
          "policyHolderUser.searcher.results.title",
          { policyHolderUsersTotalCount }
        )}
        filtersToQueryParams={this.filtersToQueryParams}
        headers={this.headers}
        itemFormatters={this.itemFormatters}
        sorts={this.sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy={DEFAULT_ORDER_BY}
        defaultFilters={this.defaultFilters()}
        rowLocked={this.isRowDisabled}
        rowDisabled={this.isRowDisabled}
        FilterExt={predefinedPolicyHolderId}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  fetchingPolicyHolderUsers: state.policyHolder.fetchingPolicyHolderUsers,
  fetchedPolicyHolderUsers: state.policyHolder.fetchedPolicyHolderUsers,
  errorPolicyHolderUsers: state.policyHolder.errorPolicyHolderUsers,
  policyHolderUsers: state.policyHolder.policyHolderUsers.map(
    ({ policyHolder, ...other }) => ({
      policyHolder: {
        ...policyHolder,
        id: decodeId(policyHolder.id),
      },
      ...other,
    })
  ),
  policyHolderUsersPageInfo: state.policyHolder.policyHolderUsersPageInfo,
  policyHolderUsersTotalCount: state.policyHolder.policyHolderUsersTotalCount,
  submittingMutation: state.policyHolder.submittingMutation,
  mutation: state.policyHolder.mutation,
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { fetchPolicyHolderUsers, deletePolicyHolderUser, journalize, coreConfirm },
    dispatch
  );
};

export default withModulesManager(
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(PolicyHolderUserSearcher)
  )
);