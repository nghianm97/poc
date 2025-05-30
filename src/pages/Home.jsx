import React, { useState } from 'react';
import  { ETHERSCAN_ADDRESS } from '../constant.js';

const api_key = "HF314KN7IXWBF3MJWT1B23KTJ7EK5DDHTF"

const Home = () => {
  const [selectedSource, setSelectedSource] = useState('Etherscan');
  const [contractAddress, setContractAddress] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [dataContract, setDataContract] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCopy = (address) => {
    const textArea = document.createElement("textarea");
    console.log("Copying address:", address, textArea.value);
    textArea.value = address;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
      } else {
        throw new Error("Copy command was unsuccessful");
      }
    } catch (err) {
      console.error('Fallback: Copy failed', err);
      alert('Copy failed: ' + err.message);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      const api_url = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${copiedAddress}&tag=latest&apikey=${api_key}`;
      const response = await fetch(api_url);
      const data = await response.json();
      if (data.status === "1") {
        setDataContract(data?.result);
      } else {
        setDataContract([]);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      {/* Select Dropdown */}
      <div>
        <label htmlFor="source-select" className="block text-sm font-medium text-gray-700 mb-1">Select Source</label>
        <select
          id="source-select"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Etherscan">Etherscan</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b">ID</th>
              <th className="px-4 py-3 border-b">Contract Address</th>
            </tr>
          </thead>
          <tbody>
            {ETHERSCAN_ADDRESS.map((address, index) => (
              <tr key={address}>
                <td className="px-4 py-2 border-b text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 border-b">
                  <div className="flex justify-between items-center">
                    <tooltip title={address} className="flex-1">
                      <span className="truncate max-w-xs inline-block text-gray-800">{atob(address)}</span>
                    </tooltip>
                    <button
                      onClick={() => handleCopy(atob(address))}
                      className="ml-4 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs text-gray-800"
                    >
                      {copiedAddress === atob(address) ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Input Field */}
      <div>
        <label htmlFor="contract-input" className="block text-sm font-medium text-gray-800 mb-1">Enter Smart Contract Address</label>
        <input
          id="contract-input"
          type="text"
          placeholder="Enter contract address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <div className="text-blue-500 text-sm">Loading...</div>
      )}

      {!loading && (
        < div className="border rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border-b">ID</th>
                <th className="px-4 py-3 border-b">Contract Address</th>
                <th className="px-4 py-3 border-b">Balance</th>
              </tr>
            </thead>
            <tbody>
              {dataContract && dataContract.length > 0 ? dataContract?.map((item, index) => (
                <tr key={item.account}>
                  <td className="px-4 py-2 border-b text-gray-800">{index + 1}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex justify-between items-center">
                      <tooltip title={item.account} className="flex-1">
                        <span className="truncate max-w-xs inline-block text-gray-800">{item.account}</span>
                      </tooltip>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex justify-between items-center">
                      <tooltip title={item.balance} className="flex-1">
                        <span className="truncate max-w-[50px] inline-block text-gray-800">{item.balance}</span>
                      </tooltip>
                    </div>
                  </td>
                </tr>
              )) : <tr className='text-gray-800'><td className='p-2 pl-4' colSpan={3}>No data</td></tr>}
            </tbody>
          </table>
        </div>
      )
      }
    </div >
  );
};

export default Home;