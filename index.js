// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// create a new keypair
const newPair = new Keypair();

// extract the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// the argv contains everything on the command line. argv[0] contains the path to the node
// argv[1] contains the path to the script code. I used slice(2) so that I can discard the first two items
// and use argv[0] again to get the public Key entered by the user
const userInputPublicKey = process.argv.slice(2)[0];
console.log("Public Key entered by the user: ", userInputPublicKey);

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key of the generated keypair", publicKey);

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // console.log("Connection object is: ", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        // const myWallet = await Keypair.fromSecretKey(privateKey);
        const walletBalance = await connection.getBalance(
            new PublicKey(userInputPublicKey)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async () => {
    try {
        // Connect to the devnet and make a wallet from private key
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // const myWallet = await Keypair.fromSecretKey(privateKey);

        // Request airdrop of 2 sol to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(userInputPublicKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

// Show the wallet balance before and after airdropping sol
const mainFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

mainFunction();