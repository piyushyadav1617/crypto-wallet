import { useState, useEffect } from "react";
import { mnemonicToSeed  } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const ETH = ({mnemonic}:{mnemonic:string}) => {
    type KeyPair = {
        publicKey: string,
        privateKey: string
      }
    const [wallets, setWallets] = useState<KeyPair[] | []>([]);

    async function add(){
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${wallets.length}'/0'`
         const hdNode = HDNodeWallet.fromSeed(seed);
         const child = hdNode.derivePath(derivationPath);
         const privateKey = child.privateKey;
         const wallet = new Wallet(privateKey);
        setWallets([...wallets, {publicKey: wallet.address, privateKey: privateKey}])
    }
    useEffect(()=>{
        add();
    },[mnemonic])

     return (
          <>
            <button onClick={add}>
                Add ETH wallet
            </button>
            
            <table>
                <caption className="text-xl">Ethereum Wallets</caption>
                <thead>
                    <tr>
                        <th>number</th>
                        <th>Private Key</th>
                        <th>Public Key</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        wallets.map((wallet, i) => {
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{wallet.privateKey}</td>
                                    <td>{wallet.publicKey}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </>
     )
}