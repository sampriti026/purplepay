import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount, useProvider, useSigner, useBalance } from "wagmi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [contract, setContract] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<any>("");

  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: contractAddress,
  });

  const successnotify = () => toast.success("Transaction Completed!");
  const failnotify = () => toast.error("Transaction Failed!");

  useEffect(() => {
    if (provider._network.chainId === 80001) {
      setContractAddress("0xE097d6B3100777DC31B34dC2c58fB524C2e76921");
    } else {
      setContractAddress("0xc94dd466416A7dFE166aB2cF916D3875C049EBB7");
    }
  });

  const sendUsdc = async (address: string) => {
    // const usdcContract = new ethers.Contract(usdcToken, abi, signer);
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ["function transfer(address, uint256)"],
        signer || provider
      );
      const tx = await contract.transfer(
        contract,
        ethers.utils.parseEther("1.0")
      );
      console.log(tx);
      successnotify();
    } catch (e) {
      console.log(e);
      failnotify();
    }
  };
  const mint = async () => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ["function mint(address, uint256)"],
        signer || provider
      );
      const tx = await contract.mint(address, ethers.utils.parseEther("1000"));
      console.log(tx);
      successnotify();
    } catch (e) {
      console.log(e);
      failnotify();
    }
  };

  return (
    <div className="min-h-screen bg-purple-800 flex flex-row justify-center items-center">
      <div className="w-1/2 h-1/2 rounded flex flex-col justify-center items-center shadow-lg bg-purple-500 p-8 rounded-lg">
        <div>
          <div className="relative left-20">
            <ConnectButton />
          </div>
          {isLoading ? (
            <div className="relative left-16 text-white text-l font-bold mb-4 p-4">
              Fetching balance…
            </div>
          ) : (
            <div className="relative left-16 text-white text-l font-bold mb-4 p-4">
              USDC balance: {data?.formatted} USDC
            </div>
          )}
          <ToastContainer />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-200"
            type="text"
            placeholder="Contract Address"
            onChange={(e) => setContract(e.target.value)}
          />
          <button
            className="relative left-24 top-4 bg-purple-600 hover:bg-purple-400 text-white py-2 px-4 rounded"
            onClick={() => sendUsdc(contract)}
          >
            Send USDC
          </button>
          <div className="relative top-6 right-2 text-center text-white text-l font-bold mb-4">
            {status}
          </div>
          <button
            onClick={() => mint()}
            className="relative left-20 top-4 bg-purple-600 hover:bg-purple-400 text-white py-2 px-4 rounded"
          >
            Mint 1000 USDC
          </button>
        </div>
      </div>
    </div>
  );
}
