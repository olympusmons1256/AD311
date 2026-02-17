import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ContentA } from './components/ContentA';
import { ContentB } from './components/ContentB';
import { Button } from './components/SharedComponents';

function App() {
  return (
    <div className="App">
      <Header />
      <ContentA>
        <Button onClick={() => alert('Button in Content A clicked!')}>Click Me A</Button>
      </ContentA>
      <ContentB>
        <Button onClick={() => alert('Button in Content B clicked!')}>Click Me B</Button>
      </ContentB>
      <Footer />  
    </div>
  );
}

export default App;
