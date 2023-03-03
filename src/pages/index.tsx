import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount, useProvider, useSigner, useBalance } from "wagmi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

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

  const transfer = async () => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ["function transfer(address, uint256)"],
        signer || provider
      );
      const tx = await contract.transfer(
        receiver,
        ethers.utils.parseEther(amount)
      );
      console.log(tx);
      successnotify();
    } catch (e) {
      console.log(e);
      console.log(amount)
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
    <div className="bg-purple-800 flex flex-col justify-center items-center w-screen h-screen">
      <p className="text-2xl font-bold text-white pb-4">Purple Pay</p>

      <ToastContainer />
      <div className="rounded  w-1/2 h-1/2  flex flex-col justify-center items-center shadow-lg bg-purple-500 rounded-lg">
        <ConnectButton />

        {isLoading ? (
          <div className="text-white text-l font-bold mb-4 p-4">
            Fetching balance…
          </div>
        ) : (
          <div className="text-white text-l font-bold mb-4 p-4">
            USDC balance: {data?.formatted} USDC
          </div>
        )}

        <input
          className="shadow appearance-none border rounded w-1/2 h-10 px-2 py-2 mb-4 mt-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-200"
          type="text"
          placeholder="Contract Address"
          onChange={(e) => setReceiver(e.target.value)}
        />
        <input
          className="shadow appearance-none border rounded w-1/2 h-10 px-4 py-2 mb-4 mt-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-200"
          type="text"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="bg-purple-600 hover:bg-purple-400 text-white py-2 px-4 rounded"
          onClick={() => transfer()}
        >
          Send USDC
        </button>
        <div className="text-center text-white text-l font-bold mb-4">
          {status}
        </div>
        <button
          onClick={() => mint()}
          className="bg-purple-600 hover:bg-purple-400 text-white py-2 px-4 rounded"
        >
          Mint 1000 USDC
        </button>
      </div>
    </div>
  );
}
