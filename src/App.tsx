import { useState } from 'react'
import { useMemo } from 'react';
import { useEffect } from 'react';
import { binomialDistribution } from 'simple-statistics';
import './App.css'

const SuccessCountTable = ({probability, rolls}: {probability: number, rolls: number}) => {
  const distribution = binomialDistribution(rolls, probability);

  return (
    <table>
      <thead>
        <th>Drops</th>
        <th>Probability</th>
      </thead>
      <tbody>
        {distribution.map((value, index) => (
          <tr key={index}>
            <td>{index}</td>
            <td>{(value * 100).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const BinomialDistributionTable = ({probability, denominator}: {probability: number, denominator: number}) => {
  const atLeastOneSuccess = (count: number) => {
    return 1 - Math.pow(1 - probability, count);
  }

  const distribution = useMemo(() => {
    const results: Array<{ tries: number; probability: number }> = [];
    for (let count = denominator / 2; count <= denominator * 10; count += denominator / 2) {
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
            <td>{(row.probability * 100).toFixed(2)}</td>
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
    if (denominator > 0 && !isNaN(nominator) && !isNaN(denominator)) {
      setProbability(nominator / denominator);
    } else {
      setProbability(0);
    }
  }, [nominator, denominator]);
  
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
  const [rolls, setRolls] = useState(0);

  return (
    <div>
      <input type="number" value={rolls} onChange={e => setRolls(e.target.valueAsNumber)} />
      <DivisionInput setProbability={setProbability} setDenominator={setDenominator} denominator={denominator}/>
      {probability && <BinomialDistributionTable probability={probability} denominator={denominator} />}
      {probability && rolls && <SuccessCountTable probability={probability} rolls={rolls} />}
    </div>
  )
}

export default App