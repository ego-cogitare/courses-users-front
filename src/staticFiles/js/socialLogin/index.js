import Facebook from './facebook';
import Twitter from './twitter';
import GooglePlus from './googleplus';
import LinkedIn from './linkedin';

export default {
  facebook   : new Facebook(),
  twitter    : new Twitter(),
  googlePlus : new GooglePlus(),
  linkedIn   : new LinkedIn()
}
