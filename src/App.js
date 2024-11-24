import { useState, useEffect } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

const cardImages = [
  { src: '/img/biryani.jpg', matched: false },
  { src: '/img/burger.jpg', matched: false },
  { src: '/img/pizza.jpg', matched: false },
  { src: '/img/puri.jpg', matched: false },
  { src: '/img/cake.jpg', matched: false },
  { src: '/img/jalebi.jpg', matched: false },
  { src: '/img/ice.jpg', matched: false },
  { src: '/img/ak.jpg', matched: false },
  { src: '/img/noodles.jpg', matched: false },
  { src: '/img/manchuria.jpg', matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [showWinImage, setShowWinImage] = useState(false);

  // Shuffle cards for new game
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setShowWinImage(false); // Reset win image
  };

  // Handle a choice
  const handleChoice = (card) => {
    console.log(card);
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Check for win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setShowWinImage(true);
      const audio = new Audio('/img/claps.mp3'); // Path to the audio file
      audio.play();
      setTimeout(() => {
        setShowWinImage(false);
        shuffleCards(); // Optionally reset the game after showing the win image
      }, 13000); // Show for 5 seconds
    }
  }, [cards]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  // Start new game automatically
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>

      <p>Turns: {turns}</p>

      {showWinImage && (
        <div className="win-image">
          <img src="/img/win-image.webp" alt="You Win!" />
        </div>
      )}
    </div>
  );
}

export default App;
