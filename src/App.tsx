import { useState, useEffect } from 'react'
import { generateMnemonic } from 'bip39';
import { Button } from "@nextui-org/react";
import { SOL } from './solana';
import { ETH } from './etherium';
import { Card, CardBody, CardFooter, Divider, } from "@nextui-org/react";
import { motion } from "framer-motion";
import { IoEye, IoEyeOff, IoCopy } from "react-icons/io5";
import { Checkbox } from "@nextui-org/react";

const staggerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",

    },
  },
};

type Step = 0 | 1 | 2 | 3;
type Network = "sol" | "eth" | "";
function App() {
  const [step, setStep] = useState<Step>(0);
  const [network, setNetwork] = useState<Network>("");
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  return (
    // <AuroraBackground showRadialGradient={false}>
    <div className='relative min-h-screen  overflow-x-hidden  flex flex-col items-center  pt-20 box-border'>
      {step === 0 && <StepZero setStep={setStep} />}
      {step === 1 && <StepOne setStep={setStep} setNetwork={setNetwork} />}
      {step === 2 && <StepTwo setStep={setStep} setMnemonic={setMnemonic} mnemonic={mnemonic} />}
      {step === 3 && <StepThree network={network} mnemonic={mnemonic} />}
      {/* <div>
        {
          [0, 1, 2, 3].map(step => <Button onClick={() => setStep(step)} key= {step}>{step}</Button>)
        }
      </div> */}


    </div>

  )
}

export const StepZero = ({ setStep }: { setStep: React.Dispatch<React.SetStateAction<Step>> }) => {
  function handleClick() {
    setStep(1);
  }
  return (
    <>

      <h1 className='scroll-m-20 text-4xl sm:text-5xl font-bold tracking-tight lg:text-5xlss'>Welcome to Vault</h1>
      <p className=' text-default-400 mt-4 text-wrap px-4 text-center'>
        Let&apos;s get started
      </p>
      <Button size='lg' onClick={handleClick} className="mt-20 z-20">Create Wallet</Button>
    </>

  )
}

export const StepOne = ({ setStep,
  setNetwork }: {
    setStep: React.Dispatch<React.SetStateAction<Step>>,
    setNetwork: React.Dispatch<React.SetStateAction<Network>>
  }) => {

  function handleClick(network: Network) {
    setNetwork(network);
    setStep(2);
  }

  return (
    <div>
      <h1 className='scroll-m-20 text-4xl sm:text-5xl font-bold tracking-tight text-center '>Select your network</h1>
      <p className=' text-default-400 mt-4 text-wrap px-4 text-center'>
        Which network do you want to use? You can add more later.
      </p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
        className='space-y-3 mt-8 '
      >
        <motion.div onClick={() => handleClick("sol")} variants={itemVariants} className='max-w-lg flex justify-start items-center gap-6 bg-default-100 p-2 rounded-lg hover:bg-default-200 cursor-pointer transition-colors'>
          <img src='solana-sol-logo.svg' alt='Solana logo' className='w-6 h-8' />
          <span className='text-xl'>Solana</span>
        </motion.div>
        <motion.div onClick={() => handleClick("eth")} variants={itemVariants} className='max-w-lg flex justify-start items-center gap-6  bg-default-100 p-2 rounded-lg hover:bg-default-200 cursor-pointer transition-colors'>
          <img src='ethereum-eth-logo.svg' alt='Etherium logo' className='w-6 h-8' />
          <span className='text-xl'>Etherium</span>
        </motion.div>


      </motion.div>
    </div>

  );
}

export const StepTwo = ({ setStep,
  setMnemonic, mnemonic }
  :
  {
    setStep: React.Dispatch<React.SetStateAction<Step>>,
    setMnemonic: React.Dispatch<React.SetStateAction<string | null>>,
    mnemonic: string | null
  }) => {

  const [hidden, setHidden] = useState(true);
  const [checked, setChecked] = useState(false);

  // Generate a 12-word mnemonic
  const createMnemonic = () => {
    const mn = generateMnemonic();
    setMnemonic(mn);
  }

  useEffect(() => {
    createMnemonic();
  }, [])

  const copyMnemonic = () => {
    if (!mnemonic) return;
    navigator.clipboard.writeText(mnemonic);
  }

  const handleClick = () => {
    setStep(3);
  }


  return (
    <>
      <h1 className='scroll-m-20 text-4xl sm:text-5xl font-bold tracking-tight text-center '>Secret Recovery Phrase</h1>
      <p className=' text-default-400 mt-4 text-wrap text-center'>
        Save these words in a safe place
      </p>

      <Card className="w-full mx-auto max-w-lg my-8 relative">
        <CardBody className={`${hidden ? "blur" : ""}  transition-all min-h-40`}>
          <div className='grid grid-cols-3 gap-6'>
            {
              mnemonic?.split(" ").map((word, i) => {
                return <span key={i} className='font-semibold' >
                  {i + 1 + ". " + word}
                </span>
              })
            }
          </div>
        </CardBody>
        <Divider />
        <CardFooter className='opacity-60 flex justify-around items-center' >
          <Button isIconOnly onClick={() => setHidden(!hidden)}>
            {hidden ? <IoEyeOff /> : <IoEye />}
          </Button>
          <Button isIconOnly onClick={copyMnemonic}>
            <IoCopy />
          </Button>


        </CardFooter>
      </Card>

      <Checkbox isSelected={checked} onValueChange={setChecked}>
        I have saved my secret recovery phrase
      </Checkbox>
      <Button isDisabled={!checked} size='lg' className="mt-8 " onClick={handleClick}>Next</Button>
    </>
  )
}

export const StepThree = ({ network, mnemonic }: { network: Network, mnemonic: string | null }) => {

    if(!mnemonic) return <div>Mnemonic secret not found</div>
  return (
    <>
      {network === "sol" && <SOL mnemonic={mnemonic} />}
      {network === "eth" && <ETH mnemonic={mnemonic} />}
    </>
  )
}
export default App