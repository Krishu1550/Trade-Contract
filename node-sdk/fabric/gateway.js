'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

/**
 * Get a contract object from the network.
 * @param {string} identity - Name of the user identity in the wallet (e.g., ExporterAdmin, ImporterAdmin, consumer1)
 * @param {string} channelName - The channel to connect to (default: 'mychannel')
 * @param {string} chaincodeName - The chaincode to use (default: 'ccc01')
 */
async function getContract(identity, channelName = 'mychannel', chaincodeName = 'ccc01') {
    try {
        // 1. Load connection profile
        const ccpPath = path.resolve(
            __dirname,
            '../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // 2. Create wallet
        const walletPath = path.join(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // 3. Check if identity exists in wallet
        const identityExists = await wallet.get(identity);
        if (!identityExists) {
            throw new Error(`Identity "${identity}" not found in wallet. Please register and enroll this user first.`);
        }

        // 4. Create a new gateway connection
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: identity,
            discovery: { enabled: true, asLocalhost: true } // Use asLocalhost = true for local dev
        });

        // 5. Get network channel
        const network = await gateway.getNetwork(channelName);

        // 6. Get smart contract
        const contract = network.getContract(chaincodeName);

        return { contract, gateway };
    } catch (error) {
        console.error(`❌ Failed to connect to gateway: ${error}`);
        throw error;
    }
}

module.exports = { getContract };
