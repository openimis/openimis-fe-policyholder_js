import React, { Component } from "react";
import { withModulesManager, ConstantBasedPicker } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import ConfigBasedPicker from "./ConfigBasedPicker";

class LegalFormPicker extends Component {
    constructor(props) {
      super(props);
      this.legalFormOptions = props.modulesManager.getConf("fe-policyHolder", 
        "policyHolderFilter.legalFormOptions"
      );
    }
    
    render() {
        return (
            this.legalFormOptions ? (
                <ConfigBasedPicker
                    configOptions={this.legalFormOptions}
                    {...this.props}
                />
            ) : (
                <ConstantBasedPicker
                    constants={[1, 2, 3, 4, 5]}
                    label="legalForm"
                    module="policyHolder"
                    {...this.props}
                />
            )
        );
    }
}

export { LegalFormPicker };
export default withModulesManager(injectIntl(LegalFormPicker));
