'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

/**
 * Register and enroll a user
 * @param {string} userId - User identity (e.g., consumer1, importer1)
 * @param {string} role - Role attribute (Exporter, Importer, Consumer, Customs, TokenManager)
 */
async function registerUser(userId, role) {
    try {
        // Load connection profile
        const ccpPath = path.resolve(
            __dirname,
            '../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create CA client
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const ca = new FabricCAServices(caInfo.url);

        // Create wallet
        const walletPath = path.join(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if user already exists
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`✅ User ${userId} already exists in wallet`);
            return;
        }

        // Get admin identity from wallet
        const adminIdentity = await wallet.get('Org1Admin');
        if (!adminIdentity) throw new Error('Org1Admin identity not found. Enroll admin first.');

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'Org1Admin');

        // Register user with role attribute
        const secret = await ca.register(
            {
                enrollmentID: userId,
                role: 'client',
                attrs: [{ name: 'role', value: role, ecert: true }]
            },
            adminUser
        );

        // Enroll user
        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        };

        await wallet.put(userId, x509Identity);
        console.log(` Successfully registered and enrolled user "${userId}" with role "${role}"`);
    } catch (error) {
        console.error(`Failed to register user ${userId}: ${error}`);
        process.exit(1);
    }
}

// Example usage: register multiple users
(async () => {
    await registerUser('exporter1', 'Exporter');
    await registerUser('importer1', 'Importer');
    await registerUser('consumer1', 'Consumer');
    await registerUser('custom1', 'Customs');
    await registerUser('token1', 'TokenManager');
})();
