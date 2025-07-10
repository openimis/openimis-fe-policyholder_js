import React, { Component } from "react";
import { withModulesManager } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import ConfigBasedPicker from "./ConfigBasedPicker";

class ActivityCodePicker extends Component {
    constructor(props) {
        super(props);
        this.activityCodeOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.activityCodeOptions",
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

export default withModulesManager(injectIntl(ActivityCodePicker));
