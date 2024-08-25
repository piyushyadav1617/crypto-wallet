import { useEffect, useState } from 'react'
import { mnemonicToSeed } from 'bip39'
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import bs58 from "bs58";
import { Button } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import { Card, CardBody } from "@nextui-org/react";

export const SOL = ({ mnemonic }: { mnemonic: string }) => {
    type KeyPair = {
        publicKey: string,
        privateKey: string
    }
    const [wallets, setWallets] = useState<KeyPair[] | []>([]);

    async function add() {
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${wallets.length}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        setWallets([...wallets, { publicKey: keypair.publicKey.toBase58(), privateKey: bs58.encode(secret) }]);
    }

    useEffect(() => {
        add();
    }, [mnemonic])

    return (
        <>
            <img src='solana-sol-logo.svg' alt='Etherium logo' className='h-14 w-14' />

            <Button onClick={add} className='my-10'>
                Add new wallet
            </Button>
            <div className='space-y-2 w-full '>
                {
                    wallets.map((wallet, i) => {
                        return (
                            <Card key={i} className='max-w-lg mx-2 md:mx-auto '>
                                <CardBody className=" m flex flex-row justify-between items-center">
                                    <div className=' flex flex-row items-center gap-4 w-full'>
                                        <span>{i + 1}.</span>
                                        <p className='w-40 text-sm text-ellipsis overflow-hidden text-nowrap'>{wallet.publicKey}</p>
                                    </div>
                                    <div>
                                        <Button isIconOnly onClick={() => navigator.clipboard.writeText(wallet.publicKey)}>
                                            <IoCopy />
                                        </Button>
                                    </div>
                                </CardBody>

                            </Card>
                        )
                    })
                }
            </div>
        </>

    )
}