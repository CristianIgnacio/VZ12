import MainController 	from './main/main-controller';
import BencinaService 	from './main/bencina-service';
import Filters 			from './main/filters';

export default app  => {
  MainController(app);
  BencinaService(app);
  Filters(app);
};

