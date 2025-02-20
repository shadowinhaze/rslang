import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Stack } from "@mui/material";
import { ShuffleArray } from "../../../../utils/shuffle-array";
import { checkIsLearned } from "../../../../utils/check-is-learned";
import { UpdateUserWord } from "../../../../api/update-user_word";
import { AddUserWord } from "../../../../api/add-user_word";
import { RootState } from "../../../../store";
import './answers.scss';
import { formatDate } from "../../../../utils/format-date";

const answerStats = {
  userId: '',
  userToken: '',
  wordId: '',
  updateReq: {
    difficulty: '',
    optional: {
      audioStreak: '',
      learned: {
        date: '',
        game: '',
      }
    },
  },
}

const Answers = ({ options, isAnswered, setNextQuestion, setAnsweredWords, setIsAnswered }: {
  options: Word[],
  isAnswered: boolean,
  setNextQuestion: () => void,
  setAnsweredWords: (word: { word: Word, flag: boolean }) => void,
  setIsAnswered: (flag: boolean) => void,
}) => {

  const { userId, token } = useSelector((state: RootState) => state.user);
  answerStats.userId = userId;
  answerStats.userToken = token;

  const [words, setWords] = useState<Word[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<Word>();
  const [answer, setAnswer] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isAnswered && options.length !== 0) {
      setCorrectAnswer(options[0]);
      setWords(ShuffleArray(options));
    }
  }, [isAnswered, options]);

  useEffect(() => {
    if (correctAnswer) {
      if (isAnswered) {
        setCollapsed(true);
      }
      if (collapsed) {
        return;
      }
      const handleKeyUp = (event: KeyboardEvent) => {
        const selectedIdx = Number.parseInt(event.key)
        if (selectedIdx > 0 && selectedIdx < 6) {
          setCollapsed(true);
          checkAnswer(words[selectedIdx - 1].wordTranslate);
        }
      }
      window.addEventListener("keyup", handleKeyUp);
      return () => window.removeEventListener("keyup", handleKeyUp);
    }
  }, [correctAnswer, isAnswered, collapsed]);

  useEffect(() => {
    setAnswer('');
  }, [correctAnswer]);

  const checkAnswer = (word: string) => {
    if (!isAnswered) {
      setIsAnswered(true);
      if (word === (correctAnswer as Word).wordTranslate) {
        setAnsweredWords({ word: (correctAnswer as Word), flag: true });
        if (userId) saveAnswer('1');
      } else {
        setAnswer(word);
        setAnsweredWords({ word: (correctAnswer as Word), flag: false });
        if (userId) saveAnswer('0');
      }
    }
  };

  const saveAnswer = (flag: string) => {
    answerStats.wordId = correctAnswer?._id as string;
    answerStats.updateReq.optional.audioStreak = flag;
    if ((correctAnswer as Word).userWord) {
      if ((correctAnswer as Word).userWord?.optional) {
        const answers = (correctAnswer as Word).userWord?.optional?.audioStreak + flag;
        const status = (correctAnswer as Word).userWord?.difficulty || 'learning';
        answerStats.updateReq.optional.audioStreak = answers;
        if (flag === '0') {
          answerStats.updateReq.difficulty = status === 'learned' ? 'learning' : status;
        } else {
          if (checkIsLearned(answers, status)) {
            answerStats.updateReq.difficulty = 'learned';
            answerStats.updateReq.optional.audioStreak = ' ';
            answerStats.updateReq.optional.learned = {
              date: formatDate(),
              game: 'audiocall',
            }
          } else {
            answerStats.updateReq.difficulty = status;
          }
        }
      }
      UpdateUserWord(answerStats);
    } else {
      AddUserWord(answerStats);
    }
  }

  const skipQuestion = (): void => {
    if (!isAnswered) {
      setIsAnswered(true);
      if (userId) saveAnswer('0');
      setAnsweredWords({ word: (correctAnswer as Word), flag: false });
    }
  };

  const showNextQuestion = (): void => {
    setIsAnswered(false);
    setNextQuestion();
    setCollapsed(false);
  };

  const getButtonStyle = (word: string) => {
    if (isAnswered && (word === (correctAnswer as Word).wordTranslate)) {
      return 'success';
    }
    if (isAnswered && (word === answer)) {
      return 'error';
    }
    return 'primary'
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        {words.map((word) => {
          return <Button
            variant="outlined"
            key={word._id}
            onClick={() => checkAnswer(word.wordTranslate)}
            color={getButtonStyle(word.wordTranslate)}
          >
            {word.wordTranslate}
          </Button>
        })}
      </Stack>
      <Box
        sx={{ p: 4, textAlign: "center" }}
      >
        {
          isAnswered ?
            <Button
              variant="contained"
              onClick={showNextQuestion}
            >
              {'дальше'}
            </Button> :
            <Button
              autoFocus={true}
              variant="contained"
              onClick={skipQuestion}
            >
              {'не знаю'}
            </Button>
        }
      </Box>
    </div >
  );
};

export { Answers };
