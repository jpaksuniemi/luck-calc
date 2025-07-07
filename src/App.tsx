import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'

const DivisionInput = ({setProbability}: {setProbability: React.Dispatch<React.SetStateAction<number>>}) => {
  const [nominator, setNominator] = useState(0.0);
  const [denominator, setDenominator] = useState(0.0);

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


  return (
    <div>
      <DivisionInput setProbability={setProbability}/>
      {probability != 0 ? probability : ''}
    </div>
  )
}

export default App
