
import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ApplicationData, RouteSuggestion, Coordinates } from './types';
import { getOptimalRoutes } from './services/geminiService';
import Header from './components/Header';
import ApplicationForm from './components/ApplicationForm';
import MapView from './components/MapView';
import RouteSuggestions from './components/RouteSuggestions';

export default function App(): React.ReactNode {
  const [appData, setAppData] = useState<ApplicationData>({
    companyName: '',
    vehicleName: '',
    departureDateTime: '',
  });
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [isSettingOrigin, setIsSettingOrigin] = useState<boolean>(true);
  const [routes, setRoutes] = useState<RouteSuggestion[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleMapClick = useCallback((coords: Coordinates) => {
    if (isSettingOrigin) {
      setOrigin(coords);
      setIsSettingOrigin(false);
    } else {
      setDestination(coords);
      setIsSettingOrigin(true);
    }
  }, [isSettingOrigin]);

  const handleSubmit = async () => {
    if (!origin || !destination || !appData.companyName || !appData.vehicleName || !appData.departureDateTime) {
      setError('すべての項目を入力し、地図上で出発地と到着地を選択してください。');
      return;
    }
    setError(null);
    setIsLoading(true);
    setRoutes([]);
    setSelectedRouteIndex(null);

    try {
      const suggestedRoutes = await getOptimalRoutes(appData, origin, destination);
      setRoutes(suggestedRoutes);
      // Simulate saving to SQL
      console.log('Application Submitted (Simulated SQL Save):', {
        ...appData,
        origin,
        destination,
        suggestedRoutes,
      });
    } catch (e) {
      console.error(e);
      setError('ルートの生成に失敗しました。しばらくしてから再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setAppData({ companyName: '', vehicleName: '', departureDateTime: '' });
    setOrigin(null);
    setDestination(null);
    setIsSettingOrigin(true);
    setRoutes([]);
    setSelectedRouteIndex(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <ApplicationForm
              appData={appData}
              setAppData={setAppData}
              origin={origin}
              destination={destination}
              isSettingOrigin={isSettingOrigin}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
             <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
            <RouteSuggestions
              routes={routes}
              isLoading={isLoading}
              selectedRouteIndex={selectedRouteIndex}
              onSelectRoute={setSelectedRouteIndex}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[400px] lg:h-auto min-h-[500px] lg:min-h-full rounded-lg shadow-2xl overflow-hidden"
          >
            <MapView
              origin={origin}
              destination={destination}
              routes={routes}
              selectedRouteIndex={selectedRouteIndex}
              onMapClick={handleMapClick}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
