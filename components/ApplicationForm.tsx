
import React from 'react';
import { motion } from 'framer-motion';
import { ApplicationData, Coordinates } from '../types';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';

interface ApplicationFormProps {
  appData: ApplicationData;
  setAppData: React.Dispatch<React.SetStateAction<ApplicationData>>;
  origin: Coordinates | null;
  destination: Coordinates | null;
  isSettingOrigin: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  appData,
  setAppData,
  origin,
  destination,
  isSettingOrigin,
  isLoading,
  onSubmit,
  onReset,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppData(prev => ({ ...prev, [name]: value }));
  };

  const formatCoords = (coords: Coordinates | null) => {
    return coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : '未設定';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-cyan-300">申請情報入力</h2>
      <div className="space-y-4">
        <InputField name="companyName" label="事業者名" value={appData.companyName} onChange={handleInputChange} placeholder="例: 株式会社 特殊輸送" />
        <InputField name="vehicleName" label="車両名" value={appData.vehicleName} onChange={handleInputChange} placeholder="例: 低床式16輪トレーラー" />
        <InputField name="departureDateTime" label="出発日時" value={appData.departureDateTime} onChange={handleInputChange} type="datetime-local" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <LocationDisplay label="出発地" coords={formatCoords(origin)} active={isSettingOrigin && !destination} />
          <LocationDisplay label="到着地" coords={formatCoords(destination)} active={!isSettingOrigin} />
        </div>
        <p className="text-center text-sm text-gray-400 pt-2">地図をクリックして出発地と到着地を設定してください。</p>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <PaperAirplaneIcon />
            {isLoading ? 'ルートを生成中...' : '最適ルートを申請'}
          </button>
          <button
            onClick={onReset}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors duration-300"
    />
  </div>
);

interface LocationDisplayProps {
  label: string;
  coords: string;
  active: boolean;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ label, coords, active }) => (
  <div className={`p-3 rounded-lg border-2 transition-all duration-300 ${active ? 'border-cyan-400 bg-cyan-500/10' : 'border-gray-600 bg-gray-700/50'}`}>
    <div className="flex items-center gap-2">
      <LocationMarkerIcon className={`w-5 h-5 ${active ? 'text-cyan-400' : 'text-gray-400'}`} />
      <span className="text-sm font-medium text-gray-300">{label}</span>
      {active && <span className="text-xs text-cyan-400 bg-cyan-900/50 px-2 py-0.5 rounded-full animate-pulse">設定中</span>}
    </div>
    <p className="mt-1 text-lg font-semibold text-white text-center">{coords}</p>
  </div>
);

export default ApplicationForm;
