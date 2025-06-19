
import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
    // State variables for input parameters
    const [lightUsers, setLightUsers] = useState(0); // Pengguna Ringan
    const [mediumUsers, setMediumUsers] = useState(0); // Pengguna Menengah
    const [heavyUsers, setHeavyUsers] = useState(0); // Pengguna Berat
    const [vcHoursHD, setVcHoursHD] = useState(0); // Jam Video Conference (HD)
    const [cloudStorageGB, setCloudStorageGB] = useState(0); // Sinkronisasi Cloud Storage (GB)
    const [deviceUpdatesCount, setDeviceUpdatesCount] = useState(0); // Jumlah Perangkat untuk Pembaruan Sistem
    const [smartphoneCount, setSmartphoneCount] = useState(0); // Jumlah Smartphone
    const [cctvCount, setCctvCount] = useState(0); // Jumlah Kamera IoT (CCTV)

    // New state variables for additional applications
    const [whatsappUsers, setWhatsappUsers] = useState(0); // Jumlah Pengguna WhatsApp
    const [sapErpUsers, setSapErpUsers] = useState(0); // Jumlah Pengguna Aktif SAP/ERP
    const [googleFormUsers, setGoogleFormUsers] = useState(0); // Jumlah Pengguna Google Form

    // State variable for the calculated total quota
    const [totalQuota, setTotalQuota] = useState(0);

    // State variable for showing a message if input is invalid
    const [message, setMessage] = useState('');

    // Define data consumption rates (based on the provided checklist)
    const consumptionRates = {
        lightUser: { min: 5, max: 15, avg: 10 },
        mediumUser: { min: 15, max: 50, avg: 30 },
        heavyUser: { min: 50, max: 200, avg: 75 },
        vcHD: { min: 1, max: 3, avg: 2 }, // GB per hour for video conferencing (e.g., Google Meet, Zoom Meeting)
        deviceUpdate: { min: 5, max: 20, avg: 10 }, // GB per device per month
        smartphone: { min: 5, max: 20, avg: 10 }, // GB per smartphone per month
        cctv: { min: 50, max: 200, avg: 75 }, // GB per camera per month
        whatsapp: { avg: 5 }, // GB per user per month for WhatsApp (assuming moderate usage with media)
        sapErp: { avg: 30 }, // GB per active user per month for SAP/ERP (can vary widely, estimate provided)
        googleForm: { avg: 0.1 }, // GB per user per month for Google Forms (very minimal)
        buffer: 0.15, // 15% buffer
    };

    // Function to calculate the total quota
    const calculateQuota = () => {
        // Validate inputs: ensure all inputs are non-negative numbers
        if (
            lightUsers < 0 || mediumUsers < 0 || heavyUsers < 0 ||
            vcHoursHD < 0 || cloudStorageGB < 0 || deviceUpdatesCount < 0 ||
            smartphoneCount < 0 || cctvCount < 0 ||
            whatsappUsers < 0 || sapErpUsers < 0 || googleFormUsers < 0
        ) {
            setMessage("Input tidak boleh negatif. Silakan masukkan angka positif.");
            setTotalQuota(0); // Reset total quota on invalid input
            return;
        } else {
            setMessage(''); // Clear any previous error messages
        }

        // 1. Calculate quota from Employees
        const quotaEmployees =
            (lightUsers * consumptionRates.lightUser.avg) +
            (mediumUsers * consumptionRates.mediumUser.avg) +
            (heavyUsers * consumptionRates.heavyUser.avg);

        // 2. Calculate quota from Applications
        const quotaApplications =
            (vcHoursHD * consumptionRates.vcHD.avg) + // Covers Google Meet / Zoom Meeting
            cloudStorageGB + // Covers Google Drive
            (deviceUpdatesCount * consumptionRates.deviceUpdate.avg) +
            (whatsappUsers * consumptionRates.whatsapp.avg) +
            (sapErpUsers * consumptionRates.sapErp.avg) +
            (googleFormUsers * consumptionRates.googleForm.avg);

        // 3. Calculate quota from Devices (excluding those covered by employees/apps explicitly)
        // PC/Laptops are covered by employee usage.
        const quotaDevices =
            (smartphoneCount * consumptionRates.smartphone.avg) +
            (cctvCount * consumptionRates.cctv.avg);

        // Total raw quota
        const rawTotal = quotaEmployees + quotaApplications + quotaDevices;

        // Add buffer
        const finalTotal = rawTotal * (1 + consumptionRates.buffer);

        setTotalQuota(Math.ceil(finalTotal)); // Round up to the nearest whole number
    };

    // Recalculate whenever any input changes
    // useEffect(() => {
    //     calculateQuota();
    // }, [
    //     lightUsers, mediumUsers, heavyUsers, vcHoursHD,
    //     cloudStorageGB, deviceUpdatesCount, smartphoneCount, cctvCount,
    //     whatsappUsers, sapErpUsers, googleFormUsers // Add new dependencies
    // ]);

    useEffect(() => {
      console.log('App rendered');
    });

    // Input field component for reusability
    const InputField = ({ label, value, setter, unit = '', helpText = '' }) => (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>
            <input
                type="number"
                min="0"
                className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out hover:border-gray-400"
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                aria-label={label}
            />
            {unit && <p className="text-xs text-gray-500 mt-1">{`(${unit})`}</p>}
            {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-200 flex items-center justify-center p-4 font-sans antialiased">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl border-t-8 border-indigo-600 transform transition-all duration-300 hover:scale-[1.005]">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                        Kalkulator Kuota Starlink
                    </span>
                    <span className="block text-2xl text-gray-600 font-semibold mt-2">Bulanan</span>
                </h1>
                <p className="text-gray-700 mb-8 text-center text-lg leading-relaxed">
                    Estimasi kebutuhan kuota internet Starlink Anda secara akurat berdasarkan profil penggunaan karyawan, aplikasi, dan perangkat.
                </p>

                {message && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 animate-pulse" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{message}</span>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Karyawan Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-200 ease-in-out">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-400">
                            <i className="fas fa-users mr-2 text-indigo-500"></i> 1. Karyawan (Pengguna)
                        </h2>
                        <InputField
                            label="Jumlah Karyawan Pengguna Ringan"
                            value={lightUsers}
                            setter={setLightUsers}
                            unit="Est. 5-15 GB/bulan per pengguna"
                        />
                        <InputField
                            label="Jumlah Karyawan Pengguna Menengah"
                            value={mediumUsers}
                            setter={setMediumUsers}
                            unit="Est. 15-50 GB/bulan per pengguna"
                        />
                        <InputField
                            label="Jumlah Karyawan Pengguna Berat"
                            value={heavyUsers}
                            setter={setHeavyUsers}
                            unit="Est. 50-200+ GB/bulan per pengguna"
                        />
                    </div>

                    {/* Aplikasi Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-200 ease-in-out">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-400">
                            <i className="fas fa-desktop mr-2 text-indigo-500"></i> 2. Aplikasi (Layanan / Software)
                        </h2>
                        <InputField
                            label="Total Jam Video Conference (Google Meet/Zoom Meeting) per bulan"
                            value={vcHoursHD}
                            setter={setVcHoursHD}
                            unit="Est. 1-3 GB/jam"
                        />
                        <InputField
                            label="Sinkronisasi & Penggunaan Google Drive (GB) per bulan"
                            value={cloudStorageGB}
                            setter={setCloudStorageGB}
                            unit="Total GB diunggah/diunduh"
                            helpText="Contoh: Jika 50 GB per bulan, masukkan 50."
                        />
                        <InputField
                            label="Jumlah Pengguna WhatsApp (dengan media & panggilan)"
                            value={whatsappUsers}
                            setter={setWhatsappUsers}
                            unit="Est. 5 GB/bulan per pengguna"
                        />
                        <InputField
                            label="Jumlah Pengguna Aktif SAP/ERP"
                            value={sapErpUsers}
                            setter={setSapErpUsers}
                            unit="Est. 30 GB/bulan per pengguna (dapat bervariasi)"
                            helpText="Perkiraan tinggi karena intensitas data."
                        />
                         <InputField
                            label="Jumlah Pengguna Google Form"
                            value={googleFormUsers}
                            setter={setGoogleFormUsers}
                            unit="Est. 0.1 GB/bulan per pengguna (minimal)"
                        />
                        <InputField
                            label="Jumlah Perangkat untuk Pembaruan Sistem Operasi & Aplikasi"
                            value={deviceUpdatesCount}
                            setter={setDeviceUpdatesCount}
                            unit="Est. 5-20 GB/bulan per perangkat"
                        />
                    </div>

                    {/* Perangkat Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 md:col-span-2 hover:shadow-lg transition duration-200 ease-in-out">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-400">
                            <i className="fas fa-mobile-alt mr-2 text-indigo-500"></i> 3. Perangkat (Devices)
                        </h2>
                        <InputField
                            label="Jumlah Smartphone Karyawan (akses dasar)"
                            value={smartphoneCount}
                            setter={setSmartphoneCount}
                            unit="Est. 5-20 GB/bulan per smartphone"
                        />
                        <InputField
                            label="Jumlah Kamera IoT (CCTV)"
                            value={cctvCount}
                            setter={setCctvCount}
                            unit="Est. 50-200+ GB/bulan per kamera"
                        />
                    </div>
                </div>

                {/* Hasil Perhitungan */}
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-[1.01] animate-fade-in-up">
                    <h2 className="text-3xl font-extrabold mb-2 leading-tight">
                        <i className="fas fa-rocket mr-3"></i> Perkiraan Total Kuota Starlink Bulanan
                    </h2>
                    <p className="text-6xl font-extrabold mb-4 drop-shadow-lg">
                        {totalQuota} GB
                    </p>
                    <p className="text-sm opacity-90">
                        (Termasuk buffer {consumptionRates.buffer * 100}% untuk penggunaan tak terduga)
                    </p>
                </div>

                <p className="text-center text-gray-500 text-sm mt-8">
                    * Perkiraan ini adalah panduan. Penggunaan aktual dapat bervariasi.
                    Disarankan untuk memantau penggunaan data setelah implementasi.
                </p>
            </div>
        </div>
    );
};

export default App;
