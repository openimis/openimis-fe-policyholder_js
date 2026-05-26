import React, { Component } from "react";
import { withModulesManager, ConstantBasedPicker } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import ConfigBasedPicker from "./ConfigBasedPicker";

class ActivityCodePicker extends Component {
    constructor(props) {
        super(props);
        this.activityCodeOptions = props.modulesManager.getConf(
            "fe-policyHolder",
            "policyHolderFilter.activityCodeOptions"
        );
    }

    render() {
        return this.activityCodeOptions ? (
            <ConfigBasedPicker
                configOptions={this.activityCodeOptions}
                {...this.props}
            />
        ) : (
            <ConstantBasedPicker
                constants={[1, 2, 3, 4, 5]}
                label="activityCode"
                module="policyHolder"
                {...this.props}
            />
        );
    }
}

export { ActivityCodePicker };
export default withModulesManager(injectIntl(ActivityCodePicker));