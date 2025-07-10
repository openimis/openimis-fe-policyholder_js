import React, { Component } from "react";
import { withModulesManager } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import ConfigBasedPicker from "./ConfigBasedPicker";

class LegalFormPicker extends Component {
    constructor(props) {
        super(props);
        this.activityCodeOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.legalFormOptions",
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
        );
    }

    render() {
        return (
            <ConfigBasedPicker
                configOptions={this.activityCodeOptions}
                {...this.props}
            />
        )
    }
}

export default withModulesManager(injectIntl(LegalFormPicker));
