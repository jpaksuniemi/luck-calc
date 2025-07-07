import { useState } from 'react'
import { useMemo } from 'react';
import { useEffect } from 'react';
import './App.css'

const BinomialDistributionTable = ({probability, denominator}: {probability: number, denominator: number}) => {
  const atLeastOneSuccess = (count: number) => {
    return 1 - Math.pow(1 - probability, count);
  }

  const distribution = useMemo(() => {
    const results: Array<{ tries: number; probability: number }> = [];
    for (let count = denominator; count <= denominator * 10; count += denominator) {
      results.push({
        tries: count,
        probability: atLeastOneSuccess(count),
      });
    }
    return results;
  }, [probability, denominator]);


  return (
    <table>
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
            <td>{row.probability.toFixed(3)}</td>
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
  const [nominator, setNominator] = useState(0.0);

  useEffect(() => {
    if (denominator !== 0 && !isNaN(nominator) && !isNaN(denominator)) {
      setProbability(nominator / denominator);
    } else {
      setProbability(0);
    }
  }, [nominator, denominator, setProbability]);
  
  return (
    <div>
      <input 
        type="number" 
        value={nominator} 
        onChange={e => setNominator(e.target.valueAsNumber)}
      />
      <p>/</p>
      <input 
        type="number"  
        value={denominator}
        onChange={e => setDenominator(e.target.valueAsNumber)}
      />
    </div>
  )
}

const App = () => {
  const [probability, setProbability] = useState(0.0);
  const [denominator, setDenominator] = useState(0.0);

  return (
    <div>
      <DivisionInput setProbability={setProbability} setDenominator={setDenominator} denominator={denominator}/>
      {probability != 0 ? probability : ''}
      {denominator && <BinomialDistributionTable probability={probability} denominator={denominator} />}
    </div>
  )
}

export default App
