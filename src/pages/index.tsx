import { ethers } from "ethers";
import { useState } from "react";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [contract, setContract] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  let usdcContract: any;
  const connectToWallet = async () => {
    let signer = null;

    let provider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      alert("Please install MetaMask to use this feature.");
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log(address);
      const usdcToken = "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747"; // USDC token address on Polygon Testnet
      let abi = [
        "function decimals() view returns (uint8)",
        "function balanceOf(address a) view returns (uint)",
        "function transfer(address to, uint amount)",
      ];

      usdcContract = new ethers.Contract(usdcToken, abi, signer);

      const balance = await usdcContract.balanceOf(address);
      console.log(balance);

      setAccount(address.slice(0, 3) + "..." + address.slice(-3));
      setUsdcBalance(Number(ethers.formatUnits(balance, 6)));
    }
  };

  const sendUsdc = async (address: string) => {
    // const usdcContract = new ethers.Contract(usdcToken, abi, signer);
    await connectToWallet();
    console.log(contract, usdcContract);
    const amount = ethers.parseUnits("1.0", 6);
    try {
      const tx = await usdcContract.transfer(contract, amount);
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        console.log(receipt.status);
        setStatus("Transaction failed!");
      } else {
        setStatus("Transaction succeeded!");
      }
    } catch (error: any) {
      alert("Error sending token");
      setStatus("Transaction failed!");
    }
  };

  return (
    <div className="min-h-screen bg-purple-800 flex flex-row justify-center items-center">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-purple-500 p-8 rounded-lg">
        <div className="px-6 py-4">
          {account ? (
            <div className="relative left-10 text-white text-l font-bold mb-4">
              Connected to: {account}
              <br />
              USDC balance: {usdcBalance} USDC
            </div>
          ) : (
            <button
              className="bg-purple-600 hover:bg-purple-400 text-white py-2 px-4 rounded"
              onClick={connectToWallet}
            >
              Connect to MetaMask
            </button>
          )}
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-200"
            type="text"
            placeholder="Contract Address"
            onChange={(e) => setContract(e.target.value)}
          />
          <button
            className="relative left-16 top-4 bg-purple-600 hover:bg-purple-400 text-white py-2 px-4 rounded"
            onClick={() => sendUsdc(contract)}
          >
            Send USDC
          </button>
          <div className="relative top-6 right-2 text-center text-white text-l font-bold mb-4">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}
