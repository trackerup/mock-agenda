export default values => {
  if (Array.isArray(values)) {
    return values[values.length - 1]
  }
  return values
}

/**
 <div id="app">
    <span>{{ consoles | last }}</span> <!-- Result: Atari -->
 </div>

 new Vue({
    el: '#app',

    data: {
        consoles: ['PlayStation', 'Nintendo DS', 'Xbox', 'Atari']
    }
  });

 **/
