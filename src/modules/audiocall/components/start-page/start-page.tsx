import React, { BaseSyntheticEvent, useState } from "react";
import { Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import QuestionPage from "../question-page";

import './start-page.scss';

const StartPage = () => {

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('');

  if (isGameStarted) {
    return (
      <QuestionPage d={difficulty} />
    )
  } else {
    return (
      <div className="start-page">
        <h2>Аудиовызов</h2>
        <p>Вам необходимо выбрать правильный перевод слова основываясь на услышанном аудио</p>
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Сложность</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(d: BaseSyntheticEvent) => setDifficulty(d.target.value)}
          >
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => { setIsGameStarted(true) }}
          disabled={difficulty.length === 0}
        >Начать</Button>
      </div>
    )
  }
};

export default StartPage;
