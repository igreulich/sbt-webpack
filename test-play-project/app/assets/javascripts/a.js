import 'jquery-knob';

import currentTime from './b';

console.log('The current time is', currentTime);

$('.dial').knob();

export default $('.time').html(currentTime);
