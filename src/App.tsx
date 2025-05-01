import Root from './pages/Main/MainRoute';
import { SEOProvider } from './components/ui/seo';

const App = () => {
    return (
        <SEOProvider>
            <Root />
        </SEOProvider>
    );
};

export default App;
