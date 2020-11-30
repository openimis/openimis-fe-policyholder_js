import {
    graphql, formatPageQueryWithCount, formatMutation, decodeId, formatGQLString, formatJsonField
} from "@openimis/fe-core";

const POLICYHOLDER_FULL_PROJECTION = mm => [
    "code", "tradeName", "location" + mm.getProjection("location.Location.FlatProjection"),
    "address", "legalForm", "activityCode", "dateValidFrom", "dateValidTo"
];

export function fetchPolicyHolders(mm, prms) {
    var projections = ["code", "tradeName",
        "locations" + mm.getProjection("location.Location.FlatProjection"),
        "legalForm", "activityCode", "dateValidFrom", "dateValidTo"
    ];
    const payload = formatPageQueryWithCount(
        "policyHolder",
        prms,
        projections
    );
    return graphql(payload, "POLICYHOLDER_POLICYHOLDERS")
}

function formatPolicyHolderGQL(policyHolder) {
    return `
        ${policyHolder.uuid !== undefined && policyHolder.uuid !== null ? `uuid: "${policyHolder.uuid}"` : ''}
        ${!!policyHolder.code ? `code: "${formatGQLString(policyHolder.code)}"` : ""}
        ${!!policyHolder.tradeName ? `tradeName: "${formatGQLString(policyHolder.tradeName)}"` : ""}
        ${!!policyHolder.location ? `locationIds: "${decodeId(policyHolder.location.id)}"` : ""}
        ${!!policyHolder.address ? `address: "${formatJsonField(policyHolder.address)}"` : ""}
        ${!!policyHolder.phone ? `phone: "${formatGQLString(policyHolder.phone)}"` : ""}
        ${!!policyHolder.fax ? `fax: "${formatGQLString(policyHolder.fax)}"` : ""}
        ${!!policyHolder.email ? `email: "${formatGQLString(policyHolder.email)}"` : ""}
        ${!!policyHolder.contactName ? `contactName: "${formatJsonField(policyHolder.contactName)}"` : ""}
        ${!!policyHolder.legalForm ? `legalForm: "${policyHolder.legalForm}"` : ""}
        ${!!policyHolder.activityCode ? `activityCode: "${policyHolder.activityCode}"` : ""}
        ${!!policyHolder.accountancyAccount ? `accountancyAccount: "${formatGQLString(policyHolder.accountancyAccount)}"` : ""}
        ${!!policyHolder.bankAccount ? `bankAccount: "${formatJsonField(policyHolder.bankAccount)}"` : ""}
        ${!!policyHolder.paymentReference ? `paymentReference: "${formatGQLString(policyHolder.paymentReference)}"` : ""}
        ${!!policyHolder.dateValidFrom ? `dateValidFrom: "${policyHolder.dateValidFrom}"` : ""}
        ${!!policyHolder.dateValidTo ? `dateValidTo: "${policyHolder.dateValidTo}"` : ""}
    `
}

export function createPolicyHolder(mm, policyHolder, clientMutationLabel) {
    let mutation = formatMutation("createPolicyHolder", formatPolicyHolderGQL(policyHolder), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["POLICYHOLDER_MUTATION_REQ", "POLICYHOLDER_CREATE_POLICYHOLDER_RESP", "POLICYHOLDER_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}