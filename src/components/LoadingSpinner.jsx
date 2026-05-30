/**
 * Loading Spinner Component
 * Displays a spinning animation to indicate loading state
 * Used during login/register API calls
 */
const LoadingSpinner = () => {
    return (
        // Fixed position overlay to cover the entire screen
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                {/* 
                    Spinning animation circle
                    animate-spin: Tailwind animation class
                    rounded-full: Makes it a circle
                    border-t-4: Makes one side thicker (creates spin effect)
                */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-3 text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;