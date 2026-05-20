import {
  formatServerError,
  formatGraphQLError,
  parseData,
  pageInfo,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
  getLocalStorage,
} from "@openimis/fe-core";
import { ECONOMIC_UNIT_STORAGE_KEY } from "./constants";

function reducer(
  state = {
    fetchingPolicyHolders: false,
    errorPolicyHolders: null,
    fetchedPolicyHolders: false,
    policyHolders: [],
    policyHoldersPageInfo: {},
    policyHoldersTotalCount: 0,
    submittingMutation: false,
    mutation: {},
    fetchingPolicyHolder: false,
    errorPolicyHolder: null,
    fetchedPolicyHolder: false,
    policyHolder: {},
    fetchingPolicyHolderInsurees: false,
    errorPolicyHolderInsurees: null,
    fetchedPolicyHolderInsurees: false,
    policyHolderInsurees: [],
    policyHolderInsureesPageInfo: {},
    policyHolderInsureesTotalCount: 0,
    fetchingPickerPolicyHolderInsurees: false,
    errorPickerPolicyHolderInsurees: null,
    fetchedPickerPolicyHolderInsurees: false,
    pickerPolicyHolderInsurees: [],
    pickerPolicyHolderInsureesPageInfo: {},
    pickerPolicyHolderInsureesTotalCount: 0,
    fetchingPolicyHolderContributionPlanBundles: false,
    errorPolicyHolderContributionPlanBundles: null,
    fetchedPolicyHolderContributionPlanBundles: false,
    policyHolderContributionPlanBundles: [],
    policyHolderContributionPlanBundlesPageInfo: {},
    policyHolderContributionPlanBundlesTotalCount: 0,
    fetchingPickerPolicyHolderContributionPlanBundles: false,
    errorPickerPolicyHolderContributionPlanBundles: null,
    fetchedPickerPolicyHolderContributionPlanBundles: false,
    pickerPolicyHolderContributionPlanBundles: [],
    pickerPolicyHolderContributionPlanBundlesPageInfo: {},
    pickerPolicyHolderContributionPlanBundlesTotalCount: 0,
    fetchingPolicyHolderUsers: false,
    errorPolicyHolderUsers: null,
    fetchedPolicyHolderUsers: false,
    policyHolderUsers: [],
    policyHolderUsersPageInfo: {},
    policyHolderUsersTotalCount: 0,
    economicUnit: getLocalStorage(ECONOMIC_UNIT_STORAGE_KEY, {}),
    policyholderMutationReq: false,
    policyholderMutationErr: false,
    policyholderMutationResp: false,
    
    policyholderCreatePolicyholderReq: false,
    policyholderCreatePolicyholderResp: false,
    policyholderCreatePolicyholderErr: false,
    
    policyholderUpdatePolicyholderReq: false,
    policyholderUpdatePolicyholderResp: false,
    policyholderUpdatePolicyholderErr: false,

    policyholderDeletePolicyholderReq: false,
    policyholderDeletePolicyholderResp: false,
    policyholderDeletePolicyholderErr: false,

    policyholderCreatePolicyholderinsureeReq: false,
    policyholderCreatePolicyholderinsureeResp: false,
    policyholderCreatePolicyholderinsureeErr: false,

    policyholderUpdatePolicyholderinsureeReq: false,
    policyholderUpdatePolicyholderinsureeResp: false,
    policyholderUpdatePolicyholderinsureeErr: false,
    
    policyholderDeletePolicyholderinsureeReq: false,
    policyholderDeletePolicyholderinsureeResp: false,
    policyholderDeletePolicyholderinsureeErr: false,

    policyholderReplacePolicyholderinsureeReq: false,
    policyholderReplacePolicyholderinsureeResp: false,
    policyholderReplacePolicyholderinsureeErr: false,
    
    policyholderCreatePolicyholdercontributionplanbundleReq: false,
    policyholderCreatePolicyholdercontributionplanbundleResp: false,
    policyholderCreatePolicyholdercontributionplanbundleErr: false,
    
    policyholderUpdatePolicyholdercontributionplanbundleReq: false,
    policyholderUpdatePolicyholdercontributionplanbundleResp: false,
    policyholderUpdatePolicyholdercontributionplanbundleErr: false,
    
    policyholderDeletePolicyholdercontributionplanbundleReq: false,
    policyholderDeletePolicyholdercontributionplanbundleResp: false,
    policyholderDeletePolicyholdercontributionplanbundleErr: false,

    policyholderReplacePolicyholdercontributionplanbundleReq: false,
    policyholderReplacePolicyholdercontributionplanbundleResp: false,
    policyholderReplacePolicyholdercontributionplanbundleRErr: false,
    
    policyholderCreatePolicyholderuserReq: false,
    policyholderCreatePolicyholderuserResp: false,
    policyholderCreatePolicyholderuserErr: false,
    
    policyholderUpdatePolicyholderuserReq: false,
    policyholderUpdatePolicyholderuserResp: false,
    policyholderUpdatePolicyholderuserErr: false,

    policyholderDeletePolicyholderuserReq: false,
    policyholderDeletePolicyholderuserResp: false,
    policyholderDeletePolicyholderuserErr: false,

    policyholderReplacePolicyholderuserReq: false,
    policyholderReplacePolicyholderuserResp: false,
    policyholderReplacePolicyholderuserErr: false,
  },
  action
) {
  switch (action.type) {
    case "POLICYHOLDER_POLICYHOLDERS_REQ":
      return {
        ...state,
        fetchingPolicyHolders: true,
        fetchedPolicyHolders: false,
        policyHolders: [],
        policyHoldersPageInfo: {},
        policyHoldersTotalCount: 0,
        errorPolicyHolders: null,
      };
    case "POLICYHOLDER_POLICYHOLDERS_RESP":
      return {
        ...state,
        fetchingPolicyHolders: false,
        fetchedPolicyHolders: true,
        policyHolders: parseData(action.payload.data.policyHolder),
        policyHoldersPageInfo: pageInfo(action.payload.data.policyHolder),
        policyHoldersTotalCount: !!action.payload.data.policyHolder
          ? action.payload.data.policyHolder.totalCount
          : null,
        errorPolicyHolders: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERS_ERR":
      return {
        ...state,
        fetchingPolicyHolders: false,
        errorPolicyHolders: formatServerError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDER_REQ":
      return {
        ...state,
        fetchingPolicyHolder: true,
        fetchedPolicyHolder: false,
        policyHolder: null,
        errorPolicyHolder: null,
      };
    case "POLICYHOLDER_POLICYHOLDER_RESP":
      return {
        ...state,
        fetchingPolicyHolder: false,
        fetchedPolicyHolder: true,
        policyHolder: parseData(action.payload.data.policyHolder).find(
          (policyHolder) => !!policyHolder
        ),
        errorPolicyHolder: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDER_CLEAR":
      return {
        ...state,
        fetchingPolicyHolder: true,
        fetchedPolicyHolder: false,
        policyHolder: {},
        errorPolicyHolder: null,
      };
    case "POLICYHOLDER_POLICYHOLDER_ERR":
      return {
        ...state,
        fetchingPolicyHolder: false,
        errorPolicyHolder: formatServerError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERINSUREES_REQ":
      return {
        ...state,
        fetchingPolicyHolderInsurees: true,
        fetchedPolicyHolderInsurees: false,
        policyHolderInsurees: [],
        policyHolderInsureesPageInfo: {},
        policyHolderInsureesTotalCount: 0,
        errorPolicyHolderInsurees: null,
      };
    case "POLICYHOLDER_POLICYHOLDERINSUREES_RESP":
      return {
        ...state,
        fetchingPolicyHolderInsurees: false,
        fetchedPolicyHolderInsurees: true,
        policyHolderInsurees: parseData(
          action.payload.data.policyHolderInsuree
        ),
        policyHolderInsureesPageInfo: pageInfo(
          action.payload.data.policyHolderInsuree
        ),
        policyHolderInsureesTotalCount: !!action.payload.data
          .policyHolderInsuree
          ? action.payload.data.policyHolderInsuree.totalCount
          : null,
        errorPolicyHolderInsurees: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERINSUREES_ERR":
      return {
        ...state,
        fetchingPolicyHolderInsurees: false,
        errorPolicyHolderInsurees: formatServerError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERINSUREES_CLEAR":
      return {
        ...state,
        fetchingPolicyHolderInsurees: false,
        fetchedPolicyHolderInsurees: false,
        policyHolderInsurees: [],
        policyHolderInsureesPageInfo: {},
        policyHolderInsureesTotalCount: 0,
        errorPolicyHolderInsurees: null,
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES_REQ":
      return {
        ...state,
        fetchingPickerPolicyHolderInsurees: true,
        fetchedPickerPolicyHolderInsurees: false,
        pickerPolicyHolderInsurees: [],
        pickerPolicyHolderInsureesPageInfo: {},
        pickerPolicyHolderInsureesTotalCount: 0,
        errorPickerPolicyHolderInsurees: null,
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES_RESP":
      return {
        ...state,
        fetchingPickerPolicyHolderInsurees: false,
        fetchedPickerPolicyHolderInsurees: true,
        pickerPolicyHolderInsurees: parseData(
          action.payload.data.policyHolderInsuree
        ),
        pickerPolicyHolderInsureesPageInfo: pageInfo(
          action.payload.data.policyHolderInsuree
        ),
        pickerPolicyHolderInsureesTotalCount: !!action.payload.data
          .policyHolderInsuree
          ? action.payload.data.policyHolderInsuree.totalCount
          : null,
        errorPickerPolicyHolderInsurees: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES_ERR":
      return {
        ...state,
        fetchingPickerPolicyHolderInsurees: false,
        errorPickerPolicyHolderInsurees: formatServerError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES_REQ":
      return {
        ...state,
        fetchingPolicyHolderContributionPlanBundles: true,
        fetchedPolicyHolderContributionPlanBundles: false,
        policyHolderContributionPlanBundles: [],
        policyHolderContributionPlanBundlesPageInfo: {},
        policyHolderContributionPlanBundlesTotalCount: 0,
        errorPolicyHolderContributionPlanBundles: null,
      };
    case "POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES_RESP":
      return {
        ...state,
        fetchingPolicyHolderContributionPlanBundles: false,
        fetchedPolicyHolderContributionPlanBundles: true,
        policyHolderContributionPlanBundles: parseData(
          action.payload.data.policyHolderContributionPlanBundle
        ),
        policyHolderContributionPlanBundlesPageInfo: pageInfo(
          action.payload.data.policyHolderContributionPlanBundle
        ),
        policyHolderContributionPlanBundlesTotalCount: !!action.payload.data
          .policyHolderContributionPlanBundle
          ? action.payload.data.policyHolderContributionPlanBundle.totalCount
          : null,
        errorPolicyHolderContributionPlanBundles: formatGraphQLError(
          action.payload
        ),
      };
    case "POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES_ERR":
      return {
        ...state,
        fetchingPolicyHolderContributionPlanBundles: false,
        errorPolicyHolderContributionPlanBundles: formatServerError(
          action.payload
        ),
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES_REQ":
      return {
        ...state,
        fetchingPickerPolicyHolderContributionPlanBundles: true,
        fetchedPickerPolicyHolderContributionPlanBundles: false,
        pickerPolicyHolderContributionPlanBundles: [],
        pickerPolicyHolderContributionPlanBundlesPageInfo: {},
        pickerPolicyHolderContributionPlanBundlesTotalCount: 0,
        errorPickerPolicyHolderContributionPlanBundles: null,
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES_RESP":
      return {
        ...state,
        fetchingPickerPolicyHolderContributionPlanBundles: false,
        fetchedPickerPolicyHolderContributionPlanBundles: true,
        pickerPolicyHolderContributionPlanBundles: parseData(
          action.payload.data.policyHolderContributionPlanBundle
        ),
        pickerPolicyHolderContributionPlanBundlesPageInfo: pageInfo(
          action.payload.data.policyHolderContributionPlanBundle
        ),
        pickerPolicyHolderContributionPlanBundlesTotalCount: !!action.payload
          .data.policyHolderContributionPlanBundle
          ? action.payload.data.policyHolderContributionPlanBundle.totalCount
          : null,
        errorPickerPolicyHolderContributionPlanBundles: formatGraphQLError(
          action.payload
        ),
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES_ERR":
      return {
        ...state,
        fetchingPickerPolicyHolderContributionPlanBundles: false,
        errorPickerPolicyHolderContributionPlanBundles: formatServerError(
          action.payload
        ),
      };
    case "POLICYHOLDER_POLICYHOLDERUSERS_REQ":
      return {
        ...state,
        fetchingPolicyHolderUsers: true,
        fetchedPolicyHolderUsers: false,
        policyHolderUsers: [],
        policyHolderUsersPageInfo: {},
        policyHolderUsersTotalCount: 0,
        errorPolicyHolderUsers: null,
      };
    case "POLICYHOLDER_POLICYHOLDERUSERS_RESP":
      return {
        ...state,
        fetchingPolicyHolderUsers: false,
        fetchedPolicyHolderUsers: true,
        policyHolderUsers: parseData(action.payload.data.policyHolderUser),
        policyHolderUsersPageInfo: pageInfo(
          action.payload.data.policyHolderUser
        ),
        policyHolderUsersTotalCount: !!action.payload.data.policyHolderUser
          ? action.payload.data.policyHolderUser.totalCount
          : null,
        errorPolicyHolderUsers: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERUSERS_ERR":
      return {
        ...state,
        fetchingPolicyHolderUsers: false,
        errorPolicyHolderUsers: formatServerError(action.payload),
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_REQ":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_RESP":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: false,
            isValid: action.payload?.data?.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_ERR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_CLEAR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_SET_VALID":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };
    case 'SAVE_ECONOMIC_UNIT':
      return {
        ...state,
        economicUnit: action.payload,
      };
    case "POLICYHOLDER_MUTATION_REQ":
      return dispatchMutationReq({
        ...state,
        policyholderMutationReq: true,
        policyholderMutationErr: false,
        policyholderMutationResp: false,
        }, action);
    case "POLICYHOLDER_MUTATION_ERR":
      return dispatchMutationErr({
        ...state,
        policyholderMutationReq: false,
        policyholderMutationErr: true,
        policyholderMutationResp: false,
        }, action);
    case "POLICYHOLDER_MUTATION_RESP":
      return dispatchMutationErr({
        ...state,
        policyholderMutationReq: false,
        policyholderMutationErr: false,
        policyholderMutationResp: true,
        }, action);
    case "POLICYHOLDER_CREATE_POLICYHOLDER_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderReq: true,
        policyholderCreatePolicyholderResp: false,
        policyholderCreatePolicyholderErr: false,
        }, "createPolicyHolder", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDER_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderReq: false,
        policyholderCreatePolicyholderResp: true,
        policyholderCreatePolicyholderErr: false,
        }, "createPolicyHolder", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDER_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderReq: false,
        policyholderCreatePolicyholderResp: false,
        policyholderCreatePolicyholderErr: true
        }, "createPolicyHolder", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDER_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderReq: true,
        policyholderUpdatePolicyholderResp: false,
        policyholderUpdatePolicyholderErr: false,
      }, "updatePolicyHolder", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDER_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderReq: false,
        policyholderUpdatePolicyholderResp: true,
        policyholderUpdatePolicyholderErr: false,
      }, "updatePolicyHolder", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDER_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderReq: false,
        policyholderUpdatePolicyholderResp: false,
        policyholderUpdatePolicyholderErr: true,
      }, "updatePolicyHolder", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDER_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderReq: true,
        policyholderDeletePolicyholderResp: false,
        policyholderDeletePolicyholderErr: false,
      }, "deletePolicyHolder", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDER_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderReq: false,
        policyholderDeletePolicyholderResp: true,
        policyholderDeletePolicyholderErr: false,
      }, "deletePolicyHolder", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDER_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderReq: false,
        policyholderDeletePolicyholderResp: false,
        policyholderDeletePolicyholderErr: true,
      }, "deletePolicyHolder", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDERINSUREE_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderinsureeReq: true,
        policyholderCreatePolicyholderinsureeResp: false,
        policyholderCreatePolicyholderinsureeErr: false,
      }, "createPolicyHolderInsuree", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderinsureeReq: false,
        policyholderCreatePolicyholderinsureeResp: true,
        policyholderCreatePolicyholderinsureeErr: false,
      }, "createPolicyHolderInsuree", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDERINSUREE_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderinsureeReq: false,
        policyholderCreatePolicyholderinsureeResp: false,
        policyholderCreatePolicyholderinsureeErr: true,
      }, "createPolicyHolderInsuree", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDERINSUREE_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderinsureeReq: true,
        policyholderUpdatePolicyholderinsureeResp: false,
        policyholderUpdatePolicyholderinsureeErr: false,
      }, "updatePolicyHolderInsuree", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderinsureeReq: false,
        policyholderUpdatePolicyholderinsureeResp: true,
        policyholderUpdatePolicyholderinsureeErr: false,
      }, "updatePolicyHolderInsuree", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderinsureeReq: false,
        policyholderUpdatePolicyholderinsureeResp: false,
        policyholderUpdatePolicyholderinsureeErr: true,
      }, "updatePolicyHolderInsuree", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDERINSUREE_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderinsureeReq: true,
        policyholderDeletePolicyholderinsureeResp: false,
        policyholderDeletePolicyholderinsureeErr: false,    
      }, "deletePolicyHolderInsuree", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderinsureeReq: false,
        policyholderDeletePolicyholderinsureeResp: true,
        policyholderDeletePolicyholderinsureeErr: false,    
      }, "deletePolicyHolderInsuree", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDERINSUREE_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderinsureeReq: false,
        policyholderDeletePolicyholderinsureeResp: false,
        policyholderDeletePolicyholderinsureeErr: true,    
      }, "deletePolicyHolderInsuree", action);
    case "POLICYHOLDER_REPLACE_POLICYHOLDERINSUREE_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderReplacePolicyholderinsureeReq: true,
        policyholderReplacePolicyholderinsureeResp: false,
        policyholderReplacePolicyholderinsureeErr: false,
      }, "replacePolicyHolderInsuree", action);
    case "POLICYHOLDER_REPLACE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderReplacePolicyholderinsureeReq: false,
        policyholderReplacePolicyholderinsureeResp: true,
        policyholderReplacePolicyholderinsureeErr: false,
      }, "replacePolicyHolderInsuree", action);
    case "POLICYHOLDER_REPLACE_POLICYHOLDERINSUREE_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderReplacePolicyholderinsureeReq: false,
        policyholderReplacePolicyholderinsureeResp: false,
        policyholderReplacePolicyholderinsureeErr: true,
      }, "replacePolicyHolderInsuree", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholdercontributionplanbundleReq: true,
        policyholderCreatePolicyholdercontributionplanbundleResp: false,
        policyholderCreatePolicyholdercontributionplanbundleErr: false,    
        },
        "createPolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_CREATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholdercontributionplanbundleReq: false,
        policyholderCreatePolicyholdercontributionplanbundleResp: true,
        policyholderCreatePolicyholdercontributionplanbundleErr: false,    
        },
        "createPolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_CREATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholdercontributionplanbundleReq: false,
        policyholderCreatePolicyholdercontributionplanbundleResp: false,
        policyholderCreatePolicyholdercontributionplanbundleErr: true,    
        },
        "createPolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_UPDATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholdercontributionplanbundleReq: true,
        policyholderUpdatePolicyholdercontributionplanbundleResp: false,
        policyholderUpdatePolicyholdercontributionplanbundleErr: false,
        },
        "updatePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_UPDATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholdercontributionplanbundleReq: false,
        policyholderUpdatePolicyholdercontributionplanbundleResp: true,
        policyholderUpdatePolicyholdercontributionplanbundleErr: false,
        },
        "updatePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_UPDATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholdercontributionplanbundleReq: false,
        policyholderUpdatePolicyholdercontributionplanbundleResp: false,
        policyholderUpdatePolicyholdercontributionplanbundleErr: true,
        },
        "updatePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_DELETE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_REQ":
      return dispatchMutationResp({
        ...state,  
        policyholderDeletePolicyholdercontributionplanbundleReq: true,
        policyholderDeletePolicyholdercontributionplanbundleResp: false,
        policyholderDeletePolicyholdercontributionplanbundleErr: false,
        },
        "deletePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_DELETE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp({
        ...state,  
        policyholderDeletePolicyholdercontributionplanbundleReq: false,
        policyholderDeletePolicyholdercontributionplanbundleResp: true,
        policyholderDeletePolicyholdercontributionplanbundleErr: false,
        },
        "deletePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_DELETE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_ERR":
      return dispatchMutationResp({
        ...state,  
        policyholderDeletePolicyholdercontributionplanbundleReq: false,
        policyholderDeletePolicyholdercontributionplanbundleResp: false,
        policyholderDeletePolicyholdercontributionplanbundleErr: true,
        },
        "deletePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_REPLACE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_REQ":
      return dispatchMutationResp({
        ...state,    
        policyholderReplacePolicyholdercontributionplanbundleReq: true,
        policyholderReplacePolicyholdercontributionplanbundleResp: false,
        policyholderReplacePolicyholdercontributionplanbundleRErr: false,
      },
        "replacePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_REPLACE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp({
        ...state,    
        policyholderReplacePolicyholdercontributionplanbundleReq: false,
        policyholderReplacePolicyholdercontributionplanbundleResp: true,
        policyholderReplacePolicyholdercontributionplanbundleRErr: false,
      },
        "replacePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_REPLACE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_ERR":
      return dispatchMutationResp({
        ...state,    
        policyholderReplacePolicyholdercontributionplanbundleReq: false,
        policyholderReplacePolicyholdercontributionplanbundleResp: false,
        policyholderReplacePolicyholdercontributionplanbundleRErr: true,
      },
        "replacePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_CREATE_POLICYHOLDERUSER_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderuserReq: true,
        policyholderCreatePolicyholderuserResp: false,
        policyholderCreatePolicyholderuserErr: false,
        }, "createPolicyHolderUser", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDERUSER_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderuserReq: false,
        policyholderCreatePolicyholderuserResp: true,
        policyholderCreatePolicyholderuserErr: false,
        }, "createPolicyHolderUser", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDERUSER_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderCreatePolicyholderuserReq: false,
        policyholderCreatePolicyholderuserResp: false,
        policyholderCreatePolicyholderuserErr: true,
        }, "createPolicyHolderUser", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDERUSER_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderuserReq: true,
        policyholderUpdatePolicyholderuserResp: false,
        policyholderUpdatePolicyholderuserErr: false
      }, "updatePolicyHolderUser", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDERUSER_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderuserReq: false,
        policyholderUpdatePolicyholderuserResp: true,
        policyholderUpdatePolicyholderuserErr: false
      }, "updatePolicyHolderUser", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDERUSER_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderUpdatePolicyholderuserReq: false,
        policyholderUpdatePolicyholderuserResp: false,
        policyholderUpdatePolicyholderuserErr: true
      }, "updatePolicyHolderUser", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDERUSER_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderuserReq: true,
        policyholderDeletePolicyholderuserResp: false,
        policyholderDeletePolicyholderuserErr: false,
      }, "deletePolicyHolderUser", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDERUSER_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderuserReq: false,
        policyholderDeletePolicyholderuserResp: true,
        policyholderDeletePolicyholderuserErr: false,
      }, "deletePolicyHolderUser", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDERUSER_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderDeletePolicyholderuserReq: false,
        policyholderDeletePolicyholderuserResp: false,
        policyholderDeletePolicyholderuserErr: true,
      }, "deletePolicyHolderUser", action);
    case "POLICYHOLDER_REPLACE_POLICYHOLDERUSER_REQ":
      return dispatchMutationResp({
        ...state,
        policyholderReplacePolicyholderuserReq: true,
        policyholderReplacePolicyholderuserResp: false,
        policyholderReplacePolicyholderuserErr: false,
      }, "replacePolicyHolderUser", action);
    case "POLICYHOLDER_REPLACE_POLICYHOLDERUSER_RESP":
      return dispatchMutationResp({
        ...state,
        policyholderReplacePolicyholderuserReq: false,
        policyholderReplacePolicyholderuserResp: true,
        policyholderReplacePolicyholderuserErr: false,
      }, "replacePolicyHolderUser", action);
    case "POLICYHOLDER_REPLACE_POLICYHOLDERUSER_ERR":
      return dispatchMutationResp({
        ...state,
        policyholderReplacePolicyholderuserReq: false,
        policyholderReplacePolicyholderuserResp: false,
        policyholderReplacePolicyholderuserErr: true,
      }, "replacePolicyHolderUser", action);
    default:
      return state;
  }
}

export default reducer;
