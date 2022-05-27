const { ethereum } = window;

export const connectWallet = async () => {
    try {

      if (!ethereum) {
        alert("Please install MetaMask!");
        return undefined;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      return accounts[0];
    } catch (error) {
      alert(error);
      return undefined;
    }
  };

