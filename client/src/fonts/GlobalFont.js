import { createGlobalStyle } from 'styled-components/macro'
import RalewayRegular from './Raleway/Raleway-Regular.ttf'
import RalewayBold from './Raleway/Raleway-Bold.ttf'
import RalewayLight from './Raleway/Raleway-Light.ttf'
import MetropolisExtraLight from './Metropolis-ExtraLight.otf'
import MetropolisLight from './Metropolis-Light.otf'
import MetropolisRegular from './Metropolis-Regular.otf'
import MetropolisSemiBold from './Metropolis-SemiBold.otf'
import MetropolisBold from './Metropolis-Bold.otf'
import MetropolisExtraBold from './Metropolis-ExtraBold.otf'
export default createGlobalStyle`
@font-face {
    font-family: "Raleway" ;
    src: url(${RalewayRegular});
    font-weight: 400;
}
@font-face {
    font-family: "Raleway" ;
    src: url(${RalewayBold});
    font-weight: 500;
}
@font-face {
    font-family: "Raleway" ;
    src: url(${RalewayLight});
    font-weight:300;
}

  @font-face {
    font-family: 'Metropolis';
    font-weight: 300;
    src: url(${MetropolisExtraLight});
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 400;
    src: url(${MetropolisLight});
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 500;
    src: url(${MetropolisRegular});
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 600;
    src: url(${MetropolisSemiBold});
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 700;
    src: url(${MetropolisBold});
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 800;
    src: url(${MetropolisExtraBold});
  }
`
