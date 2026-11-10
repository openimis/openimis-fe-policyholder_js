import {
  describe, expect, it, vi,
} from "vitest";

// Only fe-core's two dispatchers are stubbed; the formatters are real, imported from
// their defining module because fe-core's barrel imports itself.
const core = vi.hoisted(() => ({
  graphql: vi.fn((payload, type, meta) => ({ payload, type, meta })),
  graphqlWithVariables: vi.fn((operation, variables, type, meta) => ({
    operation, variables, type, meta,
  })),
}));

vi.mock("@openimis/fe-core", async () => ({
  ...(await vi.importActual("@openimis/fe-core/helpers/api")),
  ...core,
}));

const actions = await import("./actions");
const { globalId } = await import("@openimis/fe-core/testing");

const modulesManager = { getProjection: (key) => `{<${key}>}` };

const query = (result) => result.payload.replace(/\s+/g, " ");
const operation = (result) => result.operation.replace(/\s+/g, " ");

const PH_UUID = "4d2a7a3e-6e2b-4b89-9a55-3a1c2f0a9f01";
const BUNDLE_UUID = "9b0f1c32-8a1e-4a7d-8f63-2c5d7e4b1a02";
const USER_UUID = "c1e2d3f4-0000-4000-8000-000000000003";
const ROW_UUID = "e5f6a7b8-1111-4111-8111-000000000004";

const thunk = (creator, ...args) => {
  const dispatched = vi.fn();
  actions[creator](...args)(dispatched);
  return dispatched.mock.calls.map(([action]) => action);
};

describe("policyholder actions", () => {
  describe("searches", () => {
    it.each([
      ["policy holders", "fetchPolicyHolders", "POLICYHOLDER_POLICYHOLDERS", "policyHolder"],
      ["policy holder insurees", "fetchPolicyHolderInsurees", "POLICYHOLDER_POLICYHOLDERINSUREES",
        "policyHolderInsuree"],
      ["picker insurees", "fetchPickerPolicyHolderInsurees", "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES",
        "policyHolderInsuree"],
      ["contribution plan bundles", "fetchPolicyHolderContributionPlanBundles",
        "POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES", "policyHolderContributionPlanBundle"],
      ["picker contribution plan bundles", "fetchPickerPolicyHolderContributionPlanBundles",
        "POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES", "policyHolderContributionPlanBundle"],
      ["policy holder users", "fetchPolicyHolderUsers", "POLICYHOLDER_POLICYHOLDERUSERS", "policyHolderUser"],
    ])("asks for a counted page of %s", (_label, creator, actionType, entity) => {
      const result = actions[creator](modulesManager, ["first: 10", "isDeleted: false"]);

      expect(result.type).toBe(actionType);
      expect(query(result)).toContain(`${entity}(first: 10,isDeleted: false) { totalCount`);
      expect(query(result)).toContain("edges { node {");
    });

    it("asks the picker for an uncounted page of codes and names, into the searcher's list", () => {
      const result = actions.fetchPickerPolicyHolders(["isDeleted: false"]);

      expect(result.type).toBe("POLICYHOLDER_POLICYHOLDERS");
      expect(query(result)).toContain("policyHolder(isDeleted: false) { pageInfo");
      expect(query(result)).toContain("node { id,code,tradeName }");
      expect(query(result)).not.toContain("totalCount");
    });

    it("projects every policy holder field, with the locations the location module declares", () => {
      const sent = query(actions.fetchPolicyHolders(modulesManager, []));

      expect(sent).toContain("locations{<location.Location.FlatProjection>}");
      expect(sent).toContain(
        "address,phone,fax,email,contactName,legalForm,activityCode,accountancyAccount,bankAccount,"
        + "paymentReference,dateValidFrom,dateValidTo,isDeleted",
      );
    });

    it("projects the insuree and bundle pickers' own fields into the insuree rows", () => {
      const full = query(actions.fetchPolicyHolderInsurees(modulesManager, []));
      const picker = query(actions.fetchPickerPolicyHolderInsurees(modulesManager, []));

      [full, picker].forEach((sent) => {
        expect(sent).toContain("insuree{<insuree.InsureePicker.projection>}");
        expect(sent).toContain("contributionPlanBundle{<contributionPlan.ContributionPlanBundlePicker.projection>}");
        expect(sent).toContain("jsonExt");
      });
      expect(full).toContain("lastPolicy{id},policyHolder{id}");
      expect(full).toContain("replacementUuid");
      expect(picker).not.toContain("replacementUuid");
    });

    it("keeps the picker's bundle rows down to the id and the bundle", () => {
      const full = query(actions.fetchPolicyHolderContributionPlanBundles(modulesManager, []));
      const picker = query(actions.fetchPickerPolicyHolderContributionPlanBundles(modulesManager, []));

      expect(full).toContain("replacementUuid,policyHolder{id}");
      expect(picker).toContain("node { id,contributionPlanBundle{<contributionPlan.ContributionPlanBundlePicker.projection>} }");
    });

    it("nests the full policy holder and the admin user picker fields into each user row", () => {
      const sent = query(actions.fetchPolicyHolderUsers(modulesManager, []));

      expect(sent).toContain("policyHolder{id,code,tradeName,locations{<location.Location.FlatProjection>}");
      expect(sent).toContain("user{<admin.UserPicker.projection>}");
    });
  });

  describe("single policy holder", () => {
    it("asks for one policy holder by id", () => {
      const result = actions.fetchPolicyHolder(modulesManager, PH_UUID);

      expect(result.type).toBe("POLICYHOLDER_POLICYHOLDER");
      expect(query(result)).toContain(`policyHolder(id: "${PH_UUID}") { pageInfo`);
      expect(query(result)).not.toContain("totalCount");
    });

    it("looks a policy holder up by the mutation that created it when there is no id yet", () => {
      const result = actions.fetchPolicyHolder(modulesManager, null, ['clientMutationId: "cmid-1"']);

      expect(query(result)).toContain('policyHolder(clientMutationId: "cmid-1",)');
    });

    it.each([
      ["clearPolicyHolder", "POLICYHOLDER_POLICYHOLDER_CLEAR"],
      ["clearPolicyHolderInsurees", "POLICYHOLDER_POLICYHOLDERINSUREES_CLEAR"],
      ["policyHolderCodeSetValid", "POLICYHOLDER_CODE_FIELDS_VALIDATION_SET_VALID"],
      ["policyHolderCodeClear", "POLICYHOLDER_CODE_FIELDS_VALIDATION_CLEAR"],
    ])("%s dispatches %s", (creator, actionType) => {
      expect(thunk(creator)).toEqual([{ type: actionType }]);
    });

    it("hands the chosen economic unit to the store", () => {
      expect(thunk("saveEconomicUnit", { id: "eu-1" })).toEqual([{ type: "SAVE_ECONOMIC_UNIT", payload: { id: "eu-1" } }]);
    });
  });

  describe("code validation", () => {
    it("asks the server whether the code is free, passing the code as a variable", () => {
      const result = actions.policyHolderCodeValidation(modulesManager, { policyHolderCode: "PH1" });

      expect(result.type).toBe("POLICYHOLDER_CODE_FIELDS_VALIDATION");
      expect(operation(result)).toContain(
        "query ($policyHolderCode: String!) { isValid: validatePolicyHolderCode(policyHolderCode: $policyHolderCode) }",
      );
      expect(result.variables).toEqual({ policyHolderCode: "PH1" });
    });
  });

  describe("mutations", () => {
    const MUTATIONS = [
      ["createPolicyHolder", "POLICYHOLDER_CREATE_POLICYHOLDER_RESP"],
      ["updatePolicyHolder", "POLICYHOLDER_UPDATE_POLICYHOLDER_RESP"],
      ["deletePolicyHolder", "POLICYHOLDER_DELETE_POLICYHOLDER_RESP"],
      ["createPolicyHolderInsuree", "POLICYHOLDER_CREATE_POLICYHOLDERINSUREE_RESP"],
      ["updatePolicyHolderInsuree", "POLICYHOLDER_UPDATE_POLICYHOLDERINSUREE_RESP"],
      ["deletePolicyHolderInsuree", "POLICYHOLDER_DELETE_POLICYHOLDERINSUREE_RESP"],
      ["replacePolicyHolderInsuree", "POLICYHOLDER_REPLACE_POLICYHOLDERINSUREE_RESP"],
      ["createPolicyHolderContributionPlanBundle", "POLICYHOLDER_CREATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP"],
      ["updatePolicyHolderContributionPlanBundle", "POLICYHOLDER_UPDATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP"],
      ["deletePolicyHolderContributionPlanBundle", "POLICYHOLDER_DELETE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP"],
      ["replacePolicyHolderContributionPlanBundle", "POLICYHOLDER_REPLACE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP"],
      ["createPolicyHolderUser", "POLICYHOLDER_CREATE_POLICYHOLDERUSER_RESP"],
      ["updatePolicyHolderUser", "POLICYHOLDER_UPDATE_POLICYHOLDERUSER_RESP"],
      ["deletePolicyHolderUser", "POLICYHOLDER_DELETE_POLICYHOLDERUSER_RESP"],
      ["replacePolicyHolderUser", "POLICYHOLDER_REPLACE_POLICYHOLDERUSER_RESP"],
    ];

    it.each(MUTATIONS)("%s raises the shared request, its own success and the shared error", (
      creator,
      successType,
    ) => {
      const result = actions[creator]({ id: globalId("Type", ROW_UUID) }, "label");

      expect(result.type).toEqual(["POLICYHOLDER_MUTATION_REQ", successType, "POLICYHOLDER_MUTATION_ERR"]);
      expect(query(result)).toContain(`mutation ${creator} { ${creator}(`);
    });

    it.each(MUTATIONS)("%s reports the client mutation id it sent, with its label", (creator) => {
      const result = actions[creator]({ id: globalId("Type", ROW_UUID) }, "Save it");

      expect(query(result)).toContain(`clientMutationId: "${result.meta.clientMutationId}"`);
      expect(query(result)).toContain('clientMutationLabel: "Save it"');
      expect(result.meta.clientMutationLabel).toBe("Save it");
      expect(result.meta.requestedDateTime).toBeInstanceOf(Date);
    });

    it.each([
      ["deletePolicyHolder"],
      ["deletePolicyHolderInsuree"],
      ["deletePolicyHolderContributionPlanBundle"],
      ["deletePolicyHolderUser"],
    ])("%s addresses the row by its decoded uuid and passes the details on", (creator) => {
      const sent = query(actions[creator]({ id: globalId("Type", ROW_UUID) }, "Delete", { code: "PH1" }));

      expect(sent).toContain(`uuids: ["${ROW_UUID}"]`);
      expect(sent).toContain('clientMutationDetails: {"code":"PH1"}');
    });
  });

  describe("policy holder payload", () => {
    const policyHolder = {
      id: globalId("PolicyHolderType", PH_UUID),
      code: "PH1",
      tradeName: "Acme",
      locations: { id: globalId("LocationType", "17") },
      address: '{"address": "Main St 1"}',
      phone: "+123",
      fax: "+456",
      email: "acme@example.org",
      contactName: '{"contactName": "Ada"}',
      legalForm: 2,
      activityCode: 3,
      accountancyAccount: "ACC-1",
      bankAccount: '{"bankAccount": "PL00"}',
      paymentReference: "REF-1",
      dateValidFrom: "2026-01-01T00:00:00",
      dateValidTo: "2026-12-31T00:00:00",
    };

    it.each(["createPolicyHolder", "updatePolicyHolder"])("%s sends every field it was given", (creator) => {
      const sent = query(actions[creator](policyHolder, "Save"));

      expect(sent).toContain(`id: "${PH_UUID}"`);
      expect(sent).toContain('code: "PH1"');
      expect(sent).toContain('tradeName: "Acme"');
      expect(sent).toContain("locationsId: 17");
      expect(sent).toContain('phone: "+123"');
      expect(sent).toContain('fax: "+456"');
      expect(sent).toContain('email: "acme@example.org"');
      expect(sent).toContain('accountancyAccount: "ACC-1"');
      expect(sent).toContain('paymentReference: "REF-1"');
    });

    it("sends the legal form and activity code as numbers", () => {
      const sent = query(actions.createPolicyHolder(policyHolder, "Save"));

      expect(sent).toContain("legalForm: 2");
      expect(sent).toContain("activityCode: 3");
    });

    it("sends the JSON fields as escaped JSON strings", () => {
      const sent = query(actions.createPolicyHolder(policyHolder, "Save"));

      expect(sent).toContain('address: "{\\"address\\": \\"Main St 1\\"}"');
      expect(sent).toContain('contactName: "{\\"contactName\\": \\"Ada\\"}"');
      expect(sent).toContain('bankAccount: "{\\"bankAccount\\": \\"PL00\\"}"');
    });

    it("keeps a line break in the address escaped", () => {
      const sent = actions.createPolicyHolder({ address: '{"address": "Line 1\nLine 2"}' }, "Save").payload;

      expect(sent).toContain('address: "{\\"address\\": \\"Line 1\\nLine 2\\"}"');
    });

    it("sends the validity dates without their time", () => {
      const sent = query(actions.createPolicyHolder(policyHolder, "Save"));

      expect(sent).toContain('dateValidFrom: "2026-01-01"');
      expect(sent).toContain('dateValidTo: "2026-12-31"');
    });

    it("omits the fields that were never filled in", () => {
      const sent = query(actions.createPolicyHolder({ code: "PH1" }, "Save"));

      ["id:", "tradeName:", "locationsId:", "address:", "phone:", "legalForm:", "activityCode:",
        "bankAccount:", "dateValidFrom:", "dateValidTo:"].forEach((field) => {
        expect(sent).not.toContain(field);
      });
    });

    // Currently fails: fe-core's formatGQLString escapes the quote first and then doubles
    // every backslash, including the one it just added, so the quote ends the string.
    it.fails("escapes a quote in the trade name", () => {
      expect(query(actions.createPolicyHolder({ tradeName: 'Acme "Best" Ltd' }, "Save")))
        .toContain('tradeName: "Acme \\"Best\\" Ltd"');
    });
  });

  describe("policy holder insuree payload", () => {
    const row = {
      id: globalId("PolicyHolderInsureeType", ROW_UUID),
      policyHolder: { id: globalId("PolicyHolderType", PH_UUID) },
      insuree: { id: globalId("InsureeType", "42") },
      contributionPlanBundle: { id: globalId("ContributionPlanBundleType", BUNDLE_UUID) },
      jsonExt: '{"calculationRule": {"rate": 5}}',
      dateValidFrom: "2026-01-01T00:00:00",
      dateValidTo: "2026-12-31T00:00:00",
    };

    it.each(["createPolicyHolderInsuree", "updatePolicyHolderInsuree"])("%s sends every decoded id", (creator) => {
      const sent = query(actions[creator](row, "Save"));

      expect(sent).toContain(`id: "${ROW_UUID}"`);
      expect(sent).toContain(`policyHolderId: "${PH_UUID}"`);
      expect(sent).toContain("insureeId: 42");
      expect(sent).toContain(`contributionPlanBundleId: "${BUNDLE_UUID}"`);
      expect(sent).toContain('jsonExt: "{\\"calculationRule\\": {\\"rate\\": 5}}"');
      expect(sent).toContain('dateValidFrom: "2026-01-01"');
      expect(sent).toContain('dateValidTo: "2026-12-31"');
    });

    it("names the row it replaces by uuid and leaves the policy holder out", () => {
      const sent = query(actions.replacePolicyHolderInsuree(row, "Replace"));

      expect(sent).toContain(`uuid: "${ROW_UUID}"`);
      expect(sent).not.toContain(" id:");
      expect(sent).not.toContain("policyHolderId");
      expect(sent).toContain("insureeId: 42");
    });

    it("omits the parts that were never filled in", () => {
      const sent = query(actions.createPolicyHolderInsuree({ insuree: row.insuree }, "Save"));

      ["id:", "policyHolderId:", "contributionPlanBundleId:", "jsonExt:", "dateValidFrom:", "dateValidTo:"]
        .forEach((field) => expect(sent).not.toContain(field));
    });
  });

  describe("policy holder contribution plan bundle payload", () => {
    const row = {
      id: globalId("PolicyHolderContributionPlanType", ROW_UUID),
      policyHolder: { id: globalId("PolicyHolderType", PH_UUID) },
      contributionPlanBundle: { id: globalId("ContributionPlanBundleType", BUNDLE_UUID) },
      dateValidFrom: "2026-01-01T00:00:00",
    };

    it.each([
      "createPolicyHolderContributionPlanBundle",
      "updatePolicyHolderContributionPlanBundle",
    ])("%s sends every decoded id", (creator) => {
      const sent = query(actions[creator](row, "Save"));

      expect(sent).toContain(`id: "${ROW_UUID}"`);
      expect(sent).toContain(`policyHolderId: "${PH_UUID}"`);
      expect(sent).toContain(`contributionPlanBundleId: "${BUNDLE_UUID}"`);
      expect(sent).toContain('dateValidFrom: "2026-01-01"');
      expect(sent).not.toContain("dateValidTo");
    });

    it("names the row it replaces by uuid and leaves the policy holder out", () => {
      const sent = query(actions.replacePolicyHolderContributionPlanBundle(row, "Replace"));

      expect(sent).toContain(`uuid: "${ROW_UUID}"`);
      expect(sent).not.toContain(" id:");
      expect(sent).not.toContain("policyHolderId");
    });
  });

  describe("policy holder user payload", () => {
    const row = {
      id: globalId("PolicyHolderUserType", ROW_UUID),
      user: { id: globalId("UserType", USER_UUID) },
      policyHolder: { id: PH_UUID },
      dateValidFrom: "2026-01-01T00:00:00",
      dateValidTo: "2026-12-31T00:00:00",
    };

    it.each(["createPolicyHolderUser", "updatePolicyHolderUser"])("%s sends the user and policy holder", (creator) => {
      const sent = query(actions[creator](row, "Save"));

      expect(sent).toContain(`id: "${ROW_UUID}"`);
      expect(sent).toContain(`userId: "${USER_UUID}"`);
      expect(sent).toContain('dateValidFrom: "2026-01-01"');
      expect(sent).toContain('dateValidTo: "2026-12-31"');
    });

    it("sends the policy holder id as the callers hold it, already decoded", () => {
      expect(query(actions.createPolicyHolderUser(row, "Save"))).toContain(`policyHolderId: "${PH_UUID}"`);
    });

    it("names the row it replaces by uuid and keeps the policy holder", () => {
      const sent = query(actions.replacePolicyHolderUser(row, "Replace"));

      expect(sent).toContain(`uuid: "${ROW_UUID}"`);
      expect(sent).not.toContain(" id:");
      expect(sent).toContain(`policyHolderId: "${PH_UUID}"`);
    });
  });
});
