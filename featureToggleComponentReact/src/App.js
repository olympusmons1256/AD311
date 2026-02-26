import React from "react";
import FeatureToggle from "./FeatureToggle";

function App() {
  return (
    <div>
      <h1>Feature Toggle Demo</h1>
      <FeatureToggle isEnabled={true} featureName="Dark Mode" />
      <FeatureToggle isEnabled={false} featureName="Dashboard" />
      <FeatureToggle isEnabled={false} featureName="Notifications" />
      <FeatureToggle isEnabled={true} featureName="Advanced Analytics" />
    </div>
  );
}

export default App;
