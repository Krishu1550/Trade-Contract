# Electronic Health Record Blockchain Based Platfrom - Project

## Tech stack

    - Hyperledger Fabric blockchain (Node SDK JavaScript)
    - Node.js
    - Next.js
    - IPFS

<!-- ADD github access 

$ eval "$(ssh-agent -s)"
$ ssh-add ~/ssh/github -->

# Steps to setup project

## Download fabric binarys and fabric sample repo

    $ ./install-fabric.sh 

## To test network 

    $ cd fabric-samples/test-network
    $ ./network.sh up

    $ docker ps    // to check running container or check in docker desktop
    
    $ ./network.sh down     // to down network

## to run network with ca and create mychannel 

    $ cd fabric-samples/test-network
    
    Create network with ca cert: 
    
    $ ./network.sh up createChannel -ca -s couchdb
    
### Chain code deployment command

- Deploy chain code
	    
    $ ./network.sh deployCC -ccn ehrChainCode -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript

    *Down Network - only if you want to stop network or close system
	
    $ ./network.sh down


## Steps to setup explorer

Step 0:  $ cd fabric-explorer/

Step 1. Copy the orgination folder from your running network to explorer to get access of one of the node in network.

    $  sudo cp -r ../fabric-samples/test-network/organizations/ .
    $  cp -r ../fabric-samples/test-network/organizations/ .

Step 2. Export env vraiables.
    
    export EXPLORER_CONFIG_FILE_PATH=./config.json
    export EXPLORER_PROFILE_DIR_PATH=./connection-profile
    export FABRIC_CRYPTO_PATH=./organizations

 
Step 3. Edit test-network.json 
	
    Inside adminPrivateKey section check the path
    It should look like this (change the id which is present in your crypto certs)

Step 4: 
    to start with out logs

    $ docker-compose up -d                    

    to start with logs.
     $ docker-compose up
	 
Step 5: To Stop Explorer
        $ docker-compose down

		

## Some Application ScreenShot


Docker Container

   <img width="1906" height="993" alt="Screenshot 2025-12-05 182501" src="https://github.com/user-attachments/assets/1c1ff248-153f-4493-903a-372b0da0471c" />

   
BlockChain Private Network.

<img width="1907" height="1012" alt="Screenshot 2025-12-05 192416" src="https://github.com/user-attachments/assets/a360a856-304c-414e-858e-c14eae0d8ab5" />
<img width="1898" height="970" alt="Screenshot 2025-12-05 194401" src="https://github.com/user-attachments/assets/de3de4c9-f9c6-4134-b891-4e65dd94aec6" />







