import React from "react";

function FeatureToggle({ isEnabled, featureName }) {
  return (
    <div>
      {isEnabled
        ? featureName
        : `Feature ${featureName} is disabled`}
    </div>
  );
}

export default FeatureToggle;