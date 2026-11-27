import { describe, expect, it, vi } from "vitest";

// The fe-core barrel cannot be loaded on its own from a test: only what the reducer reads.
vi.mock("@openimis/fe-core", () => ({
  formatServerError: (e) => e,
  formatGraphQLError: (e) => e,
  parseData: (d) => d?.edges?.map((e) => e.node) ?? [],
  pageInfo: () => ({}),
  dispatchMutationReq: (state) => ({ ...state, submittingMutation: true }),
  dispatchMutationResp: (state) => ({ ...state, submittingMutation: false }),
  dispatchMutationErr: (state) => ({ ...state, submittingMutation: false }),
  getLocalStorage: () => null,
}));

const { default: reducer } = await import("./reducer");

const edited = { id: "UEhVOjE=", user: { username: "clerk" }, dateValidTo: null };
const other = { id: "UEhVOjI=", user: { username: "other" }, dateValidTo: null };

describe("policy holder reducer", () => {
  // fe-core's Searcher reads a page again once the journal shows the mutation of one of
  // its rows done, and it knows a row's mutation by the clientMutationId the row carries.
  // UAT OCM-260: an edited policy holder user kept its old dates in the list.
  it("stamps the policy holder user under mutation with the mutation's id", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    const loaded = { ...state, policyHolderUsers: [edited, other] };

    const next = reducer(loaded, {
      type: "POLICYHOLDER_MUTATION_REQ",
      meta: { clientMutationId: "mutation-1", uuids: [edited.id] },
    });

    expect(next.policyHolderUsers[0].clientMutationId).toBe("mutation-1");
    expect(next.policyHolderUsers[1].clientMutationId).toBeUndefined();
    // On copies: the loaded rows are not written in place.
    expect(edited.clientMutationId).toBeUndefined();
  });

  it("leaves the rows alone for a mutation that names none", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    const loaded = { ...state, policyHolderUsers: [edited] };

    const next = reducer(loaded, { type: "POLICYHOLDER_MUTATION_REQ", meta: { clientMutationId: "mutation-1" } });

    expect(next.policyHolderUsers[0]).toBe(edited);
  });
});
