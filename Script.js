async function createToken() {
    const name = document.getElementById("tokenname").value;
    const symbol = document.getElementById("symbol").value;
    const supply = document.getElementById("coins").value;

    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const network = await provider.getNetwork();
        if (network.chainId !== 8453) { // Base mainnet chain ID
          alert("Please switch to the Base network in your wallet.");
          return;
        }

        const contractAddress = ' '; // Replace with your actual contract address
        const contractABI = [ ];

        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.createToken(name, symbol, ethers.utils.parseUnits(supply, 18));
        document.getElementById("status").innerText = "Creating token... Please wait.";
        
        const receipt = await tx.wait();
        const tokenCreatedEvent = receipt.events.find(event => event.event === 'TokenCreated');
        const newTokenAddress = tokenCreatedEvent.args.tokenAddress;
        
        document.getElementById("status").innerText = `Token created successfully! Address: ${newTokenAddress}`;
      } catch (error) {
        console.error("Error creating token:", error);
        document.getElementById("status").innerText = "Error creating token. Please try again.";
      }
    } else {
      console.error("Ethereum provider not detected.");
      document.getElementById("status").innerText = "Please install MetaMask or another Ethereum wallet.";
    }
  }
