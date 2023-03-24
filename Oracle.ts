require("dotenv").config();

const { Data } = require("./helpers");

const Web3 = require("web3");

const { PRIVATE_KEY_1 } = process.env;


const web3WssPolygon = new Web3(
    new Web3.providers.WebsocketProvider(
        `wss://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_Polygon}`
    )
);
const web3WssGoerli = new Web3(
    new Web3.providers.WebsocketProvider(
        `wss://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_Goerli}`
    )
);

const web3HttpsPolygon = new Web3(
    new Web3.providers.HttpProvider(
        `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_Polygon}`
    )
);
const web3HttpsGoerli = new Web3(
    new Web3.providers.HttpProvider(
        `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_Goerli}`
    )
);

const oracle = new web3WssPolygon.eth.Contract(
    Data.oracle.abi,
    Data.oracle.address
);
const token = new web3WssGoerli.eth.Contract(
    Data.token.abi,
    Data.token.address
);

type TstrOrNum = string | number;
type Ttx = {
    to: string,
    data: string,
    chainId: TstrOrNum,
    gas: TstrOrNum,
    gasPrice: TstrOrNum,
    nonce: TstrOrNum,
    value: TstrOrNum,
    from?: string
};

//? listen to oracle contract to handle mint requests
oracle.events.EtherLockingRequest({}, async (err: object, event: any) => {
    if (!err) {
        const { returnValues: { locker, amount } }: 
              { returnValues: { locker: string, amount: TstrOrNum } } = event;

        try {
            let 
                to: string,
                data: string,
                Tx: Ttx,
                chainId: TstrOrNum,
                gas: TstrOrNum,
                gasPrice: TstrOrNum,
                nonce: TstrOrNum,
                value: TstrOrNum,
                from: string
            ;

            from = web3HttpsGoerli.eth.accounts.privateKeyToAccount(PRIVATE_KEY_1).address;
            to = token.options.address;
            chainId = 5;
            value = 0;
            nonce = await web3HttpsGoerli.eth.getTransactionCount(from);
            data = web3HttpsGoerli.eth.abi.encodeFunctionCall(
                {
                    type: "function",
                    name: "mint",
                    stateMutability: "nonpayable",
                    inputs: [
                        {
                            type: "uint256",
                            name: "_wether"
                        },
                        {
                            type: "address",
                            name: "_to"
                        }
                    ],
                    outputs: []
                },
                [
                    web3HttpsGoerli.utils.toBN(amount),
                    locker
                ]
            );
            gasPrice = await web3HttpsGoerli.eth.getGasPrice();
            gas = await web3HttpsGoerli.eth.estimateGas({ from, to, data, value });

            Tx = {
                to,
                data,
                chainId,
                gas,
                gasPrice,
                nonce,
                value,
                from
            };

            await web3HttpsGoerli.eth.accounts.signTransaction(Tx, PRIVATE_KEY_1).then(async (tx: any) => {
                const txStatus = await web3HttpsGoerli.eth.sendSignedTransaction(tx.rawTransaction).catch(() => {
                    console.log("Error occured while trying to send response!");
                });

                if (typeof txStatus !== "undefined" && txStatus.status) {
                    console.log("Tokens minted and locked successfully.");
                } else {
                    console.log("Somthing went wrong!");
                };
            }).catch(() => {
                console.log("Error occured while trying to create response!");
            });
        } catch {
            console.log("Error occured while trying to fetch the emitted event!");
        };
    };
});

//? listen to token contract on other evm chain to handle to unlock requests
token.events.EtherUnlockingRequest({}, async (err: object, event: any) => {
    if (!err) {
        const { returnValues: { unlocker, amount } }: 
              { returnValues: { unlocker: string, amount: TstrOrNum } } = event;

            try {
                let 
                    to: string,
                    data: string,
                    Tx: Ttx,
                    chainId: TstrOrNum,
                    gas: TstrOrNum,
                    gasPrice: TstrOrNum,
                    nonce: TstrOrNum,
                    value: TstrOrNum,
                    from: string
                ;
        
                from = web3HttpsPolygon.eth.accounts.privateKeyToAccount(PRIVATE_KEY_1).address;
                to = oracle.options.address;
                chainId = 80001;
                value = 0;
                nonce = await web3HttpsPolygon.eth.getTransactionCount(from);
                data = web3HttpsPolygon.eth.abi.encodeFunctionCall(
                    {
                        type: "function",
                        name: "increaseEtherToUnlock",
                        stateMutability: "nonpayable",
                        inputs: [
                            {
                                type: "address",
                                name: "_to"
                            },
                            {
                                type: "uint256",
                                name: "_amount"
                            }
                        ],
                        outputs: []
                    },
                    [
                        unlocker,
                        web3HttpsGoerli.utils.toBN(amount)
                    ])
                ;
                gasPrice = await web3HttpsPolygon.eth.getGasPrice();
                gas = await web3HttpsPolygon.eth.estimateGas({ from, to, data, value });
        
                Tx = {
                    to,
                    data,
                    chainId,
                    gas,
                    gasPrice,
                    nonce,
                    value,
                    from
                };
        
                await web3HttpsPolygon.eth.accounts.signTransaction(Tx, PRIVATE_KEY_1).then(async (tx: any) => {
                    const txStatus = await web3HttpsPolygon.eth.sendSignedTransaction(tx.rawTransaction).catch(() => {
                        console.log("Error occured while trying to send response!");
                    });
        
                    if (typeof txStatus !== "undefined" && txStatus.status) {
                        console.log("Tokens burnt and unlocked successfully.");
                    } else {
                        console.log("Somthing went wrong!");
                    };
                }).catch(() => {
                    console.log("Error occured while trying to create response!");
                });
        } catch {
            console.log("Error occured while trying to fetch the emitted event!");
        };
    };
});