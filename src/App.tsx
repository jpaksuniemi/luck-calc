import { useState, type SetStateAction } from 'react'
import { useMemo } from 'react';
import { useEffect } from 'react';
import { binomialDistribution } from 'simple-statistics';
import './App.css'

const NumberInput = ({value, onChange, placeholder}: {
  value: number,
  onChange: React.Dispatch<SetStateAction<number>>,
  placeholder?: string
}) => (
  <input
    type="number"
    value={value}
    onChange={e => onChange(e.target.valueAsNumber)}
    placeholder={placeholder}
    className="flex-initial border border-gray-300 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
  />
);


const SuccessCountTable = ({probability, rolls}: {probability: number, rolls: number}) => {
    const distribution = binomialDistribution(Math.floor(rolls), probability);

    return (
      <table className='border-separate border-spacing-x-8'>
        <thead>
          <tr>
            <th>Drops</th>
            <th>Probability</th>
          </tr>
        </thead>
        <tbody>
          {distribution.map((value, index) => (
            (value > 0.002) ?
            <tr key={index}>
              <td>{index}</td>
              <td>{(value * 100).toFixed(2)}%</td>
            </tr>
            : ''
          ))}
        </tbody>
      </table>
    )
}

const BinomialDistributionTable = ({probability, denominator, rolls}: {probability: number, denominator: number, rolls: number}) => {
  const atLeastOneSuccess = (count: number) => {
    return 1 - Math.pow(1 - probability, count);
  }

  const distribution = useMemo(() => {
    const results: Array<{ tries: number; probability: number }> = [];
    if (rolls > 0 && !isNaN(rolls)) {
      results.push({ tries: rolls, probability: atLeastOneSuccess(rolls) });
    }
    for (let count = denominator / 2; count <= denominator * 10; count += denominator / 2) {
      results.push({
        tries: count,
        probability: atLeastOneSuccess(count),
      });
    }
    return results;
  }, [rolls, probability, denominator]);

  return (
    <table className='border-separate border-spacing-x-8 text-left'>
      <thead>
        <tr>
          <th>KC</th>
          <th>Probability</th>
        </tr>
      </thead>
      <tbody>
        {distribution.map((row, index) => (
          <tr key={index}>
            <td>{row.tries}</td>
            <td>{(row.probability * 100).toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
} 

const DivisionInput = ({setProbability, setDenominator, denominator}: {
  setProbability: React.Dispatch<React.SetStateAction<number>>,
  setDenominator: React.Dispatch<React.SetStateAction<number>>,
  denominator: number
}) => {
  const [numerator, setNumerator] = useState(0.0);

  useEffect(() => {
    if (denominator > 0 && !isNaN(numerator) && !isNaN(denominator)) {
      setProbability(numerator / denominator);
    } else {
      setProbability(0);
    }
  }, [numerator, denominator]);
  
  return (
    <div className='flex items-center col-start-2'>
      <NumberInput value={numerator} onChange={setNumerator} placeholder='Numerator' />
      <p className='text-3xl'>/</p>
      <NumberInput value={denominator} onChange={setDenominator} placeholder='Denominator' />
    </div>
  )
}

const App = () => {
  const [probability, setProbability] = useState(0.0);
  const [denominator, setDenominator] = useState(0.0);
  const [rolls, setRolls] = useState(0.0);

  return (
    <div className='flex flex-wrap justify-center items-center'>
      <div className='grid grid-cols-2 grid-rows-2 m-20 items-center gap-5 text-center'>
        <label htmlFor="">Droprate:</label>
        <DivisionInput setProbability={setProbability} setDenominator={setDenominator} denominator={denominator}/>
        <label htmlFor="">KC: </label>
        <span className='items-center'>
          <NumberInput value={rolls} onChange={setRolls} placeholder='KC' />
        </span>
      </div>

      {
      (probability) ?
      <div className='m-20'>
        <BinomialDistributionTable probability={probability} denominator={denominator} rolls={rolls}/> 
      </div>
      : null
      }

      {
      (probability && rolls) ?
      <div className='m-20'>
        <SuccessCountTable probability={probability} rolls={rolls} />
      </div>
      : null
      }
    </div>
  )
}

export default App