'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // 1. Load Org1 connection profile
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network',
            'organizations/peerOrganizations/org1.example.com/connection-org1.json');

        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // 2. CA configuration
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;

        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );

        // 3. Create wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // 4. Check if identity already exists
        const identity = await wallet.get('ImportAdmin');
        if (identity) {
            console.log('Identity "ImportAdmin" already exists in the wallet');
            return;
        }

        // 5. Enroll admin with Fabric CA
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw',
            attrs: [
                { name: "role", value: "ImporterAdmin", ecert: true }
            ]
        });

        // 6. Create x509 identity
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        // 7. Store identity in wallet
        await wallet.put('ImportAdmin', x509Identity);

        console.log('✔ Successfully enrolled "ImportAdmin" and saved to wallet');

    } catch (error) {
        console.error(`❌ Failed to enroll ImportAdmin: ${error}`);
        process.exit(1);
    }
}

main();
