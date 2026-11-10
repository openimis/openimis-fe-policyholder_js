import {
  describe, expect, it, vi,
} from "vitest";

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock("@openimis/fe-core", async () => ({
  ...(await vi.importActual("@openimis/fe-core/helpers/api")),
  ...(await vi.importActual("@openimis/fe-core/helpers/useLocalStorage")),
}));

const { default: reducer } = await import("./reducer");
const { ECONOMIC_UNIT_STORAGE_KEY } = await import("./constants");
const {
  globalId, graphqlErrors, relayPage, serverError,
} = await import("@openimis/fe-core/testing");

const initial = () => reducer(undefined, { type: "@@INIT" });
const dispatch = (state, type, { payload, meta } = {}) => reducer(state, { type, payload, meta });
const respond = (state, type, data, meta) => dispatch(state, type, { payload: { data }, meta });
const fail = (state, type, payload = serverError(500, "Internal Server Error", "boom")) => dispatch(
  state,
  type,
  { payload },
);

const SERVER_ERROR = { code: 500, message: "Internal Server Error", detail: "boom" };
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

describe("policyholder reducer", () => {
  describe("initialisation", () => {
    it("starts with nothing loaded and nothing in flight", () => {
      const state = initial();

      expect(state.submittingMutation).toBe(false);
      expect(state.mutation).toEqual({});
      expect(state.policyHolders).toEqual([]);
      expect(state.policyHolder).toEqual({});
      expect(state.policyHolderInsurees).toEqual([]);
      expect(state.policyHolderContributionPlanBundles).toEqual([]);
      expect(state.policyHolderUsers).toEqual([]);
    });

    it("restores the economic unit the user last chose", () => {
      localStorage.setItem(ECONOMIC_UNIT_STORAGE_KEY, JSON.stringify({ id: "eu-1", code: "EU1" }));

      expect(initial().economicUnit).toEqual({ id: "eu-1", code: "EU1" });
    });

    it("starts with an empty economic unit when none was stored", () => {
      expect(initial().economicUnit).toEqual({});
    });

    it("returns the same state object for an unrelated action", () => {
      const state = initial();

      expect(reducer(state, { type: "SOMETHING_ELSE" })).toBe(state);
    });
  });

  describe("searches", () => {
    const SEARCHES = [
      ["policy holders", "POLICYHOLDER_POLICYHOLDERS", "policyHolder", "PolicyHolders"],
      ["policy holder insurees", "POLICYHOLDER_POLICYHOLDERINSUREES", "policyHolderInsuree",
        "PolicyHolderInsurees"],
      ["picker insurees", "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES", "policyHolderInsuree",
        "PickerPolicyHolderInsurees"],
      ["contribution plan bundles", "POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES",
        "policyHolderContributionPlanBundle", "PolicyHolderContributionPlanBundles"],
      ["picker contribution plan bundles", "POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES",
        "policyHolderContributionPlanBundle", "PickerPolicyHolderContributionPlanBundles"],
      ["policy holder users", "POLICYHOLDER_POLICYHOLDERUSERS", "policyHolderUser", "PolicyHolderUsers"],
    ];

    it.each(SEARCHES)("empties the %s list and marks it in flight when a search starts", (
      _label,
      prefix,
      _entity,
      suffix,
    ) => {
      const field = lowerFirst(suffix);
      const stale = {
        ...initial(),
        [field]: [{ id: "stale" }],
        [`${field}PageInfo`]: { totalCount: 1 },
        [`${field}TotalCount`]: 1,
        [`error${suffix}`]: SERVER_ERROR,
        [`fetched${suffix}`]: true,
      };
      const state = dispatch(stale, `${prefix}_REQ`);

      expect(state[`fetching${suffix}`]).toBe(true);
      expect(state[`fetched${suffix}`]).toBe(false);
      expect(state[field]).toEqual([]);
      expect(state[`${field}PageInfo`]).toEqual({});
      expect(state[`${field}TotalCount`]).toBe(0);
      expect(state[`error${suffix}`]).toBeNull();
    });

    it.each(SEARCHES)("stores and counts the %s page", (_label, prefix, entity, suffix) => {
      const field = lowerFirst(suffix);
      const rows = [{ id: globalId("Type", "row-1"), code: "A" }, { id: globalId("Type", "row-2"), code: "B" }];
      const state = respond(dispatch(initial(), `${prefix}_REQ`), `${prefix}_RESP`, {
        [entity]: relayPage(rows, { totalCount: 5, pageInfo: { hasNextPage: true } }),
      });

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`fetched${suffix}`]).toBe(true);
      expect(state[field]).toEqual(rows);
      expect(state[`${field}TotalCount`]).toBe(5);
      expect(state[`${field}PageInfo`]).toMatchObject({ totalCount: 5, hasNextPage: true });
      expect(state[`error${suffix}`]).toBeNull();
    });

    it.each(SEARCHES)("reports an empty %s page rather than throwing", (_label, prefix, entity, suffix) => {
      const field = lowerFirst(suffix);
      const state = respond(initial(), `${prefix}_RESP`, { [entity]: null });

      expect(state[field]).toEqual([]);
      expect(state[`${field}PageInfo`]).toEqual({});
      expect(state[`${field}TotalCount`]).toBeNull();
    });

    it.each(SEARCHES)("surfaces a data error from the %s search", (_label, prefix, entity, suffix) => {
      const state = dispatch(initial(), `${prefix}_RESP`, {
        payload: { data: { [entity]: relayPage([]) }, ...graphqlErrors("bad filter") },
      });

      expect(state[`error${suffix}`]).toMatchObject({ code: "Data error", detail: "bad filter" });
    });

    it.each(SEARCHES)("formats a transport failure of the %s search", (_label, prefix, _entity, suffix) => {
      const state = fail(dispatch(initial(), `${prefix}_REQ`), `${prefix}_ERR`);

      expect(state[`fetching${suffix}`]).toBe(false);
      expect(state[`error${suffix}`]).toEqual(SERVER_ERROR);
    });

    it("keeps the insuree list apart from the one the picker loads", () => {
      const page = { policyHolderInsuree: relayPage([{ id: "phi-1" }]) };
      const state = respond(initial(), "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES_RESP", page);

      expect(state.pickerPolicyHolderInsurees).toEqual([{ id: "phi-1" }]);
      expect(state.policyHolderInsurees).toEqual([]);
    });

    it("forgets the insurees and stops loading them on clear", () => {
      const loaded = respond(
        dispatch(initial(), "POLICYHOLDER_POLICYHOLDERINSUREES_REQ"),
        "POLICYHOLDER_POLICYHOLDERINSUREES_RESP",
        { policyHolderInsuree: relayPage([{ id: "phi-1" }]) },
      );
      const state = dispatch(loaded, "POLICYHOLDER_POLICYHOLDERINSUREES_CLEAR");

      expect(state).toMatchObject({
        fetchingPolicyHolderInsurees: false,
        fetchedPolicyHolderInsurees: false,
        policyHolderInsurees: [],
        policyHolderInsureesPageInfo: {},
        policyHolderInsureesTotalCount: 0,
        errorPolicyHolderInsurees: null,
      });
    });
  });

  describe("single policy holder", () => {
    it("drops the previous policy holder while the next one loads", () => {
      const state = dispatch({ ...initial(), policyHolder: { id: "old" } }, "POLICYHOLDER_POLICYHOLDER_REQ");

      expect(state).toMatchObject({ fetchingPolicyHolder: true, fetchedPolicyHolder: false, errorPolicyHolder: null });
      expect(state.policyHolder).toBeNull();
    });

    it("keeps the first policy holder the query returned", () => {
      const state = respond(initial(), "POLICYHOLDER_POLICYHOLDER_RESP", {
        policyHolder: relayPage([{ id: "ph-1", code: "PH1" }, { id: "ph-2", code: "PH2" }]),
      });

      expect(state.policyHolder).toEqual({ id: "ph-1", code: "PH1" });
      expect(state.fetchingPolicyHolder).toBe(false);
      expect(state.fetchedPolicyHolder).toBe(true);
    });

    it("leaves the policy holder undefined when the query found nothing", () => {
      const state = respond(initial(), "POLICYHOLDER_POLICYHOLDER_RESP", { policyHolder: relayPage([]) });

      expect(state.policyHolder).toBeUndefined();
      expect(state.fetchedPolicyHolder).toBe(true);
    });

    it("surfaces a data error from the policy holder query", () => {
      const state = dispatch(initial(), "POLICYHOLDER_POLICYHOLDER_RESP", {
        payload: { data: { policyHolder: relayPage([]) }, ...graphqlErrors("no access") },
      });

      expect(state.errorPolicyHolder).toMatchObject({ detail: "no access" });
    });

    it("formats a transport failure of the policy holder query", () => {
      const state = fail(dispatch(initial(), "POLICYHOLDER_POLICYHOLDER_REQ"), "POLICYHOLDER_POLICYHOLDER_ERR");

      expect(state.fetchingPolicyHolder).toBe(false);
      expect(state.errorPolicyHolder).toEqual(SERVER_ERROR);
    });

    it("forgets the policy holder on clear", () => {
      const loaded = respond(initial(), "POLICYHOLDER_POLICYHOLDER_RESP", {
        policyHolder: relayPage([{ id: "ph-1" }]),
      });
      const state = dispatch(loaded, "POLICYHOLDER_POLICYHOLDER_CLEAR");

      expect(state.policyHolder).toEqual({});
      expect(state.fetchedPolicyHolder).toBe(false);
      expect(state.errorPolicyHolder).toBeNull();
    });
  });

  describe("policy holder code validation", () => {
    const code = (state) => state.validationFields.policyHolderCode;

    it("marks the code as being checked", () => {
      expect(code(dispatch(initial(), "POLICYHOLDER_CODE_FIELDS_VALIDATION_REQ")))
        .toEqual({ isValidating: true, isValid: false, validationError: null });
    });

    it.each([
      ["free", true],
      ["taken", false],
    ])("records a %s code from the server", (_label, isValid) => {
      const state = respond(
        dispatch(initial(), "POLICYHOLDER_CODE_FIELDS_VALIDATION_REQ"),
        "POLICYHOLDER_CODE_FIELDS_VALIDATION_RESP",
        { isValid },
      );

      expect(code(state)).toEqual({ isValidating: false, isValid, validationError: null });
    });

    it("surfaces a data error from the check", () => {
      const state = dispatch(initial(), "POLICYHOLDER_CODE_FIELDS_VALIDATION_RESP", {
        payload: { data: { isValid: null }, ...graphqlErrors("bad code") },
      });

      expect(code(state).isValidating).toBe(false);
      expect(code(state).validationError).toMatchObject({ detail: "bad code" });
    });

    it("treats a failed check as an invalid code", () => {
      const state = fail(dispatch(initial(), "POLICYHOLDER_CODE_FIELDS_VALIDATION_REQ"),
        "POLICYHOLDER_CODE_FIELDS_VALIDATION_ERR");

      expect(code(state)).toEqual({ isValidating: false, isValid: false, validationError: SERVER_ERROR });
    });

    it("accepts the code without asking the server when told it is valid", () => {
      const state = dispatch(
        dispatch(initial(), "POLICYHOLDER_CODE_FIELDS_VALIDATION_REQ"),
        "POLICYHOLDER_CODE_FIELDS_VALIDATION_SET_VALID",
      );

      expect(code(state)).toEqual({ isValidating: false, isValid: true, validationError: null });
    });

    it("keeps the other validated fields when the code changes", () => {
      const other = { isValidating: false, isValid: true, validationError: null };
      const state = dispatch(
        { ...initial(), validationFields: { otherCode: other } },
        "POLICYHOLDER_CODE_FIELDS_VALIDATION_REQ",
      );

      expect(state.validationFields.otherCode).toBe(other);
    });

    it("forgets the verdict on clear", () => {
      const valid = dispatch(initial(), "POLICYHOLDER_CODE_FIELDS_VALIDATION_SET_VALID");
      const state = dispatch(valid, "POLICYHOLDER_CODE_FIELDS_VALIDATION_CLEAR");

      expect(code(state).isValid).toBe(false);
      expect(code(state).validationError).toBeNull();
    });

    // Currently fails: the clear branch sets isValidating: true, exactly like the
    // request branch, so after clearing the field reads as a check still in flight.
    it.fails("stops validating on clear", () => {
      const state = dispatch(
        dispatch(initial(), "POLICYHOLDER_CODE_FIELDS_VALIDATION_SET_VALID"),
        "POLICYHOLDER_CODE_FIELDS_VALIDATION_CLEAR",
      );

      expect(code(state).isValidating).toBe(false);
    });
  });

  describe("economic unit", () => {
    it("remembers the economic unit the user picked", () => {
      const state = dispatch(initial(), "SAVE_ECONOMIC_UNIT", { payload: { id: "eu-2", code: "EU2" } });

      expect(state.economicUnit).toEqual({ id: "eu-2", code: "EU2" });
    });
  });

  describe("mutations", () => {
    const MUTATION_RESULTS = [
      ["POLICYHOLDER_CREATE_POLICYHOLDER_RESP", "createPolicyHolder", "policyholderCreatePolicyholderResp"],
      ["POLICYHOLDER_UPDATE_POLICYHOLDER_RESP", "updatePolicyHolder", "policyholderUpdatePolicyholderResp"],
      ["POLICYHOLDER_DELETE_POLICYHOLDER_RESP", "deletePolicyHolder", "policyholderDeletePolicyholderResp"],
      ["POLICYHOLDER_CREATE_POLICYHOLDERINSUREE_RESP", "createPolicyHolderInsuree",
        "policyholderCreatePolicyholderinsureeResp"],
      ["POLICYHOLDER_UPDATE_POLICYHOLDERINSUREE_RESP", "updatePolicyHolderInsuree",
        "policyholderUpdatePolicyholderinsureeResp"],
      ["POLICYHOLDER_DELETE_POLICYHOLDERINSUREE_RESP", "deletePolicyHolderInsuree",
        "policyholderDeletePolicyholderinsureeResp"],
      ["POLICYHOLDER_REPLACE_POLICYHOLDERINSUREE_RESP", "replacePolicyHolderInsuree",
        "policyholderReplacePolicyholderinsureeResp"],
      ["POLICYHOLDER_CREATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP", "createPolicyHolderContributionPlanBundle",
        "policyholderCreatePolicyholdercontributionplanbundleResp"],
      ["POLICYHOLDER_UPDATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP", "updatePolicyHolderContributionPlanBundle",
        "policyholderUpdatePolicyholdercontributionplanbundleResp"],
      ["POLICYHOLDER_DELETE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP", "deletePolicyHolderContributionPlanBundle",
        "policyholderDeletePolicyholdercontributionplanbundleResp"],
      ["POLICYHOLDER_REPLACE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP", "replacePolicyHolderContributionPlanBundle",
        "policyholderReplacePolicyholdercontributionplanbundleResp"],
      ["POLICYHOLDER_CREATE_POLICYHOLDERUSER_RESP", "createPolicyHolderUser", "policyholderCreatePolicyholderuserResp"],
      ["POLICYHOLDER_UPDATE_POLICYHOLDERUSER_RESP", "updatePolicyHolderUser", "policyholderUpdatePolicyholderuserResp"],
      ["POLICYHOLDER_DELETE_POLICYHOLDERUSER_RESP", "deletePolicyHolderUser", "policyholderDeletePolicyholderuserResp"],
      ["POLICYHOLDER_REPLACE_POLICYHOLDERUSER_RESP", "replacePolicyHolderUser",
        "policyholderReplacePolicyholderuserResp"],
    ];

    // The tabs refresh their searcher on each false -> true edge of these flags.
    const WATCHED_BY_TABS = MUTATION_RESULTS.filter(([actionType]) => /INSUREE|BUNDLE|USER/.test(actionType)
      && !actionType.includes("DELETE"));

    const submitting = (state = initial()) => dispatch(state, "POLICYHOLDER_MUTATION_REQ", {
      meta: { clientMutationId: "cmid-1", clientMutationLabel: "Create policy holder" },
    });

    it("records the request metadata while a mutation is in flight", () => {
      expect(submitting()).toMatchObject({
        submittingMutation: true,
        mutation: { id: "cmid-1", clientMutationLabel: "Create policy holder" },
        policyholderMutationReq: true,
        policyholderMutationErr: false,
      });
    });

    it.each(MUTATION_RESULTS)("clears the in-flight flag and keeps the internal id on %s", (
      actionType,
      service,
      flag,
    ) => {
      const state = respond(submitting(), actionType, { [service]: { internalId: "internal-1" } });

      expect(state.submittingMutation).toBe(false);
      expect(state.mutation.id).toBe("internal-1");
      expect(state[flag]).toBe(true);
    });

    it("raises an alert when a mutation fails", () => {
      const state = fail(submitting(), "POLICYHOLDER_MUTATION_ERR", { status: 500, statusText: "Internal Server Error" });

      expect(JSON.parse(state.alert)).toEqual({ status: 500, statusText: "Internal Server Error" });
      expect(state.policyholderMutationErr).toBe(true);
      expect(state.policyholderMutationReq).toBe(false);
    });

    // Currently fails: the failure goes through fe-core's dispatchMutationErr, which
    // only sets the alert, so submittingMutation stays true after a failed save.
    it.fails("stops submitting once a mutation has failed", () => {
      const state = fail(submitting(), "POLICYHOLDER_MUTATION_ERR", { status: 500, statusText: "Internal Server Error" });

      expect(state.submittingMutation).toBe(false);
    });

    // Currently fails: every action starts with POLICYHOLDER_MUTATION_REQ, which never
    // lowers the per-operation success flags; only the per-operation _REQ branches do,
    // and nothing dispatches those. Once a flag is true it stays true, so the tab that
    // watches it refreshes its list after the first save of a session and never again.
    it.fails.each(WATCHED_BY_TABS)("lowers the result flag of %s when the next mutation starts", (
      actionType,
      service,
      flag,
    ) => {
      const saved = respond(submitting(), actionType, { [service]: { internalId: "internal-1" } });

      expect(submitting(saved)[flag]).toBe(false);
    });
  });
});
