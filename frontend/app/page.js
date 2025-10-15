"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [features, setFeatures] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [expectedFeatures, setExpectedFeatures] = useState([]);

  // Feature descriptions for better UX
  const featureDescriptions = {
    radius_mean: "Mean of distances from center to points on the perimeter",
    texture_mean: "Standard deviation of gray-scale values",
    perimeter_mean: "Mean size of the core tumor",
    area_mean: "Mean area of the tumor",
    smoothness_mean: "Mean of local variation in radius lengths",
    compactness_mean: "Mean of perimeter²/area - 1.0",
    concavity_mean: "Mean of severity of concave portions of the contour",
    concave_points_mean: "Mean number of concave portions of the contour",
    symmetry_mean: "Mean symmetry of the tumor",
    fractal_dimension_mean: "Mean coastline approximation - 1",
    radius_se: "Standard error of radius measurements",
    texture_se: "Standard error of texture measurements",
    perimeter_se: "Standard error of perimeter measurements",
    area_se: "Standard error of area measurements",
    smoothness_se: "Standard error of smoothness measurements",
    compactness_se: "Standard error of compactness measurements",
    concavity_se: "Standard error of concavity measurements",
    concave_points_se: "Standard error of concave points measurements",
    symmetry_se: "Standard error of symmetry measurements",
    fractal_dimension_se: "Standard error of fractal dimension measurements",
    radius_worst: "Worst (largest) radius measurement",
    texture_worst: "Worst (most irregular) texture measurement",
    perimeter_worst: "Worst (largest) perimeter measurement",
    area_worst: "Worst (largest) area measurement",
    smoothness_worst: "Worst (most irregular) smoothness measurement",
    compactness_worst: "Worst (most irregular) compactness measurement",
    concavity_worst: "Worst (most irregular) concavity measurement",
    concave_points_worst: "Worst (most) concave points measurement",
    symmetry_worst: "Worst (most irregular) symmetry measurement",
    fractal_dimension_worst: "Worst (most irregular) fractal dimension measurement"
  };

  useEffect(() => {
    // Fetch expected features from backend
    fetch("http://127.0.0.1:5000/features")
      .then(res => res.json())
      .then(data => {
        setExpectedFeatures(data.features);
        // Initialize features state
        const initialFeatures = {};
        data.features.forEach(feature => {
          initialFeatures[feature] = "";
        });
        setFeatures(initialFeatures);
      })
      .catch(err => console.error("Failed to fetch features:", err));
  }, []);

  const handleChange = (feature, value) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: value
    }));
    setError("");
  };

  const handleSubmit = async () => {
    // Validate all fields are filled
    const emptyFields = expectedFeatures.filter(feature => !features[feature]);
    if (emptyFields.length > 0) {
      setError(`Please fill in all fields: ${emptyFields.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const featureValues = expectedFeatures.map(feature => parseFloat(features[feature]));

      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featureValues }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setResult("");
        setConfidence(null);
      } else {
        setResult(data.result);
        setConfidence(data.confidence);
      }
    } catch (err) {
      setError("❌ Backend not running or connection failed!");
      setResult("");
      setConfidence(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const resetFeatures = {};
    expectedFeatures.forEach(feature => {
      resetFeatures[feature] = "";
    });
    setFeatures(resetFeatures);
    setResult("");
    setConfidence(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Tumor Detection</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">AI-Powered Tumor Detection</p>
              </div>
            </div>
            <nav className="flex space-x-2 sm:space-x-4">
              <Link href="/about" className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base transition-colors">About</Link>
              <Link href="/stats" className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base transition-colors">Statistics</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tumor Feature Analysis
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {expectedFeatures.map((feature) => (
                <div key={feature} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {feature.replace(/_/g, " ")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`Enter ${feature.replace(/_/g, " ")}`}
                    value={features[feature] || ""}
                    onChange={(e) => handleChange(feature, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500">{featureDescriptions[feature]}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Tumor"
                )}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analysis Results
            </h2>

            {result ? (
              <div className={`p-6 rounded-lg border-2 ${
                result.includes("Malignant") ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
              }`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    result.includes("Malignant") ? "bg-red-100" : "bg-green-100"
                  }`}>
                    {result.includes("Malignant") ? (
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-semibold ${
                      result.includes("Malignant") ? "text-red-800" : "text-green-800"
                    }`}>
                      {result}
                    </h3>
                    {confidence && (
                      <p className="text-sm text-gray-600">
                        Confidence: {confidence}%
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  {result.includes("Malignant") ? (
                    <p className="text-red-700">
                      ⚠️ This analysis suggests malignant characteristics. Please consult with a healthcare professional immediately for proper diagnosis and treatment.
                    </p>
                  ) : (
                    <p className="text-green-700">
                      ✅ This analysis suggests benign characteristics. However, regular medical check-ups are still recommended.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">Enter tumor features and click "Analyze Tumor" to get results</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Medical Disclaimer</h4>
              <p className="text-sm text-yellow-700">
                This tool is for educational and research purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
