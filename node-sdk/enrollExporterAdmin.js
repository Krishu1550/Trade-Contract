'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Load network configuration for Org1 (ExporterOrg)
        const ccpPath = path.resolve(
            __dirname,
            '..',
            'fabric-samples',
            'test-network',
            'organizations',
            'peerOrganizations',
            'org1.example.com',
            'connection-org1.json'
        );
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create CA client
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );

        // Create wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check if ExporterAdmin already exists
        const identity = await wallet.get('ExporterAdmin');
        if (identity) {
            console.log('An identity for "ExporterAdmin" already exists in the wallet');
            return;
        }

        // Enroll admin user
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',   // Org1 = ExporterOrg
            type: 'X.509',
        };

        await wallet.put('ExporterAdmin', x509Identity);
        console.log('Successfully enrolled "ExporterAdmin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "ExporterAdmin": ${error}`);
        process.exit(1);
    }
}

main();
