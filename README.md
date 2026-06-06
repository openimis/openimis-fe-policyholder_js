# openIMIS Frontend Policy Holder reference module
This repository holds the files of the openIMIS Frontend Policy Holder reference module.

> NOTE: This branch contains development version of this module based on Vite. Please use the `release/26.04` branch if you intend to fix issues via Pull Requests for the [current release](https://openimis.atlassian.net/wiki/spaces/OP/pages/4653678593/Sources+Release+2026-04) of openIMIS. The migration to vite is scheduled to conclude by end of June 2026.

It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
None

## Other Contributions
* `core.Router`: registering `policyHolders`, `policyHolders/policyHolder` routes in openIMIS client-side router
* `insuree.MainMenu`:
    
    **Policy Holders** (`menu.policyHolders` translation key)
* `invoice.SubjectAndThirdpartyPicker`: providing Policy Holder picker for Invoice module

## Available Contribution Points
* `policyHolder.TabPanel.label` ability to extend Policy Holder tab panel with a label
* `policyHolder.TabPanel.panel` ability to extend Policy Holder tab panel with a panel displayed on click on an appropriate label
* `policyHolder.PolicyHolderInsuree.calculation` placeholder for `Calculation` module contributions

## Published Components
* `policyHolder.ConfigBasedPicker`, generic picker, which can display options from JSON object 
* `policyHolder.LegalFormPicker`, picker for Legal Form (from JSON stored in the module configuration)
* `policyHolder.ActivityCodePicker`, picker for Activity Code (from JSON stored in the module configuration)
* `policyHolder.PolicyHolderPicker`, picker for Policy Holder
* `policyHolder.PolicyHolderInsureePicker`, picker for Policy Holder Insuree
* `policyHolder.PolicyHolderContributionPlanBundlePicker`, picker for Policy Holder Contribution Plan Bundle

## Dispatched Redux Actions
* `POLICYHOLDER_POLICYHOLDERS_{REQ|RESP|ERR}`, fetching Policy Holders (as triggered by the searcher)
* `POLICYHOLDER_POLICYHOLDER_{REQ|RESP|ERR}`, fetching Policy Holder
* `POLICYHOLDER_POLICYHOLDER_CLEAR`, clearing Policy Holder when unmounting form
* `POLICYHOLDER_POLICYHOLDERINSUREES_{REQ|RESP|ERR}`, fetching Policy Holder Insurees (as triggered by the searcher)
* `POLICYHOLDER_PICKERPOLICYHOLDERINSUREES_{REQ|RESP|ERR}`, fetching Policy Holder Insurees for Policy Holder Insurees Picker
* `POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES_{REQ|RESP|ERR}`, fetching Policy Holder Contribution Plan Bundles (as triggered by the searcher)
* `POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES_{REQ|RESP|ERR}`, fetching Policy Holder Contribution Plan Bundles for Policy Holder Contribution Plan Bundle Picker
* `POLICYHOLDER_CODE_FIELDS_VALIDATION_{REQ|RESP|ERR}`, validating Policy Holder code field
* `POLICYHOLDER_CODE_FIELDS_VALIDATION_CLEAR`, clearing validation state of Policy Holder code
* `POLICYHOLDER_CODE_FIELDS_VALIDATION_SET_VALID`, setting Policy Holder code as a valid one
* `POLICYHOLDER_MUTATION_{REQ|ERR}`, sending a mutation
* `POLICYHOLDER_CREATE_POLICYHOLDER_RESP`, receiving a result of create Policy Holder mutation
* `POLICYHOLDER_UPDATE_POLICYHOLDER_RESP`, receiving a result of update Policy Holder mutation
* `POLICYHOLDER_DELETE_POLICYHOLDER_RESP`, receiving a result of delete Policy Holder mutation
* `POLICYHOLDER_CREATE_POLICYHOLDERINSUREE_RESP`, receiving a result of create Policy Holder Insuree mutation
* `POLICYHOLDER_UPDATE_POLICYHOLDERINSUREE_RESP`, receiving a result of update Policy Holder Insuree mutation
* `POLICYHOLDER_DELETE_POLICYHOLDERINSUREE_RESP`, receiving a result of delete Policy Holder Insuree mutation
* `POLICYHOLDER_REPLACE_POLICYHOLDERINSUREE_RESP`, receiving a result of replace Policy Holder Insuree mutation
* `POLICYHOLDER_CREATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP`, receiving a result of create Policy Holder Contribution Plan Bundle mutation
* `POLICYHOLDER_UPDATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP`, receiving a result of update Policy Holder Contribution Plan Bundle mutation
* `POLICYHOLDER_DELETE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP`, receiving a result of delete Policy Holder Contribution Plan Bundle mutation
* `POLICYHOLDER_REPLACE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP`, receiving a result of replace Policy Holder Contribution Plan Bundle mutation

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)
* `state.insuree`, retrieving Insurees when creating Policy Holder Insuree
* `state.contributionPlan`, retrieving Contribution Plan Bundles when creating Policy Holder Contribution Plan Bundle

## Configurations Options
* `policyHolderFilter.rowsPerPageOptions`: pagination page size options in PolicyHolderSearcher component (Default: `[10, 20, 50, 100]`)
* `policyHolderFilter.defaultPageSize`: pagination pre-selected page size options in PolicyHolderSearcher component (Default: `10`)
* `policyHolderFilter.legalFormOptions`: options for LegalFormPicker component (Default:
    ```json
    [{
        "value": "1", 
        "label": {
            "en": "Personal Company",
            "fr": "Persone physique"
        }
    }, {
        "value": "2",
        "label": {
            "en": "Limited Risk Company",
            "fr": "Société à risque limité"
        }
    }, {
        "value": "3",
        "label": {
            "en": "Association",
            "fr": "Association"
        }
    }, {
        "value": "4",
        "label": {
            "en": "Government",
            "fr": "Gouvernement"
        }
    }, {
        "value": "5",
        "label": {
            "en": "Union",
            "fr":"Syndicat"
        }
    }]
    ```
)
* `policyHolderFilter.activityCodeOptions`: options for ActivityCodePicker component (Default:
    ```json
    [{   
        "value": "1", 
        "label": {
            "en": "Retail", 
            "fr": "Vente au détails"
        }
    }, {
        "value": "2",
        "label": {
            "en": "Industry", 
            "fr": "Industrie"
        }
    }, {
        "value": "3",
        "label": {
            "en": "Building", 
            "fr": "Construction"
        }
    }, {
        "value": "4",
        "label": { 
            "en": "Sailing", 
            "fr": "Maritime"
        }
    }, {
        "value": "5",
        "label": { 
            "en": "Services",
            "fr":"Services"
        }
    }]
    ```
)
* `policyHolderForm.phoneValidation`: Phone field validation (regex + error message when regex does not match) (Default:
    ```json
    "phoneValidation": {
        "regex": /^[0-9]*$/,
        "regexMsg": {
            "en": "Invalid phone number",
            "fr": "Numéro de téléphone invalide"
        }
    }
    ```
)
* `policyHolderForm.faxValidation`: Fax field validation (regex + error message when regex does not match) (Default:
    ```json
    "faxValidation", {
        "regex": /^[0-9]{8,9}$/,
        "regexMsg": {
            "en": "Invalid fax number",
            "fr": "Numéro de fax invalide"
        }
    }
    ```
)
* `policyHolderForm.paymentReferenceValidation`: PaymentReference field validation (regex + error message when regex does not match) (Default:
    ```json
    "paymentReferenceValidation", {
        "regex": /.+/,
        "regexMsg": {
            "en": "Invalid payment reference",
            "fr": "Référence de payement invalide"
        }
    }
    ```
)
* `policyHolderForm.accountancyAccountValidation`: AccountancyAccount field validation (regex + error message when regex does not match) (Default:
    ```json
    "accountancyAccountValidation", {
        "regex": /.+/,
        "regexMsg": {
            "en": "Invalid accountancy account",
            "fr": "Numéro de compte comptable invalide"
        }
    }
    ```
)
